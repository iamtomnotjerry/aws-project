"use client";

import { PostWithAuthor } from "@/types";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/features/blog/components/PostCard";
import { motion } from "framer-motion";
import { usePosts } from "@/hooks/use-posts";
import { useMemo } from "react";

interface HomePageClientProps {
  initialPosts: PostWithAuthor[];
  initialCursor: string | null;
}

export default function HomePageClient({ initialPosts, initialCursor }: HomePageClientProps) {
  // Integrate real-time polling while using server-side initial data for instant load
  const { data } = usePosts(6, { posts: initialPosts, nextCursor: initialCursor });
  
  const posts = useMemo(() => {
    return data?.pages?.[0]?.posts || initialPosts;
  }, [data, initialPosts]);
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

      <div id="pillars" className="max-w-7xl mx-auto px-4 md:px-6 relative scroll-mt-32">
        <section id="posts" className="scroll-mt-40">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 md:mb-8 w-fit border border-primary/20">
              <BookOpen size={12} /> Bài viết mới nhất
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12">
              <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.85] md:leading-none italic uppercase">
                BÀI <span className="text-gradient not-italic">VIẾT.</span>
              </h2>
              <div className="flex flex-col gap-6 md:gap-8 items-start md:items-end">
                <p className="text-slate-500 text-sm md:text-base font-medium max-w-sm italic md:text-right">
                  Những suy ngẫm, kinh nghiệm và lát cắt thú vị về cuộc sống quanh mình.
                </p>
                <Magnetic strength={0.2}>
                  <Link 
                    href="/posts" 
                    className="group flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:border-primary transition-all duration-300"
                  >
                    Xem tất cả <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-20 md:mb-32">
            {posts.length > 0 ? (
              <>
                {/* Featured Post */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="md:col-span-12"
                >
                  <PostCard post={posts[0]} featured />
                </motion.div>

                {/* Sub-posts with stagger */}
                {posts.slice(1, 4).map((post, index) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                    className="md:col-span-4"
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-32 md:py-64 glass-card rounded-[2rem] md:rounded-[3rem] border-white/[0.03] flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 border border-white/[0.05]">
                  <BookOpen size={24} className="text-slate-600" />
                </div>
                <p className="text-slate-500 text-xl md:text-2xl font-black uppercase tracking-widest italic">
                  Kho kiến thức đang được hoàn thiện...
                </p>
                <p className="text-slate-600 text-xs mt-4 font-bold uppercase tracking-widest opacity-60"> Quay lại sau bạn nhé </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
