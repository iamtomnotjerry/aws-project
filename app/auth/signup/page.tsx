"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { UserPlus, ArrowLeft, Mail, User, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
        throw new Error(data.error || data.message || "Đăng ký thất bại");
      }

      toast.success("Khởi tạo đăng ký thành công! Vui lòng kiểm tra email để xác thực và hoàn tất.");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to sign-in with a success message
      setTimeout(() => {
        router.push("/auth/signin?success=VerifyEmail");
      }, 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đăng ký thất bại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] -z-10" />

      <Card className="w-full max-w-md p-10 md:p-14 glass-card relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-10 rotate-12 text-primary">
          <UserPlus size={150} />
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
              <UserPlus className="text-primary" size={40} />
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight">Tạo Tài Khoản</h1>
            <p className="text-slate-500 font-medium">Tham gia cộng đồng Bao.Dev ngay hôm nay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input 
              label="Họ và Tên"
              type="text" 
              placeholder="Nguyễn Văn A" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-white/[0.03]"
              required
            />

            <Input 
              label="Địa chỉ Email"
              type="email" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-white/[0.03]"
              required
            />

            <Input 
              label="Mật khẩu"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="bg-white/[0.03]"
              required
            />

            <Button 
              type="submit" 
              className="w-full h-14 text-lg" 
              glow 
              loading={loading}
            >
              Đăng Ký Tài Khoản <Sparkles size={18} />
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Đã có tài khoản?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline font-bold transition-all">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
