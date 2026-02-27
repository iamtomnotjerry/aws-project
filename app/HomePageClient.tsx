"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen } from "lucide-react";
import { PostCard } from "@/features/blog/components/PostCard";
import { PostWithAuthor } from "@/types";

interface HomePageClientProps {
  initialPosts: PostWithAuthor[];
  initialCursor: string | null;
}

export default function HomePageClient({ initialPosts, initialCursor }: HomePageClientProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-morphism border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/10"
          >
            <Sparkles size={12} className="text-[#5E6AD2]" />
             Nhật Ký Cá Nhân
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-[8rem] font-black mb-8 md:mb-10 tracking-tighter leading-[0.9] md:leading-none italic uppercase"
          >
            <div className="mb-2 md:mb-4">Những câu</div>
            <div className="mt-4 md:mt-8">
              <span className="text-gradient not-italic">Chuyện đời.</span>
            </div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-400 text-lg md:text-xl mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium chromatic-hint italic px-4 md:px-0"
          >
            Góc nhỏ lưu giữ những thước phim chân thực về cuộc sống, học tập, sự nghiệp, niềm đam mê thể thao, sự ấm áp từ gia đình và những người đồng hành tuyệt vời.
          </motion.p>
        </div>
      </section>

      <div id="pillars" className="max-w-7xl mx-auto px-6 relative scroll-mt-32">
        <section id="posts" className="scroll-mt-40">
          <div className="flex flex-col mb-24">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8 w-fit">
              <BookOpen size={12} /> Bài viết mới nhất
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <h2 className="text-6xl md:text-8xl font-black tracking-tightest leading-none italic uppercase drop-shadow-2xl">
                BÀI <span className="text-gradient not-italic">VIẾT.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
            {initialPosts.length > 0 ? (
              <>
                <div className="md:col-span-12">
                  <PostCard post={initialPosts[0]} featured />
                </div>
                {initialPosts.slice(1, 4).map((post) => (
                  <div key={post.id} className="md:col-span-4">
                    <PostCard post={post} />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-full text-center py-64 glass-card rounded-[3rem] border-white/[0.03] opacity-50">
                <p className="text-slate-500 text-2xl font-black uppercase tracking-widest italic">Kho kiến thức đang được hoàn thiện...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
