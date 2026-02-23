"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Critical system log before complete failure (Sentry point)
    console.error("FATAL ROOT ERROR:", error);
  }, [error]);

  return (
    <html lang="vi" className="dark">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 antialiased font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-red-500/20 rounded-[3rem] p-10 md:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <div className="w-24 h-24 bg-red-500/10 rounded-full mx-auto flex items-center justify-center mb-8 border border-red-500/20 relative z-10">
            <AlertOctagon size={48} className="text-red-500" />
          </div>
          
          <h2 className="text-3xl font-black mb-4 tracking-tightest uppercase italic relative z-10">
            Hệ Thống <span className="text-red-500">Sụp Đổ</span>
          </h2>
          
          <p className="text-slate-400 mb-10 text-lg leading-relaxed font-medium italic relative z-10">
            Đã xảy ra lỗi hệ thống nghiêm trọng ở khung bao quanh toàn cục. Kỹ sư nền tảng đang vào cuộc.
          </p>
          
          <button 
            onClick={() => reset()} 
            className="w-full h-14 text-lg font-black tracking-widest rounded-2xl bg-white text-slate-950 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 relative z-10"
          >
            <RotateCcw size={20} /> KHÔI PHỤC HỆ THỐNG
          </button>
        </div>
      </body>
    </html>
  );
}
