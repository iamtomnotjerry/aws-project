import { ApiUtils } from "@/lib/api-response";
import { postSchema } from "@/schemas/post.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { PostService } from "@/services/post.service";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (GET requests - e.g. 100 per 10s)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(`get_posts_${ip}`, { limit: 100, windowMs: 10000 });
    if (!rl.success) {
      return ApiUtils.error("Too Many Requests", 429, { ip });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limitParams = searchParams.get("limit");
    // Secure input validation on limit
    const limit = limitParams ? Math.min(parseInt(limitParams), 50) : 10;

    const result = await PostService.getPosts(limit, cursor);

    return ApiUtils.success(result);
  } catch (error) {
    return ApiUtils.serverError(error, { route: "GET /api/posts" });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (POST requests - e.g. 5 per 10s)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(`create_post_${ip}`, { limit: 5, windowMs: 10000 });
    if (!rl.success) {
      return ApiUtils.error("Too Many Requests. Please slow down.", 429, { ip });
    }

    // 2. Authentication Context
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      logger.warn("Unauthorized Post creation attempt", { user: session?.user?.id, ip });
      return ApiUtils.error("Unauthorized. Admin role required.", 403);
    }

    // 3. Request Validation
    const body = await req.json();
    const validatedData = postSchema.safeParse(body);
    
    if (!validatedData.success) {
      return ApiUtils.error(validatedData.error.issues[0].message, 400, {
        validationErrors: validatedData.error.format()
      });
    }

    // 4. Business Logic execution
    const post = await PostService.createPost(validatedData.data, session.user.id);

    logger.info("Post created successfully", { postId: post.id, authorId: session.user.id });
    return ApiUtils.success(post, "Post created successfully", 201);
  } catch (error) {
    return ApiUtils.serverError(error, { route: "POST /api/posts" });
  }
}
