"use client";

import { ImageIcon, Calendar, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PostWithAuthor } from "@/types";

interface StandardPostCardProps {
  post: PostWithAuthor;
}


export const StandardPostCard = ({ post }: StandardPostCardProps) => {
  return (
    <Link href={`/post/${post.id}`}>
    <div className="h-full">
        <div className="group h-full flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/[0.04] hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 rounded-[2.5rem] overflow-hidden relative">
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-800">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 property-padding via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          </div>

          <div className="p-6 md:p-10 flex-1 flex flex-col relative">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white/[0.03] rounded-full text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/[0.05] group-hover:border-primary/20 group-hover:text-primary/70 transition-colors">
                <Calendar size={12} />
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 group-hover:text-primary transition-colors duration-500 line-clamp-2 leading-tight tracking-tightest italic">
              {post.title}
            </h3>
            
            <p className="text-slate-500 line-clamp-2 mb-8 md:mb-12 text-base md:text-lg flex-1 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
              {post.content}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 md:pt-8 border-t border-white/[0.04]">
              <span className="text-primary font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                KHÁM PHÁ <ArrowRight size={18} />
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-slate-950 transition-all duration-500">
                <Sparkles size={14} />
              </div>
            </div>
          </div>
        </div>
    </div>
    </Link>
  );
};
