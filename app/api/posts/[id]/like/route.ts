import { ApiUtils } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return ApiUtils.error("Bạn cần đăng nhập để thực hiện hành động này", 401);
    }

    const { id: postId } = await params;
    const userId = session.user.id;

    // Execute Like Toggle as a strict database transaction
    const result = await prisma.$transaction(async (tx: TxClient) => {
      const existingLike = await tx.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      if (existingLike) {
        // Remove like and decrement count
        await tx.like.delete({
          where: { id: existingLike.id },
        });
        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        });
        return { liked: false, likes: updatedPost.likesCount };
      } else {
        // Add like and increment count
        await tx.like.create({
          data: { postId, userId },
        });
        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        });
        return { liked: true, likes: updatedPost.likesCount };
      }
    });

    return ApiUtils.success(result, result.liked ? "Liked" : "Unliked");
  } catch (error) {
    logger.error("Error toggling like", error, { route: "POST /api/posts/[id]/like" });
    return ApiUtils.serverError(error);
  }
}

