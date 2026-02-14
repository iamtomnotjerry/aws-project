"use client";

import { Card } from "@/components/ui/Card";
import { ArrowLeft, Rocket, Code2, Heart, Coffee } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              About <span className="text-gradient">Bao's Blog</span>
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Xin chào! Mình là Bảo — một sinh viên đam mê công nghệ, đặc biệt là Cloud Computing và DevOps. 
              Blog này là nơi mình chia sẻ kiến thức, trải nghiệm và những bài học trên hành trình trở thành 
              một Cloud Engineer chuyên nghiệp.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Tech Stack</h3>
                  <p className="text-gray-400 text-sm">Next.js, TypeScript, AWS, Docker, PostgreSQL, Prisma</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Mục tiêu</h3>
                  <p className="text-gray-400 text-sm">Xây dựng sản phẩm thực tế, học hỏi mỗi ngày, chia sẻ cho cộng đồng</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Đam mê</h3>
                  <p className="text-gray-400 text-sm">Cloud Architecture, Infrastructure as Code, CI/CD Pipelines</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                  <Coffee size={20} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Ngoài code</h3>
                  <p className="text-gray-400 text-sm">Đọc sách, du lịch, và thưởng thức cà phê ☕</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
              <p>Built with ❤️ using Next.js & deployed on AWS</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
