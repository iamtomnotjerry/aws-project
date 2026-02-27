"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api.service";
import { Card } from "@/components/ui/Card";
import { FileText, Heart, MessageSquare, Plus, CheckCircle, Clock, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await ApiService.admin.getStats();
      return res.data;
    },
  });

  const cards = [
    { 
      label: "Total Publications", 
      value: stats?.totalPosts ?? 0, 
      icon: <FileText className="text-blue-400" />,
      sub: `${stats?.publishedPosts ?? 0} Live / ${stats?.draftPosts ?? 0} Drafts`
    },
    { 
      label: "User Engagement", 
      value: stats?.totalLikes ?? 0, 
      icon: <Heart className="text-rose-400" />,
      sub: "Total Hearts received"
    },
    { 
      label: "Community Reach", 
      value: stats?.totalComments ?? 0, 
      icon: <MessageSquare className="text-emerald-400" />,
      sub: "Discussion items"
    },
    { 
      label: "Connected Souls", 
      value: stats?.totalUsers ?? 0, 
      icon: <User className="text-amber-400" />,
      sub: "Registered accounts"
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-white/[0.02] border border-white/[0.05] rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extra-bold tracking-tightest leading-none mb-2 italic">DASHBOARD</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Command Center Overview</p>
        </div>
        <Link href="/new-post">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 h-14 bg-primary text-white rounded-2xl font-black italic uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center gap-3"
          >
            <Plus size={20} /> New Mission
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-card !bg-white/[0.02] border-white/[0.05] p-8 group hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {card.icon}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{card.label}</h3>
              <p className="text-5xl font-black italic mb-4">{card.value}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">{card.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-10 border-white/[0.05] bg-white/[0.01]">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">System Health</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400 italic">Database Connection</span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400 italic">Cache Layer (Redis)</span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400 italic">Storage Engine (S3)</span>
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
          </div>
        </Card>
        
        <Link href="/admin/posts">
           <Card className="p-10 border-dashed border-white/10 bg-transparent hover:border-primary/30 transition-all cursor-pointer group flex flex-col items-center justify-center h-full">
             <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-500 group-hover:text-primary transition-all mb-4">
               <FileText size={32} />
             </div>
             <p className="text-sm font-black uppercase tracking-widest italic">Manage all content</p>
           </Card>
        </Link>
      </div>
    </div>
  );
}
