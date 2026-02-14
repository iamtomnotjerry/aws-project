"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#020617] -z-20" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-10 border-white/10 bg-black/40 backdrop-blur-xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-8 border border-green-500/30">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-white">Email Verified!</h1>
          <p className="text-gray-400 mb-10 text-lg">
            Your account is now fully activated. You can now write stories and manage your profile.
          </p>

          <Link href="/auth/signin">
            <Button className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg" glow>
              Sign In Now <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
