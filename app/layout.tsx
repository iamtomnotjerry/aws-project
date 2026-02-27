import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/features/auth/components/AuthProvider";
import VerificationBanner from "@/features/auth/components/VerificationBanner";
import { CustomCursor } from "@/components/ui/CustomCursor";
import Header from "@/components/ui/Header";
import QueryProvider from "@/components/providers/QueryProvider";
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";
import { Newsletter } from "@/components/ui/Newsletter";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "Bản tin của Bảo | Nhật ký Cuộc sống & Trải nghiệm",
    template: "%s | Bao's Blog",
  },
  description: "Nơi Bảo chia sẻ về cuộc sống, học tập, công việc, thể thao, gia đình và những khoảnh khắc đáng nhớ.",
  keywords: ["Nhật ký", "Cuộc sống", "Trải nghiệm", "Bao's Blog", "Blog cá nhân", "Chia sẻ", "Đời sống"],
  authors: [{ name: "Bao Nguyen" }],
  creator: "Bao Nguyen",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://studymate.io.vn"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXTAUTH_URL || "https://studymate.io.vn",
    siteName: "Bao's Blog",
    title: "Bản tin của Bảo | Nhật ký Cuộc sống & Trải nghiệm",
    description: "Nơi Bảo chia sẻ về cuộc sống, học tập, công việc, thể thao, gia đình và những khoảnh khắc đáng nhớ.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Bao's Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bản tin của Bảo | Nhật ký Cuộc sống & Trải nghiệm",
    description: "Nơi Bảo chia sẻ về cuộc sống, học tập, công việc, thể thao, gia đình và những khoảnh khắc đáng nhớ.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
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
        <QueryProvider>
          <AuthProvider>
            <Toaster position="bottom-right" richColors />
            <div className="min-h-screen flex flex-col">
              <Header />

            <VerificationBanner />

            <main className="flex-grow pt-18 md:pt-22">
              {children}
            </main>

            {/* Asymmetrical Infinity Footer */}
            <footer className="relative py-16 md:py-48 px-4 md:px-6 border-t border-white/[0.05] mt-32 md:mt-64 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 relative z-10">
                <div className="md:col-span-6">
                  <Link href="/" className="group inline-flex items-center gap-3 mb-8 md:mb-12">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-all duration-500">
                      B
                    </div>
                    <span className="text-2xl md:text-3xl font-black tracking-tightest leading-none text-white italic">
                      BAO<span className="text-primary not-italic">.DEV</span>
                    </span>
                  </Link>
                  <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md italic">
                    "Sống trọn vẹn từng khoảnh khắc. <br /> Lưu giữ những kỷ niệm đẹp đẽ của tuổi trẻ."
                  </p>
                </div>

                <div className="md:col-span-3">
                  <Newsletter />
                </div>
              </div>

              <div className="max-w-7xl mx-auto mt-16 md:mt-32 pt-8 md:pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                <p className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">
                  © 2026 Bảo.Nguyễn — Góc nhỏ lưu giữ thanh xuân.
                </p>
                <div className="flex gap-6 md:gap-10">
                  <span className="text-slate-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Saigon</span>
                  <span className="text-slate-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Live & Love</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
        </QueryProvider>
        
      </body>
    </html>
  );
}
