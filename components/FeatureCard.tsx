import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="p-10 h-full glass-card group">
        <div className="mb-6 w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:text-white transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
      </Card>
    </motion.div>
  );
};
