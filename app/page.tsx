"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, BookOpen, Rocket, Shield, Database } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-20 px-6 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-6 text-gradient"
        >
          AWS Cloud Project
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
        >
          A premium full-stack application built with Next.js, optimized for high-performance deployment on AWS infrastructure.
        </motion.p>
        
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 rounded-full font-semibold flex items-center gap-2 glow"
          >
            <Rocket size={20} /> Deploy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 glass rounded-full font-semibold flex items-center gap-2"
          >
            <BookOpen size={20} /> Documentation
          </motion.button>
        </div>
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <FeatureCard 
          icon={<Shield className="text-blue-500" />}
          title="Secure RDS"
          description="Integrated with AWS RDS PostgreSQL for reliable data persistence."
        />
        <FeatureCard 
          icon={<Database className="text-purple-500" />}
          title="Prisma ORM"
          description="Type-safe database access with automated migrations and seeding."
        />
        <FeatureCard 
          icon={<Plus className="text-green-500" />}
          title="EC2 Optimized"
          description="Containerized with Docker for seamless horizontal scaling."
        />
      </div>

      {/* Posts Section */}
      <section>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Latest Changes</h2>
          <motion.button 
            whileHover={{ rotate: 90 }}
            className="p-2 glass rounded-full"
          >
            <Plus />
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 glass rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-400">{post.content}</p>
                <div className="mt-4 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
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
