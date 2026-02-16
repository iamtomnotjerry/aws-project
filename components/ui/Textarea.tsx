import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const textareaId = React.useId();
    return (
      <div className="w-full space-y-2.5">
        {label && (
           <label 
             htmlFor={props.id || textareaId} 
             className="block text-sm font-black text-slate-400 ml-1 uppercase tracking-widest"
           >
             {label}
           </label>
        )}
        <textarea
          ref={ref}
          id={props.id || textareaId}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-slate-600 text-slate-100 min-h-[200px] resize-none",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-medium ml-2 animate-in fade-in slide-in-from-top-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
