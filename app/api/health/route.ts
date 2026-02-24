import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/cache";

export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    uptime: `${Math.floor(process.uptime())}s`,
  };

  try {
    // Probe PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch {
    checks.database = "disconnected";
    checks.status = "degraded";
  }

  try {
    // Probe Redis
    if (redis) {
      const pong = await redis.ping();
      checks.redis = pong === "PONG" ? "connected" : "error";
    } else {
      checks.redis = "not_configured";
    }
  } catch {
    checks.redis = "disconnected";
    checks.status = "degraded";
  }

  const httpStatus = checks.status === "ok" ? 200 : 503;
  return NextResponse.json(checks, { status: httpStatus });
}
