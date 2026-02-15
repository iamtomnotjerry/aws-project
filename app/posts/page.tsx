"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, ArrowLeft, BookOpen, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/hooks/use-posts";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/PostCard";
import { Magnetic } from "@/components/ui/Magnetic";

export default function PostsPage() {
  const { posts, loading, loadingMore, error, hasMore, loadMore } = usePosts(12);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-48 pt-32 bg-slate-950 selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[180px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation & Header */}
        <div className="flex flex-col mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group font-bold px-4 py-2 rounded-full hover:bg-white/5">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Trở về trang chủ
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">
                <BookOpen size={12} /> Kho tàng kiến thức
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-none italic uppercase drop-shadow-2xl">
                BÀI <span className="text-gradient not-italic">VIẾT.</span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-[500px]"
            >
              <div className="relative group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors duration-300" size={24} />
                <Input 
                  placeholder="Tìm nội dung kiến thức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-18 pr-8 rounded-3xl h-20 bg-white/[0.02] border-white/[0.05] focus:border-primary/50 hover:bg-white/[0.04] transition-all font-black text-xl italic"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Categories / Filter Preview (Visual only for now) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-20"
        >
          {["Tất cả", "Công nghệ", "Cuộc sống", "Sự nghiệp", "Cảm hứng"].map((cat) => (
            <button 
              key={cat}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                cat === "Tất cả" 
                ? "bg-primary text-slate-950 border-primary shadow-xl shadow-primary/20" 
                : "bg-white/[0.02] text-slate-500 border-white/[0.05] hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] glass-morphism rounded-4xl animate-pulse bg-white/5 border border-white/5" />
            ))
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }
                  }
                }}
              >
                <PostCard post={post} index={idx} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-64 glass-card rounded-[3rem] border-white/[0.03] opacity-50">
               <Sparkles size={48} className="mx-auto mb-6 text-slate-700" />
               <p className="text-slate-500 text-2xl font-black uppercase tracking-widest italic font-outfit">Không tìm thấy bài viết nào...</p>
            </div>
          )}
        </motion.div>

        {/* Infinite Scroll Load More */}
        {!loading && hasMore && !searchQuery && (
          <div className="mt-40 flex justify-center">
            <Magnetic strength={0.1}>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={loadMore} 
                loading={loadingMore}
                className="min-w-[320px] h-20 text-xl font-black tracking-tighter hover:bg-primary/10 hover:text-primary transition-all rounded-3xl border-white/[0.08]"
              >
                MỞ RỘNG TẦM NHÌN <ArrowRight size={24} className="ml-2" />
              </Button>
            </Magnetic>
          </div>
        )}
      </div>
    </div>
  );
}

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
