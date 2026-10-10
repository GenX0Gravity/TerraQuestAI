import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200"
          >
            {label}
          </label>
        )}
        <input
          id={generatedId}
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-nature-200 dark:border-nature-800 bg-white/80 dark:bg-nature-900/60 px-3.5 py-2.5 text-sm text-nature-950 dark:text-nature-50 placeholder:text-nature-400 focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-600 transition-all",
            error && "border-rose-500 focus:ring-rose-500/50",
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-nature-600 dark:text-nature-400">{helperText}</p>
        )}
        {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
