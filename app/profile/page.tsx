"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { User, Mail, Shield, Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Stories
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <User size={160} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <Image 
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2 text-gradient">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAdmin ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                    {user.role}
                  </span>
                  {user.emailVerified && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-tighter">
                      <CheckCircle size={10} /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                  <p className="text-gray-200">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Security Level</p>
                  <p className="text-gray-200">{isAdmin ? "Administrator (Full Access)" : "Regular User (Read Only)"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account ID</p>
                  <p className="text-gray-200 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
              <p>Bao's Blog Member</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
