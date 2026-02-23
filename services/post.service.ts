import { prisma } from "@/lib/prisma";
import { CacheService } from "@/lib/cache";
import { logger } from "@/lib/logger";

export class PostService {
  /**
   * Fetch paginated posts with author details utilizing Redis caching and denormalized counters.
   */
  static async getPosts(limit: number, cursor?: string | null) {
    const cacheKey = `posts:feed:limit=${limit}:cursor=${cursor || 'start'}`;
    
    // 1. Check Cache Layer first
    if (!cursor) {
      const cachedFeed = await CacheService.get(cacheKey);
      if (cachedFeed) {
        logger.debug("Feed served from Redis target");
        return cachedFeed as any; 
      }
    }

    // 2. Query RDS
    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      where: { published: true }, // Index Hit
      orderBy: { createdAt: "desc" }, // Index Hit
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
        // We removed _count: { likes: true } to save RDS CPU!
      },
    });

    const transformedPosts = posts.map((post) => ({
      ...post,
      likes: (post as any).likesCount || 0, // Bypass static lint until prisma generate
    }));

    const result = {
      posts: transformedPosts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
    };

    // 3. Populate Cache - Stale-While-Revalidate TTL (60s)
    if (!cursor) {
      await CacheService.set(cacheKey, result, 60);
    }

    return result;
  }

  /**
   * Creates a new post for a given author and invalidates feed cache.
   */
  static async createPost(
    data: { title: string; content?: string | null; coverImage?: string | null },
    authorId: string
  ) {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        coverImage: data.coverImage,
        published: true,
        author: {
          connect: { id: authorId },
        },
      },
    });

    // Strategy: Invalidate global cache for first-page of feed
    await CacheService.invalidate(`posts:feed:limit=10:cursor=start`);
    
    return post;
  }
}
