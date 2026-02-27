import { ApiUtils } from "@/lib/api-response";
import { PostService } from "@/services/post.service";
import { NextResponse } from "next/server";

/**
 * Lightweight endpoint for client-side synchronization.
 * Polled by React Query to detect if it needs to invalidate the local cache.
 */
export async function GET() {
  try {
    const version = await PostService.getGlobalVersion();
    return ApiUtils.success({ version });
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
