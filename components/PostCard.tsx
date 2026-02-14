import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ImageIcon, Calendar, ArrowRight, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  index: number;
  featured?: boolean;
}

export const PostCard = ({ post, index, featured = false }: PostCardProps) => {
  if (featured) {
    return (
      <Link href={`/post/${post.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="group flex flex-col lg:flex-row glass-card !p-0 overflow-hidden min-h-[500px] border-white/[0.05] hover:border-primary/30">
            <div className="lg:w-3/5 relative overflow-hidden bg-slate-900 h-[350px] lg:h-auto">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-800">
                  <ImageIcon size={100} strokeWidth={0.5} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/60 to-transparent" />
            </div>

            <div className="lg:w-2/5 p-12 lg:p-16 flex flex-col justify-center relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={120} />
              </div>
              
              <div className="flex items-center gap-4 mb-10">
                <div className="px-4 py-1.5 bg-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20">
                  Nổi bật
                </div>
                <div className="h-px w-10 bg-white/10" />
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> 5 phút đọc
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-8 tracking-tightest leading-[1.1] group-hover:text-primary transition-colors duration-500">
                {post.title}
              </h2>
              
              <p className="text-slate-400 text-lg lg:text-xl line-clamp-3 mb-10 leading-relaxed font-medium">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-auto pt-10 border-t border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tác giả</p>
                    <p className="text-white text-sm font-bold">Bao's Admin</p>
                  </div>
                </div>
                <span className="text-primary font-black text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                  Đọc ngay <ArrowRight size={20} />
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/post/${post.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 6) * 0.1, duration: 0.6 }}
      >
        <Card className="group h-full flex flex-col glass-card border-white/[0.03] hover:border-primary/20 hover:shadow-primary/5">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-10 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/[0.05]">
                <Calendar size={10} />
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}
              </div>
            </div>

            <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
              {post.title}
            </h3>
            
            <p className="text-slate-400 line-clamp-2 mb-10 text-lg flex-1 leading-relaxed font-medium">
              {post.content}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/[0.05]">
              <span className="text-primary font-black text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                Khám phá <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

const Sparkles = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="0.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);
