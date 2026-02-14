import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = ({ className, glass = true, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl overflow-hidden transition-all",
        glass && "glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
