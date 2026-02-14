import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bao's Blog | Tech, Life & Journey",
  description: "Sharing stories about Technology, Lifestyle, and Personal Growth.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

import AuthProvider from "@/components/AuthProvider";
import AuthButton from "@/components/AuthButton";
import VerificationBanner from "@/components/VerificationBanner";

// ... metadata ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#020617] text-gray-100 antialiased`}>
        <AuthProvider>
          <Toaster position="bottom-right" richColors />
          <div className="relative min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
              <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold italic tracking-tighter hover:text-blue-400 transition-colors">
                  BAO'S BLOG
                </Link>

                <div className="flex items-center gap-8">
                  <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
                    <Link href="/about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</Link>
                  </div>
                  <AuthButton />
                </div>
              </nav>
            </header>

            <VerificationBanner />

            <main className="flex-grow pt-20">
              {children}
            </main>
            <footer className="py-20 text-center text-gray-600 border-t border-white/5 mt-20">
              <p>© 2026 Bao's Blog. Built with Passion & Next.js.</p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
