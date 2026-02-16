"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Command, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Sign up failed");
      }

      toast.success("Account created. Please check your email.");
      
      setFormData({ name: "", email: "", password: "" });
      
      setTimeout(() => {
        router.push("/auth/signin?success=VerifyEmail");
      }, 1500);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <Link 
        href="/" 
        className="absolute top-8 left-8 text-subtle hover:text-foreground transition-colors text-sm font-medium flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px]"
      >
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-white rounded-xl mx-auto flex items-center justify-center text-black mb-6 shadow-xl shadow-white/10">
            <Command size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Create your account</h1>
          <p className="text-subtle text-sm">Join the workspace to start collaborating.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-subtle uppercase tracking-wider ml-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#131418] border border-[#2E2F33] rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-[#45464F]"
              placeholder="Bao Nguyen"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-subtle uppercase tracking-wider ml-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#131418] border border-[#2E2F33] rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-[#45464F]"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-subtle uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[#131418] border border-[#2E2F33] rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-[#45464F]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black h-10 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-subtle">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-foreground hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
