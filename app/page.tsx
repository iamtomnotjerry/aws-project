"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, BookOpen, Rocket, Shield, Database, Search } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/hooks/use-posts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PostCard } from "@/components/PostCard";
import { FeatureCard } from "@/components/FeatureCard";
import { toast } from "sonner";

export default function Home() {
  const { posts, loading, error } = usePosts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold"
        >
          ✨ New: Phase 6 S3 Integration Live
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl font-extrabold mb-8 tracking-tight"
        >
          StudyMate <span className="text-gradient">Cloud Blog</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Hành trình chinh phục AWS, Next.js và kiến trúc Cloud hiện đại qua những bài chia sẻ thực chiến.
        </motion.p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/new-post">
            <Button size="lg" glow>
              <Plus size={22} /> Create Post
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            <BookOpen size={22} /> Explorer Docs
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <FeatureCard 
          icon={<Shield size={28} className="text-blue-500" />}
          title="Secure Infrastructure"
          description="Kiến trúc bảo mật HTTPS/SSL chuẩn AWS với Nginx và Let's Encrypt."
        />
        <FeatureCard 
          icon={<Database size={28} className="text-purple-500" />}
          title="S3 Cloud Assets"
          description="Hình ảnh được tối ưu và lưu trữ bền vững trên đám mây Amazon S3."
        />
        <FeatureCard 
          icon={<Rocket size={28} className="text-green-500" />}
          title="CI/CD Pipeline"
          description="Tự động hóa triển khai từ GitHub lên EC2 chỉ trong một nốt nhạc."
        />
      </div>

      {/* Posts Section */}
      <section id="posts">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-3 italic">Knowledge Base</h2>
            <p className="text-gray-500">Mới nhất từ cộng đồng Cloud Engineering.</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <Input 
              placeholder="Search articles by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 rounded-2xl h-14 bg-white/5 border-white/5"
            />
          </div>
        </div>

        {error && (
          <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-red-500/10">
            <p className="text-red-400 mb-4">{error}</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>Retry Connection</Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video glass rounded-3xl animate-pulse bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <PostCard key={post.id} post={post} index={idx} />
              ))
            ) : (
              <div className="col-span-full text-center py-32 glass rounded-3xl">
                <p className="text-gray-500 text-lg">No articles found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
