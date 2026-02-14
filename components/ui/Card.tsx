import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = ({ className, glass = true, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl overflow-hidden transition-all duration-300",
        glass && "glass-card",
        !glass && "bg-slate-900/50 border border-white/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
