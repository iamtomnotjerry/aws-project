import { useState, useEffect } from "react";
import { ApiService } from "@/services/api.service";

/**
 * Hook to manage posts state professionally.
 * Handles fetching, loading, and error states.
 */
export function usePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await ApiService.posts.getAll();
      if (response.success) {
        setPosts(response.data);
      } else {
        setError(response.error || "Failed to fetch posts");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
}
