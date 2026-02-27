"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./Button";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đăng ký thành công!");
        setEmail("");
      } else {
        throw new Error(data.error || "Có lỗi xảy ra");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-10 text-primary">BẢN TIN CÔNG NGHỆ</h4>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed italic">Nhận những cập nhật mới nhất về Cloud & DevOps trực tiếp vào inbox của bạn.</p>
      
      <form onSubmit={handleSubscribe} className="relative flex items-center">
        <input
          type="email"
          placeholder="Email của bạn..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-14 bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 pr-16 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none"
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="absolute right-1 w-12 h-12 rounded-xl p-0 flex items-center justify-center italic"
          glow
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
};

