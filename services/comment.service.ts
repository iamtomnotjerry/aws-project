import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

interface CommentWithUser {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
    role: string;
  };
  replies: CommentWithUser[];
}

export class CommentService {
  /**
   * Fetch paginated root-level comments with exactly 1 level of replies (max 5 replies per root)
   * This bounds memory allocation strictly to prevent OOM under DDoS or viral threads.
   */
  static async getComments(postId: string, page: number = 0, pageSize: number = 20) {
    const start = page * pageSize;
    
    // Fetch only ROOT comments, paginated, and eagerly load up to 5 replies per root.
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

    return roots;
  }

  /**
   * Create a comment and atomically increment the denormalized counter.
   */
  static async createComment(
    postId: string,
    userId: string,
    content: string,
    parentId?: string | null
  ) {
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

    logger.debug("Comment created", { postId, userId, commentId: newComment.id });
    return newComment;
  }

  /**
   * Reconcile denormalized commentsCount with actual Comment records.
   */
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
        logger.info("Reconciled commentsCount", {
          postId: post.id,
          was: post.commentsCount,
          now: actualCount,
        });
      }
    }

    return fixedCount;
  }
}
