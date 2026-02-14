"use client";

import { Card } from "@/components/ui/Card";
import { ArrowLeft, Rocket, Code2, Heart, Coffee, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-48 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-all duration-300 group font-bold"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Về Trang Chủ
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="p-10 md:p-20 glass-card relative overflow-hidden">
            <div className="absolute top-10 right-10 opacity-10 rotate-12">
              <Sparkles size={120} className="text-primary" />
            </div>

            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none">
                Về <span className="text-gradient">Bảo.Dev</span>
              </h1>
              
              <p className="text-slate-400 text-xl leading-relaxed mb-16 max-w-2xl font-medium">
                Chào bạn! Mình là Bảo — một kỹ sư đam mê xây dựng hạ tầng Cloud và tối ưu hóa hệ thống. 
                Blog này là nơi lưu trữ hành trình chinh phục AWS, DevOps và những câu chuyện thú vị 
                trong cuộc sống hàng ngày của mình.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {[
                  {
                    icon: <Code2 size={24} />,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                    title: "Công Nghệ",
                    desc: "Next.js, TypeScript, AWS Architecture, Docker, CI/CD"
                  },
                  {
                    icon: <Rocket size={24} />,
                    color: "text-purple-400",
                    bg: "bg-purple-500/10",
                    title: "Sứ Mệnh",
                    desc: "Xây dựng các hệ thống scalable, hiệu quả và chia sẻ kiến thức cộng đồng."
                  },
                  {
                    icon: <Heart size={24} />,
                    color: "text-red-400",
                    bg: "bg-red-500/10",
                    title: "Đam Mê",
                    desc: "Yêu thích sự gọn gàng của clean code và sự mạnh mẽ của Automation."
                  },
                  {
                    icon: <Coffee size={24} />,
                    color: "text-green-400",
                    bg: "bg-green-500/10",
                    title: "Đời Thường",
                    desc: "Yêu cà phê vỉa hè, mê đọc sách và thích khám phá những vùng đất mới."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-5 p-6 bg-white/[0.03] rounded-3xl border border-white/[0.05] hover:border-primary/20 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 shadow-inner`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-1 tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.05] pt-12 flex flex-col items-center gap-4 text-slate-600">
                <p className="text-sm font-bold tracking-widest uppercase italic">Stay Hungry, Stay Foolish</p>
                <div className="h-1 w-20 bg-primary opacity-30 rounded-full" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
