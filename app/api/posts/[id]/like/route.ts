import { ApiUtils } from "@/lib/api-response";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { LikeService } from "@/services/like.service";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return ApiUtils.error("Authentication required", 401);
    }

    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`like_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.success) {
      return ApiUtils.error("Too many requests. Please try again later.", 429);
    }

    const { id: postId } = await params;
    const result = await LikeService.toggleLike(postId, session.user.id);

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${postId}`);

    return ApiUtils.success(
      { liked: result.liked, likes: result.likesCount },
      result.liked ? "Liked" : "Unliked"
    );
  } catch (error) {
    logger.error("Error toggling like", error, { route: "POST /api/posts/[id]/like" });
    return ApiUtils.serverError(error);
  }
}

