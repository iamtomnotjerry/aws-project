"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { User, Mail, Shield, Calendar, ArrowLeft, CheckCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen pt-32 pb-48 px-6 relative overflow-hidden bg-background">
      {/* Infinity Glow Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-950/20 -z-20" />

      <div className="max-w-3xl mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-all duration-300 group font-bold px-4 py-2 rounded-full hover:bg-white/5"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Trở về Bảng tin
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-10 md:p-16 glass-card relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-white">
              <User size={300} strokeWidth={1} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-4xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-900">
                  <Image 
                    src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=020617&color=3b82f6&bold=true&size=200`}
                    alt={user.name || "User"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-6xl font-black mb-6 tracking-tightest text-white italic leading-none">{user.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${isAdmin ? 'bg-primary/20 text-primary border-primary/30' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                    {isAdmin ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                  {user.emailVerified && (
                    <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle size={12} /> Đã xác thực
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-16 space-y-5">
              {[
                {
                  label: "Địa chỉ Email",
                  value: user.email,
                  icon: <Mail size={22} />,
                  bg: "bg-blue-500/10",
                  color: "text-blue-400"
                },
                {
                  label: "Cấp độ bảo mật",
                  value: isAdmin ? "Toàn quyền quản trị (System-wide)" : "Người dùng phổ thông (Read-only)",
                  icon: <Shield size={22} />,
                  bg: "bg-purple-500/10",
                  color: "text-purple-400"
                },
                {
                  label: "Mã tài khoản",
                  value: user.id,
                  icon: <Smartphone size={22} />,
                  bg: "bg-emerald-500/10",
                  color: "text-emerald-400",
                  fontMono: true
                }
              ].map((item, idx) => (
                <Magnetic key={idx} strength={0.1}>
                  <div className="flex items-center gap-8 p-8 glass-card !bg-white/[0.01] hover:!bg-white/[0.04] border-white/[0.03] rounded-[2.5rem] group transition-all duration-500">
                    <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 shadow-2xl shadow-black/80 group-hover:scale-110 transition-all duration-500`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-2">{item.label}</p>
                      <p className={`text-slate-100 font-black text-xl italic ${item.fontMono ? 'font-mono text-xs tracking-tightest not-italic opacity-60' : ''}`}>{item.value}</p>
                    </div>
                  </div>
                </Magnetic>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-white/[0.05] text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Thành viên BẢO.NGUYỄN từ 2026</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
