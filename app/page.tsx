import { PostService } from "@/services/post.service";
import HomePageClient from "./HomePageClient";
import { logger } from "@/lib/logger";

/**
 * Server Component (RSC) for Homepage.
 * Fetches data on the server, benefiting from Redis caching instantly.
 * No client-side waterfall loaders!
 */
export default async function Home() {
  try {
    // 1. Fetch initial feed safely on the server side
    const { posts, nextCursor } = await PostService.getPosts(6);
    
    // 2. Pass strictly typed initial payload to the Client Component
    return <HomePageClient initialPosts={posts} initialCursor={nextCursor} />;
  } catch (err) {
    logger.error("Failed to load homepage feed", err);
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold uppercase tracking-widest">
        Hệ thống đang bảo trì...
      </div>
    );
  }
}
