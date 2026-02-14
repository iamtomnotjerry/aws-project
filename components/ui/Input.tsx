import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    const inputId = React.useId();
    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={props.id || inputId} 
            className="block text-sm font-medium text-gray-400 ml-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={props.id || inputId}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
