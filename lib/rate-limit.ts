import { logger } from "./logger";
import { redis } from "./cache";

interface RateLimitOptions {
  limit: number;     // Max requests per window
  windowMs: number;  // Window size in milliseconds
}

// Atomic Lua script: INCR + conditional PEXPIRE in a single round-trip
const RATE_LIMIT_LUA = `
  local current = redis.call('INCR', KEYS[1])
  if current == 1 then
    redis.call('PEXPIRE', KEYS[1], ARGV[1])
  end
  return current
`;

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
      const current = await redis.eval(RATE_LIMIT_LUA, 1, key, options.windowMs) as number;
      if (current > options.limit) {
        logger.warn('Rate limit exceeded (Redis)', { identifier, current, limit: options.limit });
        return { success: false, remaining: 0 };
      }
      return { success: true, remaining: options.limit - current };
    } catch (err) {
      logger.error('Redis rate limiter error, falling back to accept', err);
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

    logger.warn('Rate limit exceeded (Memory)', { identifier });
    return { success: false, remaining: 0 };
  }
}
