"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api.service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const AdminPostTable = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const res = await ApiService.admin.getPosts(50);
      return res.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => ApiService.admin.togglePublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Visibility updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ApiService.posts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Post deleted permanently");
    },
  });

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-16 bg-white/[0.02] rounded-xl border border-white/[0.05]" />
      ))}
    </div>;
  }

  return (
    <div className="relative overflow-x-auto rounded-[2rem] border border-white/[0.05] bg-slate-950/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/[0.01] border-b border-white/[0.05]">
          <tr>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Engagement</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Created At</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {data?.posts?.map((post: any) => (
            <motion.tr 
              layout
              key={post.id} 
              className="hover:bg-white/[0.02] transition-colors group"
            >
              <td className="p-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/5 flex-shrink-0">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-800">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-black italic group-hover:text-primary transition-colors max-w-md line-clamp-1">{post.title}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">ID: {post.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </td>
              <td className="p-8">
                <button
                  onClick={() => toggleMutation.mutate(post.id)}
                  disabled={toggleMutation.isPending}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                    post.published 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  {post.published ? "Live" : "Draft"}
                </button>
              </td>
              <td className="p-8">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">Hearts</span>
                    <span className="text-xs font-bold">{post.likesCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">Comments</span>
                    <span className="text-xs font-bold">{post.commentsCount}</span>
                  </div>
                </div>
              </td>
              <td className="p-8">
                <p className="text-xs font-bold text-slate-600 italic">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </td>
              <td className="p-8">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/post/${post.id}/edit`}>
                    <motion.button whileHover={{ scale: 1.1 }} className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-slate-400 hover:text-primary transition-colors">
                      <Edit2 size={16} />
                    </motion.button>
                  </Link>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    onClick={() => {
                      if(window.confirm("Bury this resource forever?")) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                    className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {data?.posts?.length === 0 && (
        <div className="p-32 text-center">
          <p className="text-slate-600 font-black italic uppercase tracking-widest text-sm">Silence in the sector. No records found.</p>
        </div>
      )}
    </div>
  );
};
