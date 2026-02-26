import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { CacheService } from "@/lib/cache";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export class LikeService {
  /**
   * Toggle like and invalidate post feed cache to keep counters fresh.
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

    // Invalidate global posts version so the homepage feed shows updated like counts
    await CacheService.increment("posts:version");
    
    logger.debug("Like toggled and cache version bumped", { postId, userId });
    return result;
  }

  static async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    return !!like;
  }

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
      }
    }
    return fixedCount;
  }
}
