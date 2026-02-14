"use client";

import { useSession } from "next-auth/react";
import { MailWarning, X, RefreshCw, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function VerificationBanner() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (session?.user && !session.user.emailVerified) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [session]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Đã gửi lại email xác thực!");
      } else {
        toast.error(data.message || "Không thể gửi lại email");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi hệ thống");
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-24 left-0 right-0 z-40 px-6 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="glass-morphism !bg-amber-500/10 border-amber-500/20 rounded-3xl p-5 shadow-2xl flex items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                <MailWarning size={24} />
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-tight">Xác thực địa chỉ Email</p>
                <p className="text-slate-400 text-xs font-medium">Vui lòng kiểm tra hộp thư để mở khóa toàn bộ tính năng.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 rounded-xl transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
              >
                {isResending ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Gửi lại
              </button>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
