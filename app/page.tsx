"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Users, GraduationCap, Briefcase, Activity, ArrowRight, Sparkles, BookOpen, Rocket, Search, Home as HomeIcon } from "lucide-react";
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
      {/* Hero Section - The Personal Entry */}
      <section className="relative pt-24 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-morphism border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/10"
          >
            <Sparkles size={12} className="animate-pulse" />
            Hành Trình Tìm Kiếm Sự Cân Bằng & Ý Nghĩa
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[8rem] font-black mb-10 tracking-tighter leading-none italic"
          >
            <div className="mb-4">CUỘC SỐNG</div>
            <div className="mt-8">
              <span className="text-gradient not-italic">CỦA BẢO.</span>
            </div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-500 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium chromatic-hint italic"
          >
            Nơi tôi lưu giữ những mảnh ghép giá trị nhất trong hành trình trưởng thành. Từ trí tuệ, sự nghiệp, tình bạn cho đến những rung cảm tâm hồn và mái ấm gia đình.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Magnetic strength={0.2}>
              <Link href="#pillars">
                <Button size="lg" className="min-w-[240px] h-18 text-xl font-black italic tracking-tightest rounded-2xl group shadow-2xl shadow-primary/20" glow>
                  KẾT NỐI NGAY <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/about">
                <Button variant="secondary" size="lg" className="min-w-[240px] h-18 text-lg rounded-2xl border-white/10 hover:border-primary/50">
                  Về Bản Thân <Users size={20} className="text-primary" />
                </Button>
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      <div id="pillars" className="max-w-7xl mx-auto px-6 relative scroll-mt-32">
        {/* Soft Background Glows */}
        <div className="absolute -top-64 -left-64 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -z-10" />
        <div className="absolute top-1/2 -right-64 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[180px] -z-10" />

        {/* Life Pillars Grid - 6 Cells Balanced */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-32">
          {/* 1. Học Tập (Learning) */}
          <div className="md:col-span-4 h-full">
            <SpotlightCard className="h-full bg-violet-500/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-8 border border-violet-500/20 shadow-xl shadow-violet-500/10">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white line-clamp-1">
                Học <span className="text-violet-400 not-italic">TẬP.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Kiến thức là đại dương bao la. Tôi dành trọn tâm huyết để học hỏi những điều mới mẻ, từ công nghệ đến triết lý sống.
              </p>
            </SpotlightCard>
          </div>

          {/* 2. Công Việc (Work) */}
          <div className="md:col-span-4 h-full">
            <SpotlightCard className="h-full border-primary/20 bg-primary/[0.01]">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-xl shadow-primary/10">
                <Briefcase size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white line-clamp-1">
                Công <span className="text-primary not-italic">VIỆC.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Nơi đam mê lập trình trở thành những sản phẩm thực tế. Tôi luôn theo đuổi sự hoàn hảo và chuyên nghiệp trong từng dòng mã.
              </p>
            </SpotlightCard>
          </div>

          {/* 3. Bạn Bè (Friends) */}
          <div className="md:col-span-4 h-full">
            <SpotlightCard className="h-full bg-cyan-500/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white line-clamp-1">
                Bạn <span className="text-cyan-400 not-italic">BÈ.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Kết nối và sẻ chia những khoảnh khắc quý giá. Những người đồng hành tuyệt vời giúp cuộc sống của tôi thêm phần ý nghĩa.
              </p>
            </SpotlightCard>
          </div>

          {/* 4. Sức Khỏe (Health) */}
          <div className="md:col-span-4 h-full">
            <SpotlightCard className="h-full bg-emerald-500/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white line-clamp-1">
                Sức <span className="text-emerald-400 not-italic">KHỎE.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Thân thể khỏe mạnh là ngôi đền của tâm hồn. Rèn luyện mỗi ngày để duy trì năng lượng tích cực nhất.
              </p>
            </SpotlightCard>
          </div>

          {/* 5. Tình Yêu (Love) */}
          <div className="md:col-span-4 h-full">
            <SpotlightCard className="h-full bg-rose-500/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-8 border border-rose-500/20 shadow-xl shadow-rose-500/10">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white line-clamp-1">
                Tình <span className="text-rose-400 not-italic">YÊU.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Rung cảm từ trái tim, sự sẻ chia và thấu hiểu. Là nguồn động lực lớn lao để tôi hoàn thiện bản thân mình.
              </p>
            </SpotlightCard>
          </div>

          {/* 6. Gia Đình (Family) */}
          <div className="md:col-span-4 h-full">
            <SpotlightCard className="h-full bg-amber-500/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-8 border border-amber-500/20 shadow-xl shadow-amber-500/10">
                <HomeIcon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-white line-clamp-1">
                Gia <span className="text-amber-400 not-italic">ĐÌNH.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Nơi tình yêu bắt đầu và không bao giờ kết thúc. Điểm tựa vững chắc nhất sau những bộn bề của cuộc sống.
              </p>
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
