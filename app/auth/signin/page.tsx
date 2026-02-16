"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Command, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
       toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Email hoặc mật khẩu không đúng.");
      } else {
        toast.success("Đăng nhập thành công.");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Lỗi hệ thống.");
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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Welcome back</h1>
          <p className="text-subtle text-sm">Enter your credentials to access the workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-subtle uppercase tracking-wider ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131418] border border-[#2E2F33] rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-[#45464F]"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
             <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-medium text-subtle uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[11px] text-primary hover:underline">Forgot?</Link>
             </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#131418] border border-[#2E2F33] rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-[#45464F]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black h-10 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-subtle">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-foreground hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
      
      <div className="absolute bottom-6 text-[10px] text-[#2E2F33] font-mono">
        SECURED BY LINEAR AUTH
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-subtle" size={24} /></div>}>
      <SignInContent />
    </Suspense>
  );
}
