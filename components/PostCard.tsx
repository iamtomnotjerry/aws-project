import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="hover:bg-white/5 transition-all group h-full flex flex-col">
          <div className="relative aspect-video bg-white/5 overflow-hidden">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-700">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}
          </div>
          <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-gray-400 line-clamp-2 mb-6 text-lg flex-1">
              {post.content}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className="text-sm text-gray-500 font-medium">
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}
              </span>
              <span className="text-blue-500 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Read More →
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
