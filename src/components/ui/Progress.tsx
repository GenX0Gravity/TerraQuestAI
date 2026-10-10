import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  indicatorClassName?: string;
}

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-nature-100 dark:bg-nature-900 border border-nature-200/60 dark:border-nature-800",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full bg-gradient-to-r from-nature-600 to-forest-light transition-all duration-300 ease-out rounded-full",
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
