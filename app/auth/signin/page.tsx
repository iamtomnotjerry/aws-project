"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Lock, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    
    if (success === "VerifyEmail") {
      toast.info("Registration initiated! Please check your email to verify your account.");
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        VerificationFailed: "Verification failed. Please try again or request a new link.",
        TokenExpired: "Verification link has expired. Please request a new one.",
        InvalidToken: "Invalid verification link.",
        EmailAlreadyTaken: "This email is already registered. Please sign in.",
        MissingToken: "Verification link is incomplete.",
        UserNotFound: "Account not found.",
      };
      toast.error(errorMessages[error] || "An error occurred. Please try again.");
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
        toast.error("Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 md:p-10 border-white/10 bg-black/40 backdrop-blur-xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 mb-6 shadow-lg shadow-blue-500/20">
          <Lock className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 focus:border-blue-500/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/10 focus:border-blue-500/50"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          glow 
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#020617] -z-20" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />

      <Suspense fallback={
        <div className="w-full max-w-md p-8 md:p-10 border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
            <div className="h-12 bg-white/10 rounded"></div>
            <div className="h-12 bg-white/10 rounded"></div>
            <div className="h-12 bg-white/10 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}
