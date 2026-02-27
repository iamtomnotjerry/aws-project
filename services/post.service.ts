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
    // Important: In local dev (No Redis), L1 cache is isolated per process. 
    // To maintain synchronization, we MUST bypass L1 for the global version key 
    // and rely on the Database as the single source of truth for all processes.
    const isRedisActive = !!await CacheService.get<string>("health:redis").catch(() => null);
    
    // Always recalculate from DB if Redis is missing to ensure perfect cross-process sync
    let version = isRedisActive ? await CacheService.get<string>(versionKey) : null;
    
    if (!version) {
       const [agg, count] = await Promise.all([
         prisma.post.aggregate({
           where: { published: true },
           _max: { updatedAt: true }
         }),
         prisma.post.count({ where: { published: true } })
       ]);
       
       const maxUpdate = (agg._max.updatedAt?.getTime() || 0).toString();
       version = `${count}_${maxUpdate}`;
       
       // Only backfill cache if Redis is active (for global distribution)
       // If local-only, we skip cache write for the version key to keep it "live" from DB
       if (isRedisActive) {
         await CacheService.set(versionKey, version, 60); 
       }
    }

    const cacheKey = `posts:v${version}:limit=${limit}:cursor=${cursor || "start"}`;

    if (!cursor) {
      const cachedFeed = await CacheService.get<PaginatedPosts>(cacheKey);
      if (cachedFeed) {
        logger.debug("Feed served from cache", { version, cacheKey });
        return cachedFeed;
      }
      logger.debug("Cache miss for feed", { version, cacheKey });
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

    const transformedPosts: PostWithAuthor[] = posts.map((post: any) => ({
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
   * Utilizes hybrid caching (L1 + L2) with ID-based invalidation.
   */
  static async getPostById(id: string, userId?: string): Promise<PostWithAuthor | null> {
    const cacheKey = `post:${id}`;
    const isRedisActive = !!await CacheService.get<string>("health:redis").catch(() => null);
    
    // 1. Try to get basic post data from cache (Bypass L1 in dev without Redis to avoid split-brain)
    let post = isRedisActive ? await CacheService.get<any>(cacheKey) : null;

    if (!post) {
      // 2. Cache miss -> Fetch from DB
      post = await prisma.post.findUnique({
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
      });

      if (post) {
        // Cache for 10 minutes, invalidated on update/delete/like
        await CacheService.set(cacheKey, post, 600);
      }
    }

    if (!post) return null;

    // 3. User-specific like status must always be fresh (denormalized DB check)
    const userLike = userId
      ? await prisma.like.findUnique({
          where: { postId_userId: { postId: id, userId } },
        })
      : null;

    return {
      ...(post as any),
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
  ): Promise<PostWithAuthor> {
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await (tx.post as any).create({
        data: {
          ...data,
          published: true,
          author: { connect: { id: authorId } },
          version: 1, // Start with version 1
        },
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
      return newPost;
    });

    // Invalidate global posts version and specific post cache
    await Promise.all([
      CacheService.increment("posts:version"),
      CacheService.invalidate(`post:${post.id}`)
    ]);

    // Bust Next.js Router/Data Cache for all list segments
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${post.id}`);

    logger.info("Post created and caches invalidated", { postId: post.id });
    
    return {
      ...(post as any),
      likes: (post as any).likesCount,
    } as PostWithAuthor;
  }

  /**
   * Updates an existing post with optimistic locking and invalidates cache.
   */
  static async updatePost(
    id: string,
    data: { title?: string; content?: string; coverImage?: string | null; published?: boolean },
    currentVersion: number
  ): Promise<PostWithAuthor> {
    if (currentVersion === undefined || currentVersion === null) {
      throw new Error("Version is required for optimistic locking");
    }

    const post = await prisma.$transaction(async (tx) => {
      // 1. Perform update with version check
      const updatedPost = await (tx.post as any).updateMany({
        where: { id, version: currentVersion },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });

      if (updatedPost.count === 0) {
        throw new Error("CONFLICT: Record was modified by another user or does not exist");
      }

      // 2. Fetch the updated record
      return await tx.post.findUnique({
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
      });
    });

    if (!post) throw new Error("Failed to retrieve updated post");

    // Clear specific post cache and bump list version
    await Promise.all([
      CacheService.invalidate(`post:${id}`),
      CacheService.increment("posts:version")
    ]);

    // Bust Next.js Router/Data Cache
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${id}`);
    revalidatePath("/post/[id]", "page"); 

    logger.info("Post updated with optimistic lock", { postId: id, newVersion: (post as any).version });
    
    return {
      ...(post as any),
      likes: (post as any).likesCount,
    } as PostWithAuthor;
  }

  /**
   * Deletes a post and invalidates cache globally.
   */
  static async deletePost(id: string) {
    await prisma.$transaction(async (tx) => {
      await tx.post.delete({ where: { id } });
    });

    await Promise.all([
      CacheService.invalidate(`post:${id}`),
      CacheService.increment("posts:version")
    ]);
    
    // Bust Next.js Router/Data Cache
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${id}`); // Also clear the detail page just in case

    logger.info("Post deleted and caches invalidated", { postId: id });
  }

  /**
   * Fetch admin stats: total posts, total likes, total comments, total users.
   * Cached for 60 seconds to prevent DB hammering on high dashboard activity.
   */
  static async getAdminStats() {
    const cacheKey = "admin:stats";
    const cached = await CacheService.get<any>(cacheKey);
    if (cached) return cached;

    const [totalPosts, totalLikes, totalComments, publishedPosts, totalUsers] = await Promise.all([
      prisma.post.count(),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.user.count(),
    ]);

    const stats = {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalLikes,
      totalComments,
      totalUsers,
    };

    await CacheService.set(cacheKey, stats, 60);
    return stats;
  }

  /**
   * Fetch all posts for admin management with pagination.
   */
  static async getAdminPosts(limit: number, cursor?: string | null) {
    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });

    return {
      posts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
    };
  }

  /**
   * Toggle published status of a post.
   */
  static async togglePublish(id: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error("Post not found");

    const updated = await prisma.post.update({
      where: { id },
      data: { 
        published: !post.published,
        version: { increment: 1 }
      } as any,
    });

    await Promise.all([
      CacheService.invalidate(`post:${id}`),
      CacheService.increment("posts:version")
    ]);

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/post/${id}`);

    return updated;
  }

  /**
   * Get global post version for lightweight client polling.
   */
  static async getGlobalVersion(): Promise<string> {
    const versionKey = "posts:version";
    const cache = await CacheService.get<string>(versionKey);
    if (cache) return cache;

    // Fallback recalculation
    const [agg, count] = await Promise.all([
      prisma.post.aggregate({
        where: { published: true },
        _max: { updatedAt: true }
      }),
      prisma.post.count({ where: { published: true } })
    ]);
    
    const maxUpdate = (agg._max.updatedAt?.getTime() || 0).toString();
    const version = `${count}_${maxUpdate}`;
    
    // Only cache if not in development to ensure dev-sync is perfect
    if (process.env.NODE_ENV !== 'development') {
      await CacheService.set(versionKey, version, 60);
    }
    
    return version;
  }
}
