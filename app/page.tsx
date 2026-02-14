"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, BookOpen, Rocket, Shield, Database, ImageIcon } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 px-6 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-6 text-gradient"
        >
          StudyMate Cloud Blog
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
        >
          Nền tảng chia sẻ kiến thức về AWS, Next.js và Điện toán đám mây hiện đại.
        </motion.p>
        
        <div className="flex justify-center gap-4">
          <Link href="/new-post">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 rounded-full font-semibold flex items-center gap-2 glow"
            >
              <Plus size={20} /> Create New Post
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 glass rounded-full font-semibold flex items-center gap-2"
          >
            <BookOpen size={20} /> Read Docs
          </motion.button>
        </div>
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <FeatureCard 
          icon={<Shield className="text-blue-500" />}
          title="Secure SSL"
          description="Bảo mật HTTPS toàn diện với Let's Encrypt và Nginx."
        />
        <FeatureCard 
          icon={<Database className="text-purple-500" />}
          title="AWS S3 Storage"
          description="Lưu trữ hình ảnh bài viết bền vững trên đám mây Amazon S3."
        />
        <FeatureCard 
          icon={<Rocket className="text-green-500" />}
          title="CI/CD Auto-Deploy"
          description="Tự động cập nhật code từ GitHub lên EC2 chỉ trong vài giây."
        />
      </div>

      {/* Posts Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold">Latest Knowledge</h2>
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post, idx) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-3xl overflow-hidden hover:bg-white/5 transition-all group"
                >
                  <div className="relative w-full aspect-video bg-white/5">
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-2 mb-6 text-lg">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-blue-500 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read full article →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 glass rounded-3xl"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
