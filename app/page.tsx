"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Rocket, Shield, Database, Search, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/hooks/use-posts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PostCard } from "@/components/PostCard";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Magnetic } from "@/components/ui/Magnetic";

export default function Home() {
  const { posts, loading, loadingMore, error, hasMore, loadMore } = usePosts(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen pb-48">
      {/* Hero Section - The "WOW" Factor */}
      <section className="relative pt-40 pb-64 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-12 rounded-full glass-morphism border-white/[0.08] text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/10"
          >
            <Sparkles size={14} className="animate-pulse" />
            Nơi Công Nghệ Hội Tụ Đam Mê
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] font-black mb-12 tracking-tightest leading-[0.85] italic"
          >
            HƠN CẢ <br />
            <span className="text-gradient not-italic">MÃ NGUỒN.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-400 text-xl md:text-2xl mb-16 max-w-2xl mx-auto leading-relaxed font-medium chromatic-hint"
          >
            Chào mừng bạn đến với <span className="text-white font-black italic">Bao.Dev</span> — Nơi những dòng code khô khan trở thành những câu chuyện công nghệ đầy cảm hứng.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-8"
          >
            <Magnetic strength={0.2}>
              <Link href="#posts">
                <Button size="lg" glow className="min-w-[240px] h-18 text-lg rounded-2xl shadow-2xl shadow-primary/20">
                  Khám Phá Bài Viết <ArrowRight size={20} />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/about">
                <Button variant="secondary" size="lg" className="min-w-[240px] h-18 text-lg rounded-2xl border-white/10 hover:border-primary/50">
                  Về Tác Giả <Rocket size={20} className="text-primary" />
                </Button>
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Features Grid - Spotlight Version */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-64">
          <div className="md:col-span-4">
            <SpotlightCard>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 border border-primary/20">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Cloud Engineering</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Kiến trúc hạ tầng vững chắc, bảo mật và tối ưu hóa trên mọi đám mây.</p>
            </SpotlightCard>
          </div>
          <div className="md:col-span-4 mt-12 md:mt-24">
            <SpotlightCard>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 border border-primary/20">
                <Rocket size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Tech Mastery</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Hành trình chinh phục những công nghệ mới nhất và hiện đại nhất.</p>
            </SpotlightCard>
          </div>
          <div className="md:col-span-4">
            <SpotlightCard>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 border border-primary/20">
                <Database size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Real-world Insight</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Những bài học xương máu từ các dự án thực tế quy mô lớn.</p>
            </SpotlightCard>
          </div>
        </div>

        {/* Posts Section - Asymmetrical Grid */}
        <section id="posts" className="scroll-mt-40">
          <div className="flex flex-col mb-32">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8 w-fit">
              <BookOpen size={12} /> Bài viết mới nhất
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <h2 className="text-6xl md:text-8xl font-black tracking-tightest leading-none italic uppercase">
                BẢNG TIN <br /> <span className="text-gradient not-italic">KIẾN THỨC.</span>
              </h2>
              
              <div className="w-full md:w-[500px]">
                <div className="relative group">
                  <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors duration-300" size={24} />
                  <Input 
                    placeholder="Tìm kiếm trí tuệ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-18 pr-8 rounded-3xl h-20 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] transition-all font-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {loading ? (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video glass-morphism rounded-4xl animate-pulse bg-white/5" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                {/* Featured Post - Large Layout */}
                {featuredPost && (
                  <div className="md:col-span-12 mb-10">
                    <PostCard post={featuredPost} index={0} featured />
                  </div>
                )}
                
                {/* Regular Posts - Asymmetrical */}
                {regularPosts.map((post, idx) => (
                  <div key={post.id} className={idx % 3 === 0 ? "md:col-span-8" : "md:col-span-4"}>
                    <PostCard post={post} index={idx + 1} />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-full text-center py-64 glass-card rounded-[3rem] border-white/[0.03] opacity-50">
                <p className="text-slate-500 text-2xl font-black uppercase tracking-widest italic">Kho kiến thức đang được cập nhật...</p>
              </div>
            )}
          </div>

          {/* Load More Button - Infinity Design */}
          {!loading && hasMore && filteredPosts.length > 0 && (
            <div className="mt-40 flex justify-center">
              <Magnetic strength={0.1}>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={loadMore} 
                  loading={loadingMore}
                  className="min-w-[320px] h-20 text-xl font-black tracking-tighter hover:bg-primary/10 hover:text-primary transition-all rounded-3xl border-white/[0.08]"
                >
                  MỞ RỘNG TẦM NHÌN <ArrowRight size={24} />
                </Button>
              </Magnetic>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
