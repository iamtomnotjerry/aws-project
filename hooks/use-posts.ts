import { useState, useEffect, useCallback } from "react";
import { ApiService } from "@/services/api.service";
import { PostWithAuthor } from "@/types";

/**
 * Hook to manage posts state with PAGINATION.
 */
export function usePosts(limit = 6) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (cursor?: string) => {
    const isInitial = !cursor;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await ApiService.posts.getAll(limit, cursor);
      if (response.success && response.data) {
        // Typing the data correctly from the response
        const { posts: newPosts, nextCursor: newCursor } = response.data as { posts: PostWithAuthor[], nextCursor: string | null };
        setPosts(prev => isInitial ? newPosts : [...prev, ...newPosts]);
        setNextCursor(newCursor);
      } else {
        setError(response.error || "Failed to fetch posts");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchPosts(nextCursor);
    }
  };

  return { posts, loading, loadingMore, error, hasMore: !!nextCursor, loadMore, refetch: () => fetchPosts() };
}
