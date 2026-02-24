"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2, Send, X, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Comment } from "@/types";
import { CommentItem } from "./CommentItem";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const queryKey = ['comments', postId];

  const { data: comments = [], isLoading, isError, refetch } = useQuery<Comment[]>({
    queryKey,
    queryFn: async ({ signal }) => fetcher<Comment[]>(`/api/posts/${postId}/comments`, { signal }),
  });

  const mutation = useMutation({
    mutationFn: async (payload: { content: string; parentId?: string | null }) => {
      return fetcher<Comment>(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "X-Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      setContent("");
      setReplyTarget(null);
      toast.success("Comment posted successfully!");
      queryClient.setQueryData<Comment[]>(queryKey, (old) => {
        if (!old) return [data];
        if (data.parentId) {
          return old.map(c => c.id === data.parentId ? { ...c, replies: [...(c.replies || []), data] } : c);
        }
        return [data, ...old];
      });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to post comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || mutation.isPending) return;
    mutation.mutate({ content, parentId: replyTarget?.id });
  };

  const handleReplyClick = (commentId: string, name: string) => {
    setReplyTarget({ id: commentId, name });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="mt-24 pt-16 border-t border-white/[0.05] space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary">
            <MessageSquare size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Discussion</h4>
            <p className="text-white text-lg font-bold tracking-tight">{isLoading ? "..." : totalComments} Comments</p>
          </div>
        </div>
      </div>

      <div ref={formRef}>
        {!session ? (
          <div className="p-10 rounded-[2rem] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-500">
              <LogIn size={24} />
            </div>
            <div>
              <h5 className="text-white font-black italic mb-2">Tham gia thảo luận</h5>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Đăng nhập tài khoản của bạn để chia sẻ ý kiến.</p>
            </div>
            <Link href="/auth/signin">
              <Button variant="primary" glow className="px-8 h-12 rounded-xl font-black italic">ĐĂNG NHẬP NGAY</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {replyTarget && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Đang phản hồi {replyTarget.name}</p>
                  <button type="button" onClick={() => setReplyTarget(null)} className="p-1 hover:bg-primary/20 rounded-full text-primary transition-colors">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative">
              <textarea
                placeholder={replyTarget ? "Compose your response..." : "Share your thoughts on this article..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[120px] bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none resize-none"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{content.length} characters</span>
                <Button type="submit" disabled={!content.trim() || mutation.isPending} className="w-12 h-12 rounded-xl p-0 flex items-center justify-center">
                  {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="py-20 flex justify-center text-primary"><Loader2 className="animate-spin" size={32} /></div>
        ) : isError ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center">
             <p className="text-red-500 font-medium">Failed to load comments</p>
             <Button onClick={() => refetch()} variant="secondary" size="sm">Retry</Button>
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <CommentItem comment={comment as any} onReply={handleReplyClick} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <p className="text-slate-500 text-sm italic">No comments yet. Be the first to start the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};
