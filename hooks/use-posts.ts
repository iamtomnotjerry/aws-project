import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { PostWithAuthor } from "@/types";
import { useEffect } from "react";

interface PostsResponse {
  posts: PostWithAuthor[];
  nextCursor: string | null;
}

interface VersionResponse {
  version: string;
}

export const usePosts = (limit: number = 6) => {
  const queryClient = useQueryClient();

  // 1. Poll for global version every 10 seconds
  const { data: versionData } = useQuery<VersionResponse>({
    queryKey: ['posts-version'],
    queryFn: () => fetcher<VersionResponse>('/api/posts/version'),
    refetchInterval: 10000, // 10s polling
    refetchOnWindowFocus: true,
  });

  const currentVersion = versionData?.version || 'initial';

  // 2. Main infinite posts query
  const query = useInfiniteQuery<PostsResponse, Error>({
    queryKey: ['posts', { limit, version: currentVersion }],
    queryFn: async ({ pageParam, signal }) => {
      const cursorQuery = pageParam ? `&cursor=${pageParam}` : '';
      return fetcher<PostsResponse>(`/api/posts?limit=${limit}${cursorQuery}`, { signal });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null,
    // Keep data fresh between version changes if needed, but the key change handles it
    staleTime: 60000, 
  });

  // 3. Effect to invalidate old versions whenever version changes
  useEffect(() => {
    if (currentVersion !== 'initial') {
      // Clean up previous version caches to save memory
      queryClient.removeQueries({ 
        queryKey: ['posts'], 
        exact: false, 
        predicate: (query) => {
           const [key, params]: any = query.queryKey;
           return key === 'posts' && params?.version !== currentVersion;
        }
      });
    }
  }, [currentVersion, queryClient]);

  return query;
};
