import { logger } from "./logger";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";
import { CircuitBreaker } from "./circuit-breaker";

// Instantiate the Redis client safely. 
const redisUrl = process.env.REDIS_URL?.replace(/"/g, ''); 
const isAwsRedis = redisUrl?.includes('cache.amazonaws.com');
const isLocal = process.env.NODE_ENV === 'development';

// Nếu là AWS Redis nhưng chạy ở Local (không có VPN/Tunnel) thì bỏ qua để tránh treo máy
export const redis = (redisUrl && (!isLocal || !isAwsRedis)) ? new Redis(redisUrl, {
  connectTimeout: 5000, 
  maxRetriesPerRequest: 1,
  commandTimeout: 2000, 
  family: 4, 
  lazyConnect: true, // Don't block on startup
  tls: redisUrl.startsWith("rediss") ? {
    rejectUnauthorized: false
  } : undefined,
  retryStrategy: (times) => times > 2 ? null : 1000
}) : null;

if (isLocal && isAwsRedis) {
  console.warn('⚠️ [Redis] Detected AWS Redis URL in Local Dev. Bypassing to avoid ETIMEDOUT. Use local Redis or leave REDIS_URL empty for dev.');
}


// L1 Cache: Bounded memory to prevent OOM. Max 5000 items, TTL handled by LRU.
const l1Cache = new LRUCache<string, string>({
  max: 5000,
  ttl: 1000 * 60 * 5, // 5 minutes max in L1
});

const redisCircuitBreaker = new CircuitBreaker("RedisCache", {
  failureThreshold: 3,
  resetTimeout: 15000,
});

// Pub/Sub Client for invalidation
const pubClient = redis ? redis.duplicate() : null;
const subClient = redis ? redis.duplicate() : null;

const INVALIDATION_CHANNEL = "cache:invalidation";

if (subClient) {
  subClient.subscribe(INVALIDATION_CHANNEL, (err) => {
    if (err) logger.error("Failed to subscribe to invalidation channel", err);
  });

  subClient.on("message", (channel, message) => {
    if (channel === INVALIDATION_CHANNEL) {
      const { key, action } = JSON.parse(message);
      l1Cache.delete(key);
      logger.debug(`L1 Cache sync: ${action} for key ${key}`);
    }
  });
}

if (!redisUrl) {
  logger.warn("REDIS_URL is strictly required for Production! Using L1 LRU fallback locally.");
} else if (redis) {
  redis.on('connect', () => {
    console.log('[Redis] Connection attempt initiated to:', new URL(redisUrl).hostname);
  });

  redis.on('ready', () => {
    console.log('[Redis] Status: READY');
  });

  redis.on('error', (err: any) => {
    console.error('[Redis] Connection Error:', {
      code: err.code,
      message: err.message,
      host: err.address
    });
  });

  redis.on('close', () => {
    console.warn('[Redis] Connection CLOSED');
  });
}

export class CacheService {
  private static async broadcast(key: string, action: 'invalidate' | 'increment'): Promise<void> {
    if (pubClient && !redisCircuitBreaker.isOpen()) {
      try {
        await pubClient.publish(INVALIDATION_CHANNEL, JSON.stringify({ key, action }));
      } catch (err) {
        logger.error(`Failed to broadcast invalidation for ${key}`, err);
      }
    }
  }

  static async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      
      // Always write to L1 for immediate subsequent reads
      l1Cache.set(key, data, { ttl: ttlSeconds * 1000 });

      if (redis && !redisCircuitBreaker.isOpen()) {
        await redisCircuitBreaker.fire(() => redis.setex(key, ttlSeconds, data));
      }
    } catch (err) {
      logger.error(`Cache SET error for key ${key}`, err);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      // 1. Check L1 Cache (Instant, no network overhead)
      const l1Data = l1Cache.get(key);
      if (l1Data) {
        try {
          return JSON.parse(l1Data);
        } catch {
          return l1Data as unknown as T; // Fallback for raw strings
        }
      }

      // 2. Check L2 Redis
      if (redis && !redisCircuitBreaker.isOpen()) {
        const cached = await redisCircuitBreaker.fire(() => redis.get(key));
        if (cached) {
           // Backfill L1
           l1Cache.set(key, cached, { ttl: 1000 * 60 }); 
           try {
             return JSON.parse(cached);
           } catch {
             return cached as unknown as T;
           }
        }
      }
      
      return null;
    } catch (err) {
      logger.error(`Cache GET error for key ${key}`, err);
      return null; // Graceful degradation on Redis failure
    }
  }

  static async increment(key: string): Promise<number> {
    try {
      // 1. Proactively increment local L1 state to handle non-Redis environments
      const current = l1Cache.get(key);
      const nextVal = (parseInt(current || "0") + 1);
      l1Cache.set(key, nextVal.toString());

      let newVal = nextVal;
      // 2. Atomic increment in Redis if available (truth)
      if (redis && !redisCircuitBreaker.isOpen()) {
        newVal = await redisCircuitBreaker.fire(() => redis.incr(key));
        l1Cache.set(key, newVal.toString()); // Re-sync L1 with Redis truth
      }
      
      // 3. Broadcast to other instances
      await this.broadcast(key, 'increment');
      return newVal;
    } catch (err) {
      logger.error(`Cache INCR error for key ${key}`, err);
      return 0;
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      l1Cache.delete(key);
      
      if (redis && !redisCircuitBreaker.isOpen()) {
        await redisCircuitBreaker.fire(() => redis.del(key));
      }

      // Broadcast to other instances
      await this.broadcast(key, 'invalidate');
      logger.debug(`Cache invalidated: ${key}`);
    } catch (err) {
      logger.error(`Cache INVALIDATE error for key ${key}`, err);
    }
  }
}

