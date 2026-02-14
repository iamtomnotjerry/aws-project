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
    <motion.div whileHover={{ y: -5 }}>
      <Card className="p-8 h-full">
        <div className="mb-4 p-3 bg-blue-500/10 rounded-2xl inline-block">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
};
