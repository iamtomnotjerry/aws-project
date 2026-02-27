import { ApiUtils } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/cache";
import { logger } from "@/lib/logger";

export async function GET() {
  const status = {
    database: "down",
    redis: "down",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;
    status.database = "up";

    // Check Redis
    if (redis) {
      await redis.ping();
      status.redis = "up";
    } else if (process.env.NODE_ENV === 'development') {
      status.redis = "bypassed (local)";
    }

    const isHealthy = status.database === "up" && (status.redis === "up" || process.env.NODE_ENV === 'development');

    return ApiUtils.success(status, isHealthy ? "System healthy" : "System degraded", isHealthy ? 200 : 503);
  } catch (error) {
    logger.error("Health check failed", error);
    return ApiUtils.error("System Unhealthy", 503, status);
  }
}
