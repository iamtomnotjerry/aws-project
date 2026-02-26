import { prisma } from "@/lib/prisma";
import { CacheService } from "@/lib/cache";
import { logger } from "@/lib/logger";

interface TransformedPost {
  id: string;
  title: string;
  content: string | null;
  coverImage: string | null;
  published: boolean;
  authorId: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    emailVerified: Date | null;
  } | null;
}

interface PostFeedResult {
  posts: TransformedPost[];
  nextCursor: string | null;
}

export class PostService {
  /**
   * Fetch paginated posts with author details utilizing Redis caching and denormalized counters.
   */
  static async getPosts(limit: number, cursor?: string | null): Promise<PostFeedResult> {
    // 1. Versioned Cache Key to allow $O(1)$ global invalidation
    const versionKey = "posts:version";
    const version = await CacheService.get<string>(versionKey) || "0";
    const cacheKey = `posts:v${version}:limit=${limit}:cursor=${cursor || 'start'}`;
    
    // 2. Check Cache Layer first
    if (!cursor) {
      const cachedFeed = await CacheService.get<PostFeedResult>(cacheKey);
      if (cachedFeed) {
        logger.debug("Feed served from Redis target", { version });
        return cachedFeed;
      }
    }

    // 3. Query RDS
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

    const transformedPosts: TransformedPost[] = posts.map((post) => ({
      ...post,
      likes: post.likesCount,
    }));

    const result: PostFeedResult = {
      posts: transformedPosts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
    };

    // 4. Populate Cache - Stale-While-Revalidate TTL (300s)
    // We can set a longer TTL since we invalid aggressively now!
    if (!cursor) {
      await CacheService.set(cacheKey, result, 300);
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

    // 1. Atomic Version Bump: instantly invalidates ALL infinite scroll/limit permutations
    // This is $O(1)$ compared to expensive Redis key scanning.
    await CacheService.increment("posts:version");
    
    return post;
  }
}

