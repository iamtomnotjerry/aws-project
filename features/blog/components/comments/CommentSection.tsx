"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2, Send, X, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Comment } from "@/types";
import { CommentItem } from "./CommentItem";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useRouter, usePathname } from "next/navigation";

interface CommentSectionProps {
  postId: string;
}

const COMMENTS_PER_PAGE = 10;

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const [displayCount, setDisplayCount] = useState(COMMENTS_PER_PAGE);
  const formRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
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
      // Handled globally, but we can do local state if needed
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      router.refresh();
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
    // focus textarea logic can be added here
  };

  const handleLoginRedirect = () => {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname + '#comments')}`);
  };

  const visibleComments = useMemo(() => comments.slice(0, displayCount), [comments, displayCount]);
  const hasMore = comments.length > displayCount;
  
  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <section id="comments" aria-label="Comment Section" className="mt-24 pt-16 border-t border-white/[0.05] space-y-12 pb-32 md:pb-0">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary" aria-hidden="true">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Discussion</h2>
            <p className="text-white text-xl md:text-2xl font-bold tracking-tight">{isLoading ? "..." : totalComments} Comments</p>
          </div>
        </div>
      </header>

      <div ref={formRef}>
        {!session ? (
          <div className="p-10 rounded-[2rem] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-400" aria-hidden="true">
              <LogIn size={24} />
            </div>
            <div>
              <h3 className="text-white font-black italic mb-2 text-lg">Tham gia thảo luận</h3>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Đăng nhập tài khoản của bạn để chia sẻ ý kiến bảo mật.</p>
            </div>
            <Button onClick={handleLoginRedirect} variant="primary" glow className="px-8 h-12 rounded-xl font-black italic focus:ring-2 focus:ring-primary focus:outline-none">
              ĐĂNG NHẬP NGAY
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {replyTarget && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-xs font-black uppercase tracking-widest text-primary italic">Đang phản hồi {replyTarget.name}</p>
                  <button type="button" onClick={() => setReplyTarget(null)} aria-label="Cancel reply" className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-primary/20 rounded-xl text-primary transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative group">
              <textarea
                aria-label="Comment input"
                placeholder={replyTarget ? "Compose your response..." : "Share your thoughts on this article..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full min-h-[120px] bg-white/[0.02] border ${mutation.isError ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.07] focus:border-primary/50'} rounded-2xl p-6 text-base text-white placeholder:text-slate-500 focus:bg-white/[0.04] transition-all outline-none resize-none focus:ring-2 focus:ring-primary/20`}
                disabled={mutation.isPending}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                {mutation.isError && (
                  <span className="text-red-400 text-xs font-medium flex items-center gap-1.5">
                    <AlertCircle size={14} /> Gửi thất bại
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{content.length} / 5000</span>
                <Button 
                  type="submit" 
                  disabled={!content.trim() || mutation.isPending} 
                  aria-label="Send comment"
                  className="min-w-[48px] h-12 rounded-xl p-0 flex items-center justify-center focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-background"
                >
                  {mutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div aria-busy="true" className="py-20 flex justify-center text-primary"><Loader2 className="animate-spin" size={32} /></div>
        ) : isError ? (
          <div role="alert" className="py-20 flex flex-col items-center gap-4 text-center">
             <AlertCircle size={32} className="text-red-500 opacity-80" />
             <p className="text-red-400 font-medium text-lg">Failed to load comments</p>
             <p className="text-slate-400 text-sm max-w-sm">Mạng không ổn định hoặc máy chủ quá tải. Vui lòng thử lại.</p>
             <Button onClick={() => refetch()} variant="secondary" className="mt-2 min-h-[44px] px-6">Thử lại (Retry)</Button>
          </div>
        ) : comments.length > 0 ? (
          <>
            <AnimatePresence mode="popLayout">
              {visibleComments.map((comment, index) => (
                <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} layout>
                  <CommentItem comment={comment as any} onReply={handleReplyClick} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {hasMore && (
              <div className="pt-8 flex justify-center">
                <Button 
                  onClick={() => setDisplayCount(prev => prev + COMMENTS_PER_PAGE)} 
                  variant="secondary" 
                  className="min-h-[44px] px-8 rounded-xl font-bold italic focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-background"
                >
                  Tải thêm bình luận
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
            <p className="text-slate-400 text-base italic">No comments yet. Be the first to start the conversation.</p>
          </div>
        )}
      </div>

      {/* Floating Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/80 backdrop-blur-xl border-t border-white/5 z-40 transform translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          {!session ? (
            <Button onClick={handleLoginRedirect} className="flex-1 min-h-[48px] rounded-xl font-bold focus:ring-2 focus:ring-primary focus:outline-none">Viết bình luận</Button>
          ) : (
            <Button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} variant="secondary" className="flex-1 min-h-[48px] rounded-xl font-bold text-slate-300 focus:ring-2 focus:ring-primary focus:outline-none">
              Viết bình luận...
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
