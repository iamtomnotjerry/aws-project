import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ImageIcon, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  index: number;
}

export const PostCard = ({ post, index }: PostCardProps) => {
  return (
    <Link href={`/post/${post.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 6) * 0.1 }}
      >
        <Card className="group h-full flex flex-col glass-card border-white/[0.03] hover:border-primary/20">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-10 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter">
                <Calendar size={10} />
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}
              </div>
            </div>

            <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
              {post.title}
            </h3>
            
            <p className="text-slate-400 line-clamp-2 mb-8 text-lg flex-1 leading-relaxed font-medium">
              {post.content}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/[0.05]">
              <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                Đọc bài viết <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
