"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Home } from "lucide-react";
import { SpotlightCard } from "@/features/core/components/SpotlightCard";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -right-20 md:right-0 w-[400px] md:w-[1000px] h-[400px] md:h-[1000px] bg-primary/5 rounded-full blur-[100px] md:blur-[250px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 md:-bottom-64 md:-left-64 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-accent/5 rounded-full blur-[80px] md:blur-[220px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] relative z-10"
      >
        <SpotlightCard className="p-12 md:p-16 border-white/[0.05] glass-card text-center" glowColor="rgba(34, 197, 94, 0.15)">
          <div className="mb-10 flex justify-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-500 border border-green-500/20 shadow-2xl shadow-green-500/20"
            >
              <CheckCircle2 size={40} />
            </motion.div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-green-400 text-[9px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={10} /> Xác thực hoàn tất
          </div>

          <h1 className="text-4xl font-black tracking-tightest leading-none italic uppercase mb-6">
            KÍCH HOẠT <span className="text-green-500 not-italic">THÀNH CÔNG.</span>
          </h1>
          
          <p className="text-slate-500 text-lg font-medium italic mb-12 leading-relaxed">
            Hành trình của bạn đã chính thức bắt đầu. Tài khoản đã được xác thực và sẵn sàng để kết nối.
          </p>

          <div className="space-y-4">
            <Magnetic strength={0.2}>
              <Link href="/auth/signin" className="block">
                <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-black italic tracking-tightest group" glow>
                  ĐĂNG NHẬP NGAY <Zap size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-colors mt-4">
              <Home size={12} /> Quay về trang chủ
            </Link>
          </div>
        </SpotlightCard>
      </motion.div>
      
      <div className="absolute bottom-8 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">
        INFINITY DIGITAL ECOSYSTEM
      </div>
    </div>
  );
}
