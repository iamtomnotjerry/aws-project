"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/fetcher";

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
  const queryKey = ['post-like', postId];

  const { data: likeState } = useQuery<LikeState>({
    queryKey,
    queryFn: () => ({ isLiked: initialIsLiked, likes: initialLikes }),
    initialData: { isLiked: initialIsLiked, likes: initialLikes },
    staleTime: Infinity, 
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return fetcher<{ liked: boolean; likesCount: number }>(`/api/posts/${postId}/like`, { 
        method: "POST",
        headers: { "X-Idempotency-Key": crypto.randomUUID() },
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeState>(queryKey);
      
      queryClient.setQueryData<LikeState>(queryKey, (old) => {
        const safeOld = old || { isLiked: false, likes: 0 };
        return {
          isLiked: !safeOld.isLiked,
          likes: safeOld.isLiked ? Math.max(0, safeOld.likes - 1) : safeOld.likes + 1,
        }
      });
      
      return { previousState };
    },
    onError: (err, variables, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }
      toast.error(err instanceof Error ? err.message : "Failed to sync like status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleLike = () => {
    if (status === "unauthenticated") {
      toast.error("Sign in to like this post");
      return;
    }
    if (status === "loading" || mutation.isPending) return;
    mutation.mutate();
  };

  const isLiked = likeState?.isLiked || false;
  const likes = likeState?.likes || 0;

  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLike}
        disabled={status === "loading" || mutation.isPending}
        className={`group relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 disabled:opacity-50 ${
          isLiked 
            ? "bg-primary/10 border-primary/30 text-primary" 
            : "bg-white/[0.02] border-white/[0.05] text-slate-600 hover:border-primary/20 hover:text-primary"
        }`}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} className="transition-transform duration-300" />
        <AnimatePresence>
          {mutation.isPending && isLiked && (
            <motion.span
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -25 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none text-primary font-bold text-[10px]"
            >
              +1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <motion.span key={likes} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-white text-2xl font-bold tracking-tight">
            {likes}
          </motion.span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Hearts</span>
        </div>
      </div>
    </div>
  );
};
