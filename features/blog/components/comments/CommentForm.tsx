"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CommentFormProps {
  postId: string;
  onSuccess: (newComment: any) => void;
  parentId?: string | null;
  replyToName?: string | null;
  onCancelReply?: () => void;
}

export const CommentForm = ({ 
  postId, 
  onSuccess, 
  parentId = null, 
  replyToName = null,
  onCancelReply 
}: CommentFormProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(parentId ? "Đã gửi phản hồi!" : "Đã gửi bình luận!");
        setContent("");
        onSuccess(data.data);
      } else {
        throw new Error(data.error || "Gửi bình luận thất bại");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="p-10 rounded-[2rem] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-500">
          <LogIn size={24} />
        </div>
        <div>
          <h5 className="text-white font-black italic mb-2">Tham gia thảo luận</h5>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Đăng nhập tài khoản của bạn để chia sẻ ý kiến và đóng góp cho cộng đồng.</p>
        </div>
        <Link href="/auth/signin">
          <Button variant="primary" glow className="px-8 h-12 rounded-xl font-black italic">
            ĐĂNG NHẬP NGAY
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AnimatePresence>
        {parentId && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">
              Đang phản hồi {replyToName}
            </p>
            <button 
              type="button"
              onClick={onCancelReply}
              className="p-1 hover:bg-primary/20 rounded-full text-primary transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <textarea
          placeholder={parentId ? "Compose your response..." : "Share your thoughts on this article..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[120px] bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none resize-none"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {content.length} characters
          </span>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="w-12 h-12 rounded-xl p-0 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
      </div>
    </form>
  );
};
