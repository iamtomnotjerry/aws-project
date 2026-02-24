import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export class LikeService {
  /**
   * Toggle like on a post. Uses a transaction to atomically update the denormalized counter.
   * Returns the new liked state and total likes count.
   */
  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const result = await prisma.$transaction(async (tx: TxClient) => {
      const existingLike = await tx.like.findUnique({
        where: {
          postId_userId: { postId, userId },
        },
      });

      if (existingLike) {
        await tx.like.delete({ where: { id: existingLike.id } });
        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        });
        return { liked: false, likesCount: Math.max(0, updatedPost.likesCount) };
      } else {
        await tx.like.create({ data: { postId, userId } });
        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        });
        return { liked: true, likesCount: updatedPost.likesCount };
      }
    });

    logger.debug("Like toggled", { postId, userId, liked: result.liked });
    return result;
  }

  /**
   * Check if a user has liked a specific post.
   */
  static async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    return !!like;
  }

  /**
   * Reconcile denormalized likesCount with actual Like records.
   * Should be called periodically (e.g., cron job) to fix any counter drift.
   */
  static async reconcileCounters(): Promise<number> {
    const posts = await prisma.post.findMany({
      select: { id: true, likesCount: true },
    });

    let fixedCount = 0;

    for (const post of posts) {
      const actualCount = await prisma.like.count({ where: { postId: post.id } });
      if (actualCount !== post.likesCount) {
        await prisma.post.update({
          where: { id: post.id },
          data: { likesCount: actualCount },
        });
        fixedCount++;
        logger.info("Reconciled likesCount", {
          postId: post.id,
          was: post.likesCount,
          now: actualCount,
        });
      }
    }

    return fixedCount;
  }
}
