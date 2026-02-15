import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";
import AuthButton from "@/components/AuthButton";
import VerificationBanner from "@/components/VerificationBanner";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Magnetic } from "@/components/ui/Magnetic";
import { motion } from "framer-motion"; // Added this line as per instruction

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Bao's Blog | Chia sẻ Kiến thức & Hành trình Công nghệ",
  description: "Nơi mình chia sẻ về Cloud Computing, DevOps và những trải nghiệm thực tế trong ngành công nghệ.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased selection:bg-primary/30`}>
        <CustomCursor />
        <AuthProvider>
          <Toaster position="bottom-right" richColors />
          <div className="relative min-h-screen flex flex-col">
            {/* Header Duy nhất và Nhất quán */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-background/60 backdrop-blur-xl">
              <nav className="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2">
                  
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                    BẢO<span className="text-primary">.NGUYỄN</span>
                  </span>
                </Link>

                <div className="flex items-center gap-10">
                  <div className="hidden md:flex items-center gap-10">
                    <Magnetic strength={0.2}>
                      <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-300 relative group py-2">
                        Trang chủ
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                      <Link href="/posts" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-300 relative group py-2">
                        Bài viết
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                      <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-300 relative group py-2">
                        Giới thiệu
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </Magnetic>
                  </div>
                  <div className="h-6 w-px bg-white/10 hidden md:block" />
                  <AuthButton />
                </div>
              </nav>
            </header>

            <VerificationBanner />

            <main className="flex-grow pt-22">
              {children}
            </main>

            {/* Asymmetrical Infinity Footer */}
            <footer className="relative py-48 px-6 border-t border-white/[0.05] mt-64 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-24 relative z-10">
                <div className="md:col-span-6">
                  <Link href="/" className="group inline-flex items-center gap-3 mb-12">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-all duration-500">
                      B
                    </div>
                    <span className="text-3xl font-black tracking-tightest leading-none text-white italic">
                      BAO<span className="text-primary not-italic">.DEV</span>
                    </span>
                  </Link>
                  <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md italic">
                    "Kiến tạo giá trị từ những dòng code. <br /> Hành trình chinh phục Cloud & DevOps."
                  </p>
                </div>

                <div className="md:col-span-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-primary">Liên kết nhanh</h4>
                  <ul className="space-y-6">
                    <li><Link href="/" className="text-slate-400 hover:text-white font-bold transition-colors">Bảng tin kiến thức</Link></li>
                    <li><Link href="/about" className="text-slate-400 hover:text-white font-bold transition-colors">Hành trình cá nhân</Link></li>
                    <li><Link href="/auth/signin" className="text-slate-400 hover:text-white font-bold transition-colors">Kết nối cộng đồng</Link></li>
                  </ul>
                </div>

                <div className="md:col-span-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-primary">Lan tỏa giá trị</h4>
                  <div className="flex gap-4">
                    <Magnetic strength={0.3}>
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-primary/20 hover:text-primary transition-all duration-500 cursor-pointer">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </div>
                    </Magnetic>
                    <Magnetic strength={0.3}>
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all duration-500 cursor-pointer">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 2.997-1.23 2.997-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </div>
                    </Magnetic>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  © 2026 Bảo.Nguyễn — All Space Dedicated to Code.
                </p>
                <div className="flex gap-10">
                  <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Designed in Saigon</span>
                  <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Built on AWS</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
