"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  User, Mail, Shield, CheckCircle2, ChevronRight, 
  Settings, LogOut, Terminal, Keyboard, Sparkles, ShieldCheck, Zap
} from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { SpotlightCard } from "@/features/core/components/SpotlightCard";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  value?: React.ReactNode;
  action?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

function SettingsRow({ icon: Icon, label, value, action = false, destructive = false, onClick }: SettingsRowProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        group flex items-center justify-between p-5 border-b border-white/[0.05] 
        last:border-0 hover:bg-white/[0.02] transition-all cursor-pointer
        ${destructive ? "hover:bg-red-500/5" : ""}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.02] ${destructive ? "text-red-500 border-red-500/20" : "text-slate-400 group-hover:text-primary transition-colors"}`}>
          <Icon size={16} />
        </div>
        <span className={`text-sm font-bold tracking-tight ${destructive ? "text-red-500" : "text-slate-300 group-hover:text-white transition-colors"}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[13px] font-medium italic ${destructive ? "text-red-400" : "text-slate-500"}`}>{value}</span>
        {action && <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen bg-background" />;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-0 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[250px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[200px] -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12 px-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={10} /> Trung tâm điều khiển
            </div>
            <h1 className="text-4xl font-black tracking-tightest leading-none italic uppercase">HỒ SƠ <span className="text-gradient not-italic">CỦA BẠN.</span></h1>
          </div>
          <Magnetic strength={0.2}>
            <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/[0.03] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Settings size={20} />
            </div>
          </Magnetic>
        </div>
        
        {/* Identity Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <SpotlightCard className="p-8 md:p-10 flex flex-col items-center justify-center glass-card border-white/[0.05]" glowColor="rgba(94, 106, 210, 0.1)">
             <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 relative group z-10 shadow-2xl">
                    <Image 
                      src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=131418&color=EEEEF0`} 
                      alt="Avatar" 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white border-4 border-background z-20 shadow-lg">
                  <ShieldCheck size={16} />
                </div>
             </div>
             
             <h2 className="text-3xl font-black italic uppercase tracking-tightest mb-2 text-gradient">{user.name}</h2>
             <p className="text-slate-500 text-sm font-medium italic mb-6">{user.email}</p>
             
             {user.role === "ADMIN" && (
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">QUẢN TRỊ VIÊN HỆ THỐNG</span>
               </div>
             )}
          </SpotlightCard>
        </motion.div>

        {/* General Settings */}
        <div className="mb-10 space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
            <User size={12} className="text-primary" /> THÔNG TIN TÀI KHOẢN
          </h3>
          <div className="rounded-3xl border border-white/5 overflow-hidden bg-white/[0.02] backdrop-blur-sm">
            <SettingsRow icon={User} label="Tên Hiển Thị" value={user.name} action />
            <SettingsRow icon={Mail} label="Địa Chỉ Email" value={user.email} />
            <SettingsRow icon={Shield} label="ID Định Danh" value={<span className="font-mono text-[11px] text-primary/70">{user.id.slice(0, 12)}...</span>} />
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-10 space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
            <Terminal size={12} className="text-primary" /> TÙY CHỈNH CÁ NHÂN
          </h3>
          <div className="rounded-3xl border border-white/5 overflow-hidden bg-white/[0.02] backdrop-blur-sm">
            <SettingsRow icon={Terminal} label="Giao Diện Hệ Thống" value="Infinity Dark" action />
            <SettingsRow icon={Keyboard} label="Phím Tắt (Hotkeys)" value="Đang Bật" action />
            <SettingsRow icon={Zap} label="Chế Độ Hiệu Suất" value="Tối Ưu" action />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-red-500/10 overflow-hidden bg-white/[0.02]">
            <SettingsRow 
              icon={LogOut} 
              label="Đăng Xuất Khỏi Hệ Thống" 
              destructive 
              action 
              onClick={() => signOut({ callbackUrl: "/" })}
            />
          </div>
          <div className="flex flex-col items-center gap-1 pt-8">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
              INFINITY OS BUILD v1.2.4
            </p>
            <p className="text-[9px] text-slate-800 font-medium">DESIGNED BY PROTEUS LABS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
