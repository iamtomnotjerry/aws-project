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
   * Fetch paginated root-level comments with first batch of replies.
   */
  static async getComments(postId: string, page: number = 0, pageSize: number = 20): Promise<CommentWithUser[]> {
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
      orderBy: { createdAt: "desc" },
      // Pagination: could be added at root level,
      // but for threaded comments, fetching all and building tree is simpler
      // unless the post has 10k+ comments. For now, cap at 500.
      take: 500,
    });

    // Build comment tree in memory
    const commentMap = new Map<string, CommentWithUser>();
    const roots: CommentWithUser[] = [];

    allComments.forEach((c) => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    allComments.forEach((c) => {
      const node = commentMap.get(c.id)!;
      if (c.parentId) {
        const parent = commentMap.get(c.parentId);
        if (parent) {
          parent.replies.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Apply pagination to root-level comments only
    const start = page * pageSize;
    return roots.slice(start, start + pageSize);
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
