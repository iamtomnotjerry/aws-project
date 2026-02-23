import { ApiUtils } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    // Fetch ALL comments for this post to build the tree manually
    const allComments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Simple nesting logic with proper Types
    type CommentWithUser = typeof allComments[0] & { replies: CommentWithUser[] };
    const commentMap = new Map<string, CommentWithUser>();
    const roots: CommentWithUser[] = [];

    // Initialize mapping
    allComments.forEach((c) => {
      const commentWithReplies = { ...c, replies: [] as CommentWithUser[] };
      commentMap.set(c.id, commentWithReplies);
    });

    // Build the tree
    allComments.forEach((c) => {
      const commentWithReplies = commentMap.get(c.id)!;
      if (c.parentId) {
        const parent = commentMap.get(c.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        } else {
          // If parent is missing (e.g. deleted), treat as root
          roots.push(commentWithReplies);
        }
      } else {
        roots.push(commentWithReplies);
      }
    });

    return ApiUtils.success(roots);
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
      return ApiUtils.error("Bạn cần đăng nhập để bình luận", 401);
    }

    const { id: postId } = await params;
    const { content, parentId } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return ApiUtils.error("Nội dung không hợp lệ", 400);
    }

    // Execute logic as a database transaction to increment commentsCount
    const newComment = await prisma.$transaction(async (tx: TxClient) => {
      const created = await tx.comment.create({
        data: {
          content,
          postId,
          userId: session.user.id,
          parentId: parentId || null,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
              role: true,
            },
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      });

      return created;
    });

    return ApiUtils.success(newComment, "Bình luận thành công", 201);
  } catch (error) {
    logger.error("Error creating comment", error, { route: "POST /api/posts/[id]/comments" });
    return ApiUtils.serverError(error);
  }
}
