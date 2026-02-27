"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User as UserIcon, Reply, ShieldCheck } from "lucide-react";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date | string;
  user: {
    name: string | null;
    image: string | null;
    role: string;
  };
  replies?: CommentData[];
}

interface CommentItemProps {
  comment: CommentData;
  onReply?: (commentId: string, name: string) => void;
  isReply?: boolean;
}

export const CommentItem = ({ comment, onReply, isReply = false }: CommentItemProps) => {
  const [mounted, setMounted] = useState(false);
  const isAdmin = comment.user.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: Date | string) => {
    if (!mounted) {
      return new Date(date).toISOString(); // Safe for SSR matching
    }
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group ${isReply ? "ml-6 lg:ml-10 mt-6" : "mt-8"}`}
    >
      {isReply && (
        <div className="absolute -left-6 lg:-left-10 top-0 bottom-0 flex justify-center"><div className="w-px h-full bg-white/5 group-hover:bg-primary/20 transition-colors" /></div>
      )}

      <div className={`p-6 rounded-2xl border transition-all duration-300 ${isAdmin ? "bg-white/[0.03] border-primary/20" : "bg-white/[0.01] border-white/[0.05] hover:border-white/10"}`}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative w-8 h-8 rounded-lg overflow-hidden border ${isAdmin ? "border-primary/30" : "border-white/10"}`}>
              {comment.user.image ? (
                <Image src={comment.user.image} alt={comment.user.name || "User"} fill className="object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isAdmin ? "bg-primary/20 text-primary" : "bg-white/[0.05] text-slate-500"}`}>
                  <UserIcon size={14} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold tracking-tight ${isAdmin ? "text-primary" : "text-white"}`}>
                  {comment.user.name || "Bao's Reader"}
                </span>
                {isAdmin && <ShieldCheck size={12} className="text-primary opacity-60" />}
              </div>
              <p suppressHydrationWarning className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>

          {!isReply && onReply && (
            <button onClick={() => onReply(comment.id, comment.user.name || "Bao's Reader")} className="text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
              <Reply size={12} /> Reply
            </button>
          )}
        </div>
        <div className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">{comment.content}</div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} isReply />
          ))}
        </div>
      )}
    </motion.div>
  );
};
