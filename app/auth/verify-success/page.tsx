"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#020617]">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle2 size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-white">Xác thực Email Thành công</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ để tiếp tục.
        </p>

        <Link href="/auth/signin">
          <Button className="w-full h-12 text-sm font-bold bg-white text-black hover:bg-slate-200 border-0 rounded-lg">
            ĐẾN TRANG ĐĂNG NHẬP <ArrowRight className="ml-2" size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
