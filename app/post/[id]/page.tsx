import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Trash2 } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 px-6 max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10">
        <ArrowLeft size={18} /> Back to feed
      </Link>

      <article className="glass p-10 rounded-3xl">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex gap-2">
            <Link 
              href={`/post/${post.id}/edit`}
              className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl hover:bg-blue-500/20 transition-colors"
            >
              <Trash2 size={20} className="hidden" /> {/* Placeholder icon or use a pencil */}
              <span className="font-semibold text-sm">Edit</span>
            </Link>
            <DeleteButton id={post.id} />
          </div>
        </div>

        <div className="flex gap-6 text-sm text-gray-400 mb-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <User size={16} />
            {post.author?.name || "Admin"}
          </div>
        </div>

        <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </div>
  );
}
