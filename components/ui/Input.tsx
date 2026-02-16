import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps & { startIcon?: React.ReactNode }>(
  ({ className, label, error, startIcon, ...props }, ref) => {
    const inputId = React.useId();
    return (
      <div className="w-full space-y-2.5">
        {label && (
          <label 
            htmlFor={props.id || inputId} 
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {startIcon && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={props.id || inputId}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-slate-600 text-slate-100",
              startIcon && "pl-14",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 font-medium ml-2 animate-in fade-in slide-in-from-top-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
