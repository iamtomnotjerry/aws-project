"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/posts`)
      .then((res) => res.json())
      .then((posts: Post[]) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push(`/post/${id}`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 max-w-2xl mx-auto">
      <Link href={`/post/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10">
        <ArrowLeft size={20} /> Back to post
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-10 rounded-3xl"
      >
        <h1 className="text-3xl font-bold mb-8 text-gradient">Edit Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
            <textarea 
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Describe the changes..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            className="w-full py-4 bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 glow disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : <><Save size={20} /> Save Changes</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
