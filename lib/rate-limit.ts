import { logger } from "./logger";
import { redis } from "./cache";

interface RateLimitOptions {
  limit: number;     // Tokens added per window
  windowMs: number;  // Window size in milliseconds
}

// Memory fallback for token bucket
interface RateLimitInfo {
  tokens: number;
  lastRefill: number;
}
const rateLimiterCache = new Map<string, RateLimitInfo>();

export async function rateLimit(identifier: string, options: RateLimitOptions = { limit: 10, windowMs: 10000 }) {
  if (redis) {
    const key = `ratelimit:${identifier}`;
    try {
      // Basic Redis fixed window (simpler than lua token bucket but effective)
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.pexpire(key, options.windowMs);
      }
      if (current > options.limit) {
        logger.warn('Rate limit exceeded (Redis)', { identifier, options, current });
        return { success: false, remaining: 0 };
      }
      return { success: true, remaining: options.limit - current };
    } catch (err) {
      logger.error('Redis Rate limiter error, falling back to accept', err);
      return { success: true, remaining: 1 };
    }
  } else {
    // Memory fallback (token bucket)
    const now = Date.now();
    const info = rateLimiterCache.get(identifier);

    if (!info) {
      rateLimiterCache.set(identifier, { tokens: options.limit - 1, lastRefill: now });
      return { success: true, remaining: options.limit - 1 };
    }

    const timePassed = now - info.lastRefill;
    const tokensToAdd = Math.floor(timePassed / options.windowMs) * options.limit;

    if (tokensToAdd > 0) {
      info.tokens = Math.min(options.limit, info.tokens + tokensToAdd);
      info.lastRefill = now;
    }

    if (info.tokens > 0) {
      info.tokens -= 1;
      return { success: true, remaining: info.tokens };
    }

    logger.warn('Rate limit exceeded (Memory)', { identifier, options });
    return { success: false, remaining: 0 };
  }
}
