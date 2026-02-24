import { ApiUtils } from "@/lib/api-response";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { LikeService } from "@/services/like.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return ApiUtils.error("Authentication required", 401);
    }

    const { id: postId } = await params;
    const result = await LikeService.toggleLike(postId, session.user.id);

    return ApiUtils.success(
      { liked: result.liked, likes: result.likesCount },
      result.liked ? "Liked" : "Unliked"
    );
  } catch (error) {
    logger.error("Error toggling like", error, { route: "POST /api/posts/[id]/like" });
    return ApiUtils.serverError(error);
  }
}

