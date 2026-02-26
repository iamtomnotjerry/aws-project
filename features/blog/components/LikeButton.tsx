"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/fetcher";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialIsLiked?: boolean;
}

interface LikeState {
  isLiked: boolean;
  likes: number;
}

export const LikeButton = ({ postId, initialLikes, initialIsLiked = false }: LikeButtonProps) => {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const queryKey = ['post-like', postId];

  // We use useQuery to manage the local "truth" of the like state, 
  // initialized with props but updated via mutations.
  const { data: likeState } = useQuery<LikeState>({
    queryKey,
    // Provide initial data from the SSR/RSC props
    initialData: { isLiked: initialIsLiked, likes: initialLikes },
    // If the query is invalidated, we don't want it to just "reset" to props 
    // unless we actually fetch something. For now, we manually manage it.
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5, // Keep in memory for 5 mins
  });

  const mutation = useMutation({
    mutationFn: async () => {
      // API returns: { success: true, data: { liked: boolean, likes: number } }
      // fetcher returns just the "data" part.
      return fetcher<{ liked: boolean; likes: number }>(`/api/posts/${postId}/like`, { 
        method: "POST",
        headers: { "X-Idempotency-Key": crypto.randomUUID() },
      });
    },
    onMutate: async () => {
      // 1. Cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey });
      
      // 2. Snapshot the current state
      const previousState = queryClient.getQueryData<LikeState>(queryKey);
      
      // 3. Optimistically update to the new state
      queryClient.setQueryData<LikeState>(queryKey, (old) => {
        if (!old) return { isLiked: !initialIsLiked, likes: initialIsLiked ? initialLikes - 1 : initialLikes + 1 };
        return {
          isLiked: !old.isLiked,
          likes: old.isLiked ? Math.max(0, old.likes - 1) : old.likes + 1,
        };
      });
      
      return { previousState };
    },
    onSuccess: (data) => {
      // 4. Update with the definitive server state
      // Note: Data from API uses "liked" and "likes" keys.
      queryClient.setQueryData<LikeState>(queryKey, {
        isLiked: data.liked,
        likes: data.likes,
      });
    },
    onError: (err, variables, context) => {
      // 5. Rollback to safe state on error
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }
      toast.error(err instanceof Error ? err.message : "Failed to sync like status");
    },
    onSettled: () => {
      // We DON'T invalidate globally here to prevent the "jump" back to props
      // since we already have the fresh server state in onSuccess.
      // But we might want to invalidate the home feed if we used a separate query for it.
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (status === "loading" || mutation.isPending) return;
    mutation.mutate();
  };

  const isLiked = likeState?.isLiked ?? initialIsLiked;
  const likes = likeState?.likes ?? initialLikes;

  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLike}
        disabled={status === "loading" || mutation.isPending}
        aria-label={isLiked ? "Unlike post" : "Like post"}
        aria-pressed={isLiked}
        className={`group relative min-w-[44px] min-h-[44px] p-2 rounded-xl flex items-center justify-center border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 ${
           isLiked 
            ? "bg-primary/10 border-primary/30 text-primary" 
            : "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:border-primary/20 hover:text-primary"
        }`}
      >
        <Heart size={20} fill={isLiked ? "currentColor" : "none"} className="transition-transform duration-300" />
        <AnimatePresence>
          {mutation.isPending && !isLiked && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -30 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none text-primary font-bold text-[10px]"
            >
              +1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <motion.span key={likes} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-white text-2xl font-bold tracking-tight">
            {likes}
          </motion.span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hearts</span>
        </div>
      </div>
    </div>
  );
};
