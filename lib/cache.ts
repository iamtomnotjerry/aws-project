import { logger } from "./logger";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";
import { CircuitBreaker } from "./circuit-breaker";

// Instantiate the Redis client safely. 
const redisUrl = process.env.REDIS_URL;
export const redis = redisUrl ? new Redis(redisUrl, {
  connectTimeout: 5000, // Increase timeout for initial handshake
  maxRetriesPerRequest: 1,
  commandTimeout: 2000, 
  tls: redisUrl.startsWith("rediss") ? {
    // AWS ElastiCache Serverless requires TLS.
    // ioredis typically handles rediss:// automatically, but explicit {} ensures it.
    rejectUnauthorized: false // Bypass self-signed/internal cert issues if any
  } : undefined,
  retryStrategy(times) {
    if (times > 2) return null;
    return Math.min(times * 100, 2000);
  }
}) : null;

// L1 Cache: Bounded memory to prevent OOM. Max 5000 items, TTL handled by LRU.
const l1Cache = new LRUCache<string, string>({
  max: 5000,
  ttl: 1000 * 60 * 5, // 5 minutes max in L1
});

const redisCircuitBreaker = new CircuitBreaker("RedisCache", {
  failureThreshold: 3,
  resetTimeout: 15000,
});

if (!redisUrl) {
  logger.warn("REDIS_URL is strictly required for Production! Using L1 LRU fallback locally.");
} else if (redis) {
  redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
  });
}

export class CacheService {
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
        return JSON.parse(l1Data);
      }

      // 2. Check L2 Redis
      if (redis && !redisCircuitBreaker.isOpen()) {
        const cached = await redisCircuitBreaker.fire(() => redis.get(key));
        if (cached) {
           // Backfill L1
           l1Cache.set(key, cached, { ttl: 1000 * 60 }); 
           return JSON.parse(cached);
        }
      }
      
      return null;
    } catch (err) {
      logger.error(`Cache GET error for key ${key}`, err);
      return null; // Graceful degradation on Redis failure
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      l1Cache.delete(key);
      
      if (redis && !redisCircuitBreaker.isOpen()) {
        await redisCircuitBreaker.fire(() => redis.del(key));
      }
      logger.debug(`Cache invalidated: ${key}`);
    } catch (err) {
      logger.error(`Cache INVALIDATE error for key ${key}`, err);
    }
  }
}

