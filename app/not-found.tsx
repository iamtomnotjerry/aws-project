import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center text-slate-500 mb-8 overflow-hidden relative">
         <span className="text-4xl font-black italic opacity-50 absolute">404</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic mb-4">Mảnh ghép mất tích.</h1>
      <p className="text-slate-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto px-6 min-h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold focus:ring-2 focus:ring-primary focus:outline-none">
            <ArrowLeft size={18} /> Quay lại
          </Button>
        </Link>
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="primary" glow className="w-full sm:w-auto px-6 min-h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold focus:ring-2 focus:ring-primary focus:outline-none">
            <Home size={18} /> Trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
