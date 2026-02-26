import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { Comment } from "@/types";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export class CommentService {
  static async getComments(postId: string, page: number = 0, pageSize: number = 20): Promise<Comment[]> {
    const start = page * pageSize;
    
    const roots = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "desc" },
      skip: start,
      take: pageSize,
      include: {
        user: {
          select: { name: true, image: true, role: true },
        },
        replies: {
          take: 5,
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { name: true, image: true, role: true } },
          }
        }
      },
    });

    return roots as unknown as Comment[];
  }

  static async createComment(
    postId: string,
    userId: string,
    content: string,
    parentId?: string | null
  ): Promise<Comment> {
    const newComment = await prisma.$transaction(async (tx: TxClient) => {
      const created = await tx.comment.create({
        data: {
          content: content.trim(),
          postId,
          userId,
          parentId: parentId || null,
        },
        include: {
          user: {
            select: { name: true, image: true, role: true },
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      });

      return created;
    });

    // Invalidate global posts version so the homepage feed shows updated comment counts
    await CacheService.increment("posts:version");

    logger.debug("Comment created and cache version bumped", { postId, userId });
    return newComment as unknown as Comment;
  }

  static async reconcileCounters(): Promise<number> {
    const posts = await prisma.post.findMany({
      select: { id: true, commentsCount: true },
    });

    let fixedCount = 0;
    for (const post of posts) {
      const actualCount = await prisma.comment.count({ where: { postId: post.id } });
      if (actualCount !== post.commentsCount) {
        await prisma.post.update({
          where: { id: post.id },
          data: { commentsCount: actualCount },
        });
        fixedCount++;
      }
    }

    return fixedCount;
  }
}
