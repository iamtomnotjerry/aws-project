import { PostService } from "@/services/post.service";
import HomePageClient from "./HomePageClient";
import { logger } from "@/lib/logger";

// Force dynamic rendering - prevents Next.js from pre-rendering at build time.
// This is required because the page fetches data from the database at runtime.
export const dynamic = 'force-dynamic';

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
  } catch (err: any) {
    const errorMessage = err?.message || String(err);
    logger.error("Failed to load homepage feed", { error: errorMessage });
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 font-bold uppercase tracking-widest gap-4 p-8">
        <div>Hệ thống đang bảo trì...</div>
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-red-400 text-xs font-mono normal-case text-left max-w-2xl overflow-auto bg-slate-900 p-4 rounded">{errorMessage}</pre>
        )}
      </div>
    );
  }
}
