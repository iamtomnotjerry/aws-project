import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Edit3, ImageIcon, Clock, Hash } from "lucide-react";
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
    <div className="min-h-screen pb-32">
      {/* Header Area with Subtle Glow */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-slate-950">
        {post.coverImage ? (
          <>
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover opacity-60 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-800">
            <ImageIcon size={120} strokeWidth={1} />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-5xl mx-auto px-6 w-full pb-20">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 mb-10 group"
            >
              <ArrowLeft size={20} /> Quay lại bảng tin công nghệ
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-[1.1] max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tác giả</p>
                  <p className="text-white font-bold">{post.author?.name || "Bao's Admin"}</p>
                </div>
              </div>

              <div className="w-px h-10 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={18} className="text-primary" />
                <span className="font-medium">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Clock size={18} className="text-primary" />
                <span className="font-medium">5 phút đọc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          {/* Main Content */}
          <Card className="p-10 md:p-16 glass-card !bg-background/80">
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 leading-[1.8] text-xl whitespace-pre-wrap font-medium">
                {post.content}
              </div>
            </div>

            {isAdmin && (
              <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-4">
                <Link href={`/post/${post.id}/edit`}>
                  <Button variant="secondary" className="px-10 h-14 border-primary/20 text-primary hover:bg-primary/10">
                    <Edit3 size={20} /> Chỉnh Sửa Bài Viết
                  </Button>
                </Link>
                <DeleteButton id={post.id} />
              </div>
            )}
          </Card>

          {/* Sidebar / Metadata */}
          <aside className="space-y-10">
            <div className="p-8 glass-card rounded-3xl border-white/[0.03]">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-primary">Thông tin bài viết</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Mã định danh</p>
                  <code className="text-[10px] font-mono text-slate-300 break-all">{post.id}</code>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Chia sẻ</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-primary/20 transition-colors cursor-pointer" />
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-primary/20 transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
