"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ImageIcon, ArrowRight, User, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PostWithAuthor } from "@/types";

interface FeaturedPostCardProps {
  post: PostWithAuthor;
}

export const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  return (
    <Link href={`/post/${post.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="group flex flex-col lg:flex-row glass-card !p-0 overflow-hidden min-h-[500px] border-white/[0.05] hover:border-primary/30">
          <div className="lg:w-3/5 relative overflow-hidden bg-slate-900 h-[350px] lg:h-auto">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-800">
                <ImageIcon size={100} strokeWidth={0.5} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/60 to-transparent" />
          </div>

          <div className="lg:w-2/5 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
              <Sparkles size={80} className="md:w-[120px] md:h-[120px]" />
            </div>
            
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
              <div className="px-3 md:px-4 py-1.5 bg-primary/20 rounded-full text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20">
                Nổi bật
              </div>
              <div className="h-px w-8 md:w-10 bg-white/10" />
              <div className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> 5 phút đọc
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-7xl font-black mb-6 md:mb-10 tracking-tightest leading-[1] md:leading-[0.9] group-hover:text-primary transition-colors duration-700 italic uppercase">
              {post.title}
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg lg:text-2xl line-clamp-2 md:line-clamp-3 mb-8 md:mb-12 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
              {post.content}
            </p>

            <div className="flex items-center justify-between mt-auto pt-10 border-t border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-500">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Tác giả</p>
                  <p className="text-white text-sm font-black italic">{post.author?.name || "Bảo Nguyễn"}</p>
                </div>
              </div>
              <span className="text-primary font-black text-[11px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                ĐỌC BÀI VIẾT <ArrowRight size={20} />
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
