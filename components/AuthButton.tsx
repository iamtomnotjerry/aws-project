"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User, PenTool, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-9 w-20 bg-white/5 animate-pulse rounded-full" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors"
      >
        <LogIn size={18} /> Sign In
      </button>
    );
  }

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors">
          <Image 
            src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`} 
            alt={user.name || "User"} 
            fill 
            className="object-cover"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block ${isAdmin ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-400'}`}>
                  {user.role}
                </span>
              </div>

              <div className="p-2">
                {isAdmin && (
                  <Link 
                    href="/new-post" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <PenTool size={16} /> Write Story
                  </Link>
                )}
                
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} /> Profile
                </Link>

                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
