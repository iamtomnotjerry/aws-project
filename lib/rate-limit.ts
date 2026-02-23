import { logger } from "./logger";

// Simple in-memory rate limiter using a Token Bucket algorithm
// Ideal for single-instance or sticky sessions. For multi-instance, replace with Redis.
interface RateLimitInfo {
  tokens: number;
  lastRefill: number;
}

const rateLimiterCache = new Map<string, RateLimitInfo>();

interface RateLimitOptions {
  limit: number;     // Tokens added per window
  windowMs: number;  // Window size in milliseconds
}

export function rateLimit(identifier: string, options: RateLimitOptions = { limit: 10, windowMs: 10000 }) {
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

  logger.warn('Rate limit exceeded', { identifier, options });
  return { success: false, remaining: 0 };
}
