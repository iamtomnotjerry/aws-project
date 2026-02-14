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

// ... metadata ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          <nav className="fixed top-0 w-full z-50 glass py-4 px-6">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity">
                Bao's Blog
              </Link>
              <div className="flex gap-6 text-sm font-medium items-center">
                <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                <AuthButton />
              </div>
            </div>
          </nav>
          {children}
          <footer className="py-20 text-center text-gray-600 border-t border-white/5 mt-20">
            <p>© 2026 Bao's Blog. Built with Passion & Next.js.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
