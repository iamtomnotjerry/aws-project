"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// This boundary catches errors thrown anywhere in the App Router except root layout
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service like Sentry or Datadog
    console.error("Global captured error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-[3rem] p-10 md:p-14 text-center border-red-500/20 shadow-[-10px_-10px_30px_4px_rgba(239,68,68,0.1),_10px_10px_30px_4px_rgba(239,68,68,0.15)]"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-full mx-auto flex items-center justify-center mb-8 border border-red-500/20">
          <AlertOctagon size={48} className="text-red-500" />
        </div>
        
        <h2 className="text-3xl font-black mb-4 tracking-tightest uppercase italic">
          Hệ Thống <span className="text-red-500">Gián Đoạn</span>
        </h2>
        
        <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium italic">
          Chúng tôi đã ghi nhận sự cố này và đang tiến hành khắc phục. Vui lòng thử lại.
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => reset()} 
            className="w-full h-14 text-lg font-black tracking-widest rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
          >
            <RotateCcw size={20} className="mr-2" /> TẢI LẠI TRANG
          </Button>
          
          <Link href="/">
            <Button 
              variant="secondary" 
              className="w-full h-14 text-lg font-black tracking-widest rounded-2xl border-white/[0.05] hover:bg-white/[0.05]"
            >
              <Home size={20} className="mr-2" /> VỀ TRANG CHỦ
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
