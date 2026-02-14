"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid motion
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") || 
        target.closest(".interactive");
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-primary/30 blur-sm mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 2.5 : 1,
        }}
        animate={{
          backgroundColor: isHovered ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.2)",
          opacity: 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 rounded-full border border-primary/20 scale-110" />
      </motion.div>
      
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
};
