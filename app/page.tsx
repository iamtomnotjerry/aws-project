"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Rocket, Shield, Database, Search, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/hooks/use-posts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PostCard } from "@/components/PostCard";
import { FeatureCard } from "@/components/FeatureCard";

export default function Home() {
  const { posts, loading, loadingMore, error, hasMore, loadMore } = usePosts(6);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section - The "WOW" Factor */}
      <section className="relative pt-32 pb-48 px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-morphism border-white/10 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} className="animate-spin-slow" />
            Sẵn sàng cho những hành trình mới
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9]"
          >
            Sáng tạo. Kết nối. <br />
            <span className="text-gradient">Phát triển.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-400 text-xl md:text-2xl mb-14 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Chào mừng bạn đến với blog của <span className="text-white font-bold underline decoration-primary/50 underline-offset-4">Bảo</span> — Một chuyên gia Cloud Engineering, người kể chuyện qua từng dòng code và những trải nghiệm thực chiến.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="#posts">
              <Button size="lg" glow className="min-w-[220px]">
                Xem Bài Viết <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="lg" className="min-w-[220px]">
                Về Tôi <Rocket size={20} className="text-primary" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Features Grid - Standardized but refined */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-48">
          <FeatureCard 
            icon={<Shield size={32} />}
            title="Cloud Engineering"
            description="Phân tích hạ tầng AWS, quy trình CI/CD và các giải pháp hạ tầng tối ưu trên mây."
          />
          <FeatureCard 
            icon={<Rocket size={32} />}
            title="Đào Tạo Bản Thân"
            description="Hành trình học hỏi không ngừng, từ kiến trúc phần mềm đến kỹ năng lãnh đạo."
          />
          <FeatureCard 
            icon={<Database size={32} />}
            title="Trải Nghiệm Sống"
            description="Những chuyến đi, cuốn sách tâm đắc và những câu chuyện thú vị đời thường."
          />
        </div>

        {/* Posts Section */}
        <section id="posts" className="scroll-mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div className="max-w-2xl">
              <div className="w-12 h-1.5 bg-primary mb-6 rounded-full" />
              <h2 className="text-5xl font-black mb-4 tracking-tight">KHO KIẾN THỨC</h2>
              <p className="text-slate-500 text-lg font-medium">Khám phá những bài viết mới nhất về Cloud, DevOps và công nghệ hiện đại.</p>
            </div>
            
            <div className="w-full md:w-[450px]">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors duration-300" size={22} />
                <Input 
                  placeholder="Tìm kiếm bài viết, chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-6 rounded-2xl h-18 bg-white/5 border-white/10 hover:border-white/20 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-center py-24 glass-card rounded-4xl border-red-500/10">
              <div className="mb-6 inline-flex p-4 bg-red-500/10 rounded-full text-red-400">
                <Sparkles size={32} />
              </div>
              <p className="text-white text-xl font-bold mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Thử Lại Kết Nối</Button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video glass-morphism rounded-3xl animate-pulse bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                  <PostCard key={post.id} post={post} index={idx} />
                ))
              ) : (
                <div className="col-span-full text-center py-40 glass-card rounded-4xl opacity-50">
                  <p className="text-slate-400 text-xl font-medium">Không tìm thấy bài viết nào phù hợp.</p>
                </div>
              )}
            </div>
          )}

          {/* Load More Button - Standardized */}
          {!loading && hasMore && filteredPosts.length > 0 && (
            <div className="mt-24 flex justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={loadMore} 
                loading={loadingMore}
                className="min-w-[280px] h-16 text-lg hover:border-primary/50 transition-all"
              >
                Tải Thêm Bài Viết
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
