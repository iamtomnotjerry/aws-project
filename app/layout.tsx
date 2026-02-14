import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CloudDev Blog | AWS & Next.js Architecture",
  description: "A professional engineering blog documenting AWS EC2, S3, and standard Cloud architectures.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Toaster position="top-center" richColors />
        <nav className="fixed top-0 w-full z-50 glass py-4 px-6">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-gradient">CloudDev</div>
            <div className="flex gap-6 text-sm font-medium items-center">
              <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
              <Link href="/new-post" className="px-5 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-all font-semibold">
                Create Post
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="py-20 text-center text-gray-600 border-t border-white/5 mt-20">
          <p>© 2026 CloudDev Solutions. Deployed on AWS Infrastructure.</p>
        </footer>
      </body>
    </html>
  );
}
