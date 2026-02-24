import { logger } from "./logger";
import Redis from "ioredis";

// Instantiate the Redis client safely. 
// Uses process.env.REDIS_URL in production, otherwise falls back to a dummy/memory client locally if missing.
const redisUrl = process.env.REDIS_URL;
export const redis = redisUrl ? new Redis(redisUrl, {
  connectTimeout: 3000,
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 2) return null; // Stop retrying after 2 attempts
    return Math.min(times * 50, 2000);
  }
}) : null;
const memoryFallback = new Map<string, { data: string; expiresAt: number }>();

if (!redisUrl) {
  logger.warn("REDIS_URL is strictly required for Production! Using memory fallback locally.");
} else if (redis) {
  redis.on('error', (err) => {
    logger.error('Redis connection error. Will fallback to memory cache if request fails:', err);
  });
}

// PROD-3: Periodic cleanup of expired memory cache entries to prevent leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, val] of memoryFallback) {
      if (now > val.expiresAt) {
        memoryFallback.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      logger.debug(`Memory cache cleanup: evicted ${cleaned} expired entries`);
    }
  }, 60_000);
}

export class CacheService {
  static async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (redis) {
        await redis.setex(key, ttlSeconds, data);
      } else {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        memoryFallback.set(key, { data, expiresAt });
      }
    } catch (err) {
      logger.error(`Cache SET error for key ${key}`, err);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      if (redis) {
        const cached = await redis.get(key);
        return cached ? JSON.parse(cached) : null;
      } else {
        const cached = memoryFallback.get(key);
        if (!cached) return null;
        if (Date.now() > cached.expiresAt) {
          memoryFallback.delete(key);
          return null;
        }
        return JSON.parse(cached.data);
      }
    } catch (err) {
      logger.error(`Cache GET error for key ${key}`, err);
      return null;
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      if (redis) {
        await redis.del(key);
      } else {
        memoryFallback.delete(key);
      }
      logger.debug(`Cache invalidated: ${key}`);
    } catch (err) {
      logger.error(`Cache INVALIDATE error for key ${key}`, err);
    }
  }
}
