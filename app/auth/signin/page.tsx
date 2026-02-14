"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Lock, ArrowLeft, Mail, Sparkles } from "lucide-react";
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
      toast.info("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        VerificationFailed: "Xác thực thất bại. Vui lòng thử lại hoặc yêu cầu link mới.",
        TokenExpired: "Link xác thực đã hết hạn. Vui lòng yêu cầu link mới.",
        InvalidToken: "Link xác thực không hợp lệ.",
        EmailAlreadyTaken: "Email này đã được đăng ký. Vui lòng đăng nhập.",
        MissingToken: "Link xác thực không đầy đủ.",
        UserNotFound: "Không tìm thấy tài khoản.",
      };
      toast.error(errorMessages[error] || "Đã có lỗi xảy ra. Vui lòng thử lại.");
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
        toast.error("Thông tin đăng nhập không chính xác");
      } else {
        toast.success("Chào mừng bạn quay trở lại!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-10 md:p-14 glass-card relative overflow-hidden">
      <div className="absolute -top-10 -right-10 opacity-10 rotate-12 text-primary">
        <Lock size={150} />
      </div>

      <div className="relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white mb-10 transition-colors group font-bold"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại Trang chủ
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/20 mb-8 border border-primary/20 shadow-xl shadow-primary/10">
            <Lock className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Đăng Nhập</h1>
          <p className="text-slate-500 font-medium">Truy cập vào bảng điều khiển cá nhân</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input 
            label="Địa chỉ Email"
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/[0.03]"
            required
          />

          <Input 
            label="Mật khẩu"
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/[0.03]"
            required
          />

          <Button 
            type="submit" 
            className="w-full h-14 text-lg" 
            glow 
            loading={loading}
          >
            Đăng Nhập <Sparkles size={18} />
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Chưa có tài khoản?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-bold transition-all">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] -z-10" />

      <Suspense fallback={
        <div className="w-full max-w-md p-10 glass-card animate-pulse">
          <div className="h-20 bg-white/5 rounded-3xl mb-10" />
          <div className="h-10 bg-white/5 rounded-xl mb-6 w-1/2" />
          <div className="h-14 bg-white/5 rounded-2xl mb-12" />
          <div className="h-14 bg-white/5 rounded-2xl mb-12" />
          <div className="h-14 bg-white/5 rounded-2xl" />
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}
