"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Smartphone, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onOpenPocketMode: () => void;
}

export function MobileNav({ onOpenPocketMode }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/identify", label: "Identify", icon: Search },
    { href: "/challenges", label: "Challenges", icon: Trophy },
    { href: "/journal", label: "Journal", icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-nature-950/90 backdrop-blur-lg border-t border-nature-200 dark:border-nature-800 px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors",
                isActive
                  ? "text-forest-light dark:text-emerald-400 font-bold"
                  : "text-nature-600 dark:text-nature-400 hover:text-nature-900"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Center Floating Action: Pocket Mode */}
        <div className="relative -top-5">
          <button
            onClick={onOpenPocketMode}
            className="w-13 h-13 p-3 rounded-full bg-forest dark:bg-nature-700 text-white shadow-nature-lg border-4 border-white dark:border-nature-950 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            title="Pocket Mode (Disconnect)"
            aria-label="Pocket Mode"
          >
            <Smartphone className="w-5 h-5 text-emerald-300" />
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors",
                isActive
                  ? "text-forest-light dark:text-emerald-400 font-bold"
                  : "text-nature-600 dark:text-nature-400 hover:text-nature-900"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
