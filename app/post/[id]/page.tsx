import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Edit3, ImageIcon } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to knowledge feed
      </Link>

      <Card className="overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative aspect-video md:aspect-[21/9] bg-white/5 border-b border-white/5">
          {post.coverImage ? (
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
              <ImageIcon size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        <article className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                  <Calendar size={14} className="text-blue-500" />
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                  <User size={14} className="text-purple-500" />
                  {post.author?.name || "Bao's Blog"}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-3 w-full md:w-auto">
                <Link href={`/post/${post.id}/edit`} className="flex-1 md:flex-none">
                  <Button variant="secondary" className="w-full">
                    <Edit3 size={18} /> Edit
                  </Button>
                </Link>
                <div className="flex-1 md:flex-none">
                  <DeleteButton id={post.id} />
                </div>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-medium">
              {post.content}
            </div>
          </div>
        </article>
      </Card>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Article ID: <code className="bg-white/5 px-2 py-0.5 rounded text-xs">{post.id}</code>
        </p>
      </div>
    </div>
  );
}
