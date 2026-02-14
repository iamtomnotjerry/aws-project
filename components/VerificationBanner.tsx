"use client";

import { useSession } from "next-auth/react";
import { MailWarning, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerificationBanner() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (session?.user && !session.user.emailVerified) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [session]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-20 left-0 right-0 z-40 px-6 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-gradient-to-r from-amber-500/90 to-orange-600/90 backdrop-blur-md border border-amber-400/20 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MailWarning size={20} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Verify your email address</p>
                <p className="text-white/80 text-xs">Check your inbox for a verification link to unlock all features.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
