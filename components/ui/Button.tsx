import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, glow, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 premium-glow",
      secondary: "glass-morphism text-white hover:bg-white/10 active:bg-white/5",
      ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 rounded-xl",
      lg: "px-8 py-4 text-lg rounded-2xl font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary/40",
          variants[variant],
          sizes[size],
          glow && "premium-glow shadow-[0_0_20px_rgba(59,130,246,0.4)]",
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
