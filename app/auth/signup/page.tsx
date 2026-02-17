"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Command, Loader2, Sparkles, Zap, User, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/features/core/components/SpotlightCard";
import { Magnetic } from "@/components/ui/Magnetic";
import { Button } from "@/components/ui/Button";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Sign up failed");
      }

      toast.success("Tài khoản đã được khởi tạo. Vui lòng kiểm tra email.");
      
      setFormData({ name: "", email: "", password: "" });
      
      setTimeout(() => {
        router.push("/auth/signin?success=VerifyEmail");
      }, 1500);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong đợi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -right-20 md:right-0 w-[400px] md:w-[1000px] h-[400px] md:h-[1000px] bg-primary/5 rounded-full blur-[100px] md:blur-[250px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 md:-bottom-64 md:-left-64 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-accent/5 rounded-full blur-[80px] md:blur-[220px] -z-10 pointer-events-none" />

      <div className="absolute top-8 left-8 z-20">
        <Magnetic strength={0.2}>
          <Link 
            href="/" 
            className="flex items-center gap-4 text-slate-500 hover:text-white transition-all duration-500 group"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
              <ArrowLeft size={16} />
            </div>
            <span className="font-black uppercase text-[10px] tracking-[0.3em]">QUAY VỀ</span>
          </Link>
        </Magnetic>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] relative z-10"
      >
        <SpotlightCard className="p-12 md:p-16 border-white/[0.05] glass-card" glowColor="rgba(242, 201, 76, 0.1)">
          <div className="mb-12 text-center">
             <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-2xl mx-auto flex items-center justify-center text-primary mb-8 shadow-2xl"
            >
              <ShieldCheck size={32} />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={10} /> Khởi tạo tài khoản
            </div>
            
            <h1 className="text-5xl font-black tracking-tightest leading-none italic uppercase mb-4">
              GIA NHẬP <span className="text-gradient not-italic">COMMUNITY.</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">Bắt đầu hành trình sẻ chia kiến thức cùng cộng đồng công nghệ.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <User size={12} className="text-primary" /> HỌ TÊN CỦA BẠN
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-sm text-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600"
                placeholder="Bao Nguyen"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Mail size={12} className="text-primary" /> ĐỊA CHỈ EMAIL
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-sm text-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Zap size={12} className="text-primary" /> MẬT KHẨU BẢO MẬT
              </label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                <>TẠO TÀI KHOẢN <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 font-medium italic">
              Đã có tài khoản?{" "}
              <Link href="/auth/signin" className="text-white hover:text-primary transition-colors font-black not-italic border-b border-white/20 hover:border-primary">
                Đăng Nhập
              </Link>
            </p>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
