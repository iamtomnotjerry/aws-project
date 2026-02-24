"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Clock, ImageIcon, Edit3, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { Magnetic } from "@/components/ui/Magnetic";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./comments/CommentSection";

interface PostData {
  id: string;
  title: string;
  content: string | null;
  coverImage: string | null;
  published: boolean;
  authorId: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  isLiked?: boolean;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    emailVerified: Date | null;
    password: string | null;
  } | null;
}

interface PostDetailClientProps {
  post: PostData;
  isAdmin: boolean;
  DeleteButton: React.ReactNode;
}

export const PostDetailClient = ({ post, isAdmin, DeleteButton }: PostDetailClientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax Header Effect
  const imageY = useTransform(scrollY, [0, 500], [0, 200]);
  const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const headerBlur = useTransform(scrollY, [0, 400], [0, 20]);

  return (
    <div ref={containerRef} className="relative min-h-screen pb-48">
      <ReadingProgress />

      {/* Cinematic Parallax Header */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-slate-950">
        <motion.div 
          style={{ y: imageY, filter: `blur(${headerBlur}px)` }}
          className="absolute inset-0"
        >
          {post.coverImage ? (
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-900 bg-slate-950">
              <ImageIcon size={200} strokeWidth={0.5} />
            </div>
          )}
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="absolute inset-0 flex flex-col justify-end pb-24"
        >
          <div className="max-w-5xl mx-auto px-6 w-full">
            <Magnetic strength={0.05}>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-8 hover:translate-x-1 transition-transform w-fit"
              >
                <ArrowLeft size={14} /> Back to Blog
              </Link>
            </Magnetic>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold mb-10 tracking-tight leading-[1.1]"
            >
              {post.title}
            </motion.h1>

            <div className="flex flex-wrap gap-8 items-center text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Author</p>
                  <p className="text-white text-sm font-bold">{post.author?.name || "Bao's Admin"}</p>
                </div>
              </div>

              <div className="w-px h-8 bg-white/5" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Published</p>
                  <p className="text-white text-sm font-bold">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Card className="p-12 md:p-20 glass-card !bg-background/95 shadow-2xl shadow-black/50 border-white/[0.05]">
                <div className="prose prose-invert prose-xl max-w-none">
                  <div className="text-slate-300 leading-[2] text-xl whitespace-pre-wrap font-medium first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                    {post.content}
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-24 pt-12 border-t border-white/[0.05] flex flex-wrap gap-6">
                    <Magnetic strength={0.1}>
                      <Link href={`/post/${post.id}/edit`}>
                        <Button variant="secondary" className="px-10 h-16 border-primary/20 text-primary hover:bg-primary/10 rounded-2xl font-black italic">
                          <Edit3 size={20} /> CHỈNH SỬA
                        </Button>
                      </Link>
                    </Magnetic>
                    {DeleteButton}
                  </div>
                )}

                <CommentSection postId={post.id} />
              </Card>
            </motion.div>
          </div>

          {/* Infinity Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="sticky top-32 space-y-12"
            >
              <div className="space-y-8 rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-xl">
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    Engagement
                  </p>
                  <LikeButton 
                    postId={post.id} 
                    initialLikes={post.likesCount ?? 0} 
                    initialIsLiked={post.isLiked}
                  />
                </section>

                <div className="h-px bg-white/5" />

                <section className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-3">Copy Resource ID</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(post.id);
                        toast.success("ID copied to clipboard");
                      }}
                      className="w-full text-left p-4 bg-black/20 rounded-xl border border-white/[0.05] font-mono text-[10px] text-slate-500 hover:bg-white/[0.03] transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {post.id}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Spread the Word</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied!");
                      }}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </section>
              </div>

              <div className="px-6 py-4 border-l border-primary/20">
                <p className="text-slate-500 text-xs leading-relaxed italic opacity-80">
                  "Every line of code is a mission. Don't just build, create the future."
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};
