import { prisma } from "@/lib/prisma";
import { CacheService } from "@/lib/cache";
import { logger } from "@/lib/logger";
import { PostWithAuthor, PaginatedPosts } from "@/types";

export class PostService {
  /**
   * Fetch paginated posts with author details utilizing Redis caching and denormalized counters.
   */
  static async getPosts(limit: number, cursor?: string | null): Promise<PaginatedPosts> {
    const versionKey = "posts:version";
    const version = (await CacheService.get<string>(versionKey)) || "0";
    const cacheKey = `posts:v${version}:limit=${limit}:cursor=${cursor || "start"}`;

    if (!cursor) {
      const cachedFeed = await CacheService.get<PaginatedPosts>(cacheKey);
      if (cachedFeed) {
        logger.debug("Feed served from cache", { version });
        return cachedFeed;
      }
    }

    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            emailVerified: true,
          },
        },
      },
    });

    const transformedPosts: PostWithAuthor[] = posts.map((post) => ({
      ...post,
      likes: post.likesCount,
    }));

    const result: PaginatedPosts = {
      posts: transformedPosts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
    };

    if (!cursor) {
      await CacheService.set(cacheKey, result, 300);
    }

    return result;
  }

  /**
   * Fetch a single post by ID with author and like status.
   */
  static async getPostById(id: string, userId?: string): Promise<PostWithAuthor | null> {
    const [post, userLike] = await Promise.all([
      prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              emailVerified: true,
            },
          },
        },
      }),
      userId
        ? prisma.like.findUnique({
            where: { postId_userId: { postId: id, userId } },
          })
        : null,
    ]);

    if (!post) return null;

    return {
      ...post,
      likes: post.likesCount,
      isLiked: !!userLike,
    } as PostWithAuthor;
  }

  /**
   * Creates a new post and invalidates cache globally.
   */
  static async createPost(
    data: { title: string; content: string; coverImage?: string | null },
    authorId: string
  ) {
    const post = await prisma.post.create({
      data: {
        ...data,
        published: true,
        author: { connect: { id: authorId } },
      },
    });

    await CacheService.increment("posts:version");
    logger.info("Post created and cache invalidated", { postId: post.id });
    return post;
  }

  /**
   * Updates an existing post and invalidates cache globally.
   */
  static async updatePost(
    id: string,
    data: { title?: string; content?: string; coverImage?: string | null; published?: boolean }
  ) {
    const post = await prisma.post.update({
      where: { id },
      data,
    });

    await CacheService.increment("posts:version");
    logger.info("Post updated and cache invalidated", { postId: id });
    return post;
  }

  /**
   * Deletes a post and invalidates cache globally.
   */
  static async deletePost(id: string) {
    await prisma.post.delete({ where: { id } });
    await CacheService.increment("posts:version");
    logger.info("Post deleted and cache invalidated", { postId: id });
  }
}
