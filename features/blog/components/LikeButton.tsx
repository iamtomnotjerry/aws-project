"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialIsLiked?: boolean;
}

export const LikeButton = ({ postId, initialLikes, initialIsLiked = false }: LikeButtonProps) => {
  const { data: session, status } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);

  // Sync with initial props
  useEffect(() => {
    setLikes(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialLikes, initialIsLiked]);

  const handleLike = async () => {
    if (status === "unauthenticated") {
      toast.error("Sign in to like this post");
      return;
    }

    if (status === "loading" || isLiking) return;

    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikes(prev => prevLiked ? Math.max(0, prev - 1) : prev + 1);
    setIsLiking(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setIsLiked(data.data.liked);
      setLikes(data.data.likes);
    } catch (error: any) {
      setIsLiked(prevLiked);
      setLikes(prev => prevLiked ? prev + 1 : Math.max(0, prev - 1));
      toast.error(error.message || "Failed to sync like status");
    } finally {
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLike}
        className={`group relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
          isLiked 
            ? "bg-primary/10 border-primary/30 text-primary" 
            : "bg-white/[0.02] border-white/[0.05] text-slate-600 hover:border-primary/20 hover:text-primary"
        }`}
      >
        <Heart 
          size={18} 
          fill={isLiked ? "currentColor" : "none"} 
          className="transition-transform duration-300"
        />
        
        <AnimatePresence>
          {isLiking && !isLiked && (
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
          <motion.span 
            key={likes}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-2xl font-bold tracking-tight"
          >
            {likes}
          </motion.span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Hearts</span>
        </div>
      </div>
    </div>
  );
};
