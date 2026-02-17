"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Command, Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/features/core/components/SpotlightCard";
import { Magnetic } from "@/components/ui/Magnetic";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
       toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Email hoặc mật khẩu không đúng.");
      } else {
        toast.success("Đăng nhập thành công.");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[250px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[220px] -z-10 pointer-events-none" />

      <div className="absolute top-8 left-8 z-20">
        <Magnetic strength={0.2}>
          <Link 
            href="/" 
            className="flex items-center gap-4 text-slate-500 hover:text-white transition-all duration-500 group"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
              <ArrowLeft size={16} />
            </div>
            <span className="font-black uppercase text-[10px] tracking-[0.3em]">HÀNH TRÌNH TIẾP TỤC</span>
          </Link>
        </Magnetic>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        <SpotlightCard className="p-12 md:p-16 border-white/[0.05] glass-card" glowColor="rgba(94, 106, 210, 0.15)">
          <div className="mb-12 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary/40"
            >
              <Zap size={32} fill="currentColor" />
            </motion.div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={10} /> Hệ Thống Đăng Nhập
            </div>
            
            <h1 className="text-5xl font-black tracking-tightest leading-none italic uppercase mb-4">
              CHÀO <span className="text-gradient not-italic">QUAY LẠI.</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">Tiếp tục hành trình chinh phục công nghệ cùng Bảo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ĐỊA CHỈ EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-sm text-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MẬT KHẨU</label>
                  <Link href="#" className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">Quên?</Link>
               </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-sm text-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-16 rounded-2xl text-lg font-black italic tracking-tightest group mt-4 overflow-hidden"
              glow
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (
                <>ĐĂNG NHẬP NGAY <Zap size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 font-medium italic">
              Chưa có tài khoản?{" "}
              <Link href="/auth/signup" className="text-white hover:text-primary transition-colors font-black not-italic border-b border-white/20 hover:border-primary">
                Tạo Ngay
              </Link>
            </p>
          </div>
        </SpotlightCard>
      </motion.div>
      
      <div className="absolute bottom-8 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">
        SECURED BY INFINITY AUTH
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
      <SignInContent />
    </Suspense>
  );
}
