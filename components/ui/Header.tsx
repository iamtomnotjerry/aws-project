"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Book, Info } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import AuthButton from "@/features/auth/components/AuthButton";
import { MobileMenuPortal } from "@/components/ui/MobileMenuPortal";

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
    <header className="fixed top-0 left-0 right-0 z-[90] border-b border-white/[0.05] bg-[#0B0C0E]/60 backdrop-blur-xl">
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
          <div className="hidden md:block">
            <AuthButton />
          </div>

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

      {/* Premium Apple-Style Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenuPortal>
            <div 
              className="md:hidden"
              style={{ position: 'fixed', inset: 0, zIndex: 2147483647, pointerEvents: 'auto' }}
            >
              {/* Full Screen Container */}
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(5, 5, 7, 0.98)',
                  backdropFilter: 'blur(32px)',
                  WebkitBackdropFilter: 'blur(32px)',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 2,
                }}
              >
                {/* Header inside Menu */}
                <div className="flex items-center justify-between h-18 md:h-22 px-4 border-b border-white/[0.05]">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-xl font-black tracking-tight text-white italic">
                      BAO<span className="text-[#5E6AD2] not-italic">.DEV</span>
                    </span>
                  </Link>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col justify-center px-6 gap-8 pb-12 overflow-y-auto">
                  <nav className="flex flex-col gap-6">
                    <Link 
                      href="/" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group"
                    >
                      <span className="text-4xl sm:text-5xl font-black tracking-tighter text-white group-hover:text-[#5E6AD2] transition-colors uppercase">
                        TRANG CHỦ
                      </span>
                    </Link>
                    <Link 
                      href="/posts" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group"
                    >
                      <span className="text-4xl sm:text-5xl font-black tracking-tighter text-white group-hover:text-[#5E6AD2] transition-colors uppercase">
                        BÀI VIẾT
                      </span>
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group"
                    >
                      <span className="text-4xl sm:text-5xl font-black tracking-tighter text-white group-hover:text-[#5E6AD2] transition-colors uppercase">
                        GIỚI THIỆU
                      </span>
                    </Link>
                  </nav>

                  <div className="w-16 h-1 bg-gradient-to-r from-[#5E6AD2] to-transparent rounded-full my-4" />
                  
                  <div className="w-full">
                    <AuthButton variant="mobile" onMobileClick={() => setIsMobileMenuOpen(false)} />
                  </div>
                </div>

                {/* Footer Indicator */}
                <div className="px-6 pb-8 mt-auto flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Online</span>
                  </div>
                  <div className="text-[10px] font-medium italic text-slate-600">v1.0.0</div>
                </div>
              </motion.div>
            </div>
          </MobileMenuPortal>
        )}
      </AnimatePresence>
    </header>
  );
}
