"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Clock, ImageIcon, Edit3, Share2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReadingProgress } from "./ui/ReadingProgress";
import { Magnetic } from "./ui/Magnetic";
import { PostWithAuthor } from "@/types";

interface PostDetailClientProps {
  post: PostWithAuthor;
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
          className="absolute inset-0 flex flex-col justify-end pb-32"
        >
          <div className="max-w-5xl mx-auto px-6 w-full">
            <Magnetic strength={0.1}>
              <Link 
                href="/" 
                className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-12 hover:gap-5 transition-all w-fit"
              >
                <ArrowLeft size={16} /> Trở lại hành trình
              </Link>
            </Magnetic>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[7rem] font-black mb-12 tracking-tightest leading-[0.9] italic"
            >
              {post.title}
            </motion.h1>

            <div className="flex flex-wrap gap-12 items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/20">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Kiến tạo bởi</p>
                  <p className="text-white text-lg font-black">{post.author?.name || "Bao's Admin"}</p>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-white/10" />

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-slate-400 border border-white/[0.05]">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Thời điểm</p>
                  <p className="text-white text-lg font-black uppercase">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "long",
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
              <div className="p-10 glass-card rounded-[2.5rem] border-white/[0.04] bg-white/[0.01]">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-primary italic">Siêu dữ liệu</h4>
                
                <div className="space-y-10">
                  <div className="group">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">Định danh cốt lõi</p>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/[0.05] font-mono text-[10px] text-slate-400 break-all select-all">
                      {post.id}
                    </div>
                  </div>

                  <div className="group">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-6">Lan tỏa giá trị</p>
                    <div className="flex gap-4">
                      <Magnetic strength={0.2}>
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer">
                          <Share2 size={20} />
                        </div>
                      </Magnetic>
                      {/* Add more social icons if needed */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 border-l-2 border-primary/20 italic">
                <p className="text-slate-500 text-sm leading-relaxed">
                  "Mỗi dòng code đều mang trong mình một sứ mệnh. Đừng chỉ viết code, hãy kiến tạo tương lai."
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};
