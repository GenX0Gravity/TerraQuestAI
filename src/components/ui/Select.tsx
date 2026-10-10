import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, id, ...props }, ref) => {
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
        <select
          id={generatedId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-nature-200 dark:border-nature-800 bg-white/80 dark:bg-nature-900/60 px-3.5 py-2.5 text-sm text-nature-950 dark:text-nature-50 focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-600 transition-all cursor-pointer",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-nature-900 text-nature-900 dark:text-nature-100">
              {opt.label}
            </option>
          ))}
        </select>
        {helperText && (
          <p className="text-xs text-nature-600 dark:text-nature-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
