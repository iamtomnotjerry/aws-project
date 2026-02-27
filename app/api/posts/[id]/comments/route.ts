import { ApiUtils } from "@/lib/api-response";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { CommentService } from "@/services/comment.service";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const comments = await CommentService.getComments(postId);
    return ApiUtils.success(comments);
  } catch (error) {
    logger.error("Error fetching comments", error, { route: "GET /api/posts/[id]/comments" });
    return ApiUtils.serverError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return ApiUtils.error("Authentication required to comment", 401);
    }

    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const rl = await rateLimit(`comment_${ip}`, { limit: 5, windowMs: 60000 });
    if (!rl.success) {
      return ApiUtils.error("Too many comments. Please try again later.", 429);
    }

    const { id: postId } = await params;
    const { content, parentId } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return ApiUtils.error("Comment content is required", 400);
    }

    if (content.length > 5000) {
      return ApiUtils.error("Comment is too long (max 5000 characters)", 400);
    }

    const newComment = await CommentService.createComment(
      postId,
      session.user.id,
      content,
      parentId
    );

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${postId}`);

    return ApiUtils.success(newComment, "Comment created", 201);
  } catch (error) {
    logger.error("Error creating comment", error, { route: "POST /api/posts/[id]/comments" });
    return ApiUtils.serverError(error);
  }
}
