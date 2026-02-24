import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { PostWithAuthor } from "@/types";

interface PostsResponse {
  posts: PostWithAuthor[];
  nextCursor: string | null;
}

export const usePosts = (limit: number = 6) => {
  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: ['posts', { limit }],
    queryFn: async ({ pageParam, signal }) => {
      const cursorQuery = pageParam ? `&cursor=${pageParam}` : '';
      return fetcher<PostsResponse>(`/api/posts?limit=${limit}${cursorQuery}`, { signal });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null,
  });
};
