"use client";

import { useSession } from "next-auth/react";
import { MailWarning, X, RefreshCw } from "lucide-react";
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
        toast.success("Verification email sent!");
      } else {
        toast.error(data.message || "Failed to resend email");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-xl transition-all text-white text-xs font-bold"
              >
                {isResending ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
                Resend
              </button>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
