"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Book, Info } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import AuthButton from "@/features/auth/components/AuthButton";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-background/60 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-18 md:h-22 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors duration-300">
            BẢO<span className="text-primary">.NGUYỄN</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden md:flex items-center gap-10">
            <Magnetic strength={0.2}>
              <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-300 relative group py-2">
                Trang chủ
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/posts" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-300 relative group py-2">
                Bài viết
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-300 relative group py-2">
                Giới thiệu
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </Magnetic>
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block" />
          <AuthButton />

          {/* Mobile Menu Toggle */}
          <button 
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400"
          >
            {isMobileMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-white/[0.05] z-[70] md:hidden p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black tracking-tightest leading-none text-white italic">
                  BAO<span className="text-primary not-italic">.DEV</span>
                </span>
                <button 
                  aria-label="Close mobile menu drawer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white"
                >
                  <Home size={18} className="text-primary" /> Trang chủ
                </Link>
                <Link 
                  href="/posts" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white"
                >
                  <Book size={18} className="text-primary" /> Bài viết
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white"
                >
                  <Info size={18} className="text-primary" /> Giới thiệu
                </Link>
              </nav>

              <div className="mt-auto">
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Trạng thái hệ thống</p>
                  <p className="text-xs font-medium text-slate-500 italic">Phiên bản di động đã được tối ưu hóa cho hiệu suất.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
