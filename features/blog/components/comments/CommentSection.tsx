"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CommentForm } from "./CommentForm";
import { Button } from "@/components/ui/Button";
import { Comment } from "@/types";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.data || []);
        }
      } catch (error) {
        console.error("Fetch comments error:", error);
        toast.error("Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSuccess = (newComment: any) => {
    if (newComment.parentId) {
      // Find parent and add to replies
      setComments((prev) => 
        prev.map(c => 
          c.id === newComment.parentId 
            ? { ...c, replies: [...(c.replies || []), newComment] } 
            : c
        )
      );
      setReplyTarget(null);
    } else {
      setComments((prev) => [newComment, ...prev]);
    }
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
            <p className="text-white text-lg font-bold tracking-tight">{totalComments} Comments</p>
          </div>
        </div>
      </div>

      <div ref={formRef}>
        <CommentForm 
          postId={postId} 
          onSuccess={handleCommentSuccess} 
          parentId={replyTarget?.id}
          replyToName={replyTarget?.name}
          onCancelReply={() => setReplyTarget(null)}
        />
      </div>

      <div className="space-y-2">
        {comments.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommentItem 
                  comment={comment as any} 
                  onReply={handleReplyClick}
                />
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
