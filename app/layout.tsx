import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";
import AuthButton from "@/components/AuthButton";
import VerificationBanner from "@/components/VerificationBanner";
import { CustomCursor } from "@/components/ui/CustomCursor";

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
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                    B
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                    BAO<span className="text-primary">.DEV</span>
                  </span>
                </Link>

                <div className="flex items-center gap-10">
                  <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-all duration-300 relative group">
                      Trang chủ
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <Link href="/about" className="text-sm font-semibold text-slate-400 hover:text-white transition-all duration-300 relative group">
                      Giới thiệu
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
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

            {/* Footer Chuyên nghiệp */}
            <footer className="py-24 border-t border-white/[0.05] mt-24">
              <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <div className="mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <span className="text-xl font-bold tracking-widest uppercase">Bao's World</span>
                </div>
                <p className="text-slate-500 text-sm max-w-md text-center leading-relaxed">
                  © 2026 Bao.Dev. Mọi quyền được bảo lưu. <br />
                  Được thiết kế với đam mê và xây dựng trên nền tảng Next.js & AWS.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
