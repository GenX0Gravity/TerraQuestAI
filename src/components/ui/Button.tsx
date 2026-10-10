import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-forest-light hover:bg-forest text-white shadow-nature hover:shadow-nature-lg focus:ring-nature-600",
      secondary:
        "bg-nature-100 hover:bg-nature-200 text-nature-900 border border-nature-200 focus:ring-nature-400",
      outline:
        "bg-transparent hover:bg-nature-50 text-forest border border-nature-300 focus:ring-nature-500",
      ghost:
        "bg-transparent hover:bg-nature-100 text-nature-800 focus:ring-nature-400",
      accent:
        "bg-amber-600 hover:bg-amber-700 text-white shadow-sm focus:ring-amber-500",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
      icon: "p-2.5 rounded-xl aspect-square",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
