"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User, PenTool, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthButton({ 
  variant = "desktop", 
  onMobileClick 
}: { 
  variant?: "desktop" | "mobile";
  onMobileClick?: () => void;
}) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    if (variant === "mobile") return <div className="h-14 w-full bg-white/5 animate-pulse rounded-2xl" />;
    return <div className="h-10 w-24 bg-white/5 animate-pulse rounded-full" />;
  }

  if (!session) {
    if (variant === "mobile") {
      return (
        <button
          onClick={() => { onMobileClick?.(); signIn(); }}
          className="group flex items-center justify-between w-full text-left py-2"
        >
          <span className="text-3xl font-black tracking-tighter text-white group-hover:text-[#5E6AD2] transition-colors uppercase">
            Đăng nhập
          </span>
          <LogIn size={24} className="text-[#5E6AD2] opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      );
    }

    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-all duration-300"
      >
        <LogIn size={18} /> <span className="hidden sm:inline">Đăng nhập</span>
      </button>
    );
  }

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 relative">
             <Image 
               src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=020617&color=3b82f6&bold=true&size=100`} 
               alt={user.name || "User"} 
               fill 
               className="object-cover"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tight">{user.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</span>
          </div>
        </div>

        {isAdmin && (
          <Link 
            href="/new-post" 
            onClick={onMobileClick}
            className="group flex items-center justify-between py-2"
          >
            <span className="text-2xl font-black tracking-tighter text-slate-300 group-hover:text-white transition-colors uppercase">
              Viết bài mới
            </span>
            <PenTool size={20} className="text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        )}
        <Link 
          href="/profile" 
          onClick={onMobileClick}
          className="group flex items-center justify-between py-2"
        >
          <span className="text-2xl font-black tracking-tighter text-slate-300 group-hover:text-white transition-colors uppercase">
            Hồ sơ cá nhân
          </span>
          <User size={20} className="text-slate-500 group-hover:text-white transition-colors" />
        </Link>
        <button
          onClick={() => { onMobileClick?.(); signOut(); }}
          className="group flex items-center justify-between text-left py-2"
        >
          <span className="text-2xl font-black tracking-tighter text-red-500/80 group-hover:text-red-400 transition-colors uppercase">
            Đăng xuất
          </span>
          <LogOut size={20} className="text-red-500/50 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 md:gap-3 p-1 pr-2 md:pr-3 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all duration-300 focus:outline-none group"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
          <Image 
            src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=020617&color=3b82f6&bold=true&size=100`} 
            alt={user.name || "User"} 
            fill 
            className="object-cover"
          />
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-64 p-2 z-50 shadow-2xl overflow-hidden border border-white/[0.08] rounded-2xl"
              style={{ backgroundColor: '#050505' }}
            >
              <div className="p-4 mb-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <p className="font-black text-white truncate text-sm tracking-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider mb-2">{user.email}</p>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${isAdmin ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-slate-700/50 text-slate-400'}`}>
                  {isAdmin ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </div>

              <div className="space-y-1">
                {isAdmin && (
                  <Link 
                    href="/new-post" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-primary/10 rounded-xl transition-all duration-300 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <PenTool size={18} className="group-hover:scale-110 transition-transform" /> Viết bài mới
                  </Link>
                )}
                
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="group-hover:scale-110 transition-transform" /> Hồ sơ cá nhân
                </Link>

                <div className="h-px bg-white/[0.05] my-1 mx-2" />

                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                >
                  <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> Đăng xuất
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
