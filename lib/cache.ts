import { logger } from "./logger";
import Redis from "ioredis";

// Instantiate the Redis client safely. 
// Uses process.env.REDIS_URL in production, otherwise falls back to a dummy/memory client locally if missing.
const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;
const memoryFallback = new Map<string, { data: string; expiresAt: number }>();

if (!redisUrl) {
  logger.warn("REDIS_URL is strictly required for Production! Using memory fallback locally.");
}

export class CacheService {
  static async set(key: string, value: any, ttlSeconds: number): Promise<void> {
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
