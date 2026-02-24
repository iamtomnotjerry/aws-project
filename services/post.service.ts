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
    const cacheKey = `posts:feed:limit=${limit}:cursor=${cursor || 'start'}`;
    
    // 1. Check Cache Layer first
    if (!cursor) {
      const cachedFeed = await CacheService.get<PostFeedResult>(cacheKey);
      if (cachedFeed) {
        logger.debug("Feed served from Redis target");
        return cachedFeed;
      }
    }

    // 2. Query RDS
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

