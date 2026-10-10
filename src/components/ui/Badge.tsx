import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "forest" | "sage" | "amber" | "sky" | "rose" | "neutral";
}

export function Badge({
  className,
  variant = "sage",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    forest: "bg-forest/10 text-forest border-forest/20 dark:bg-nature-800/60 dark:text-nature-200",
    sage: "bg-nature-100 text-nature-800 border-nature-200 dark:bg-nature-900 dark:text-nature-300",
    amber: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
    sky: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300",
    rose: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300",
    neutral: "bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-900 dark:text-stone-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
