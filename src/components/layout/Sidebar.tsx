"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Bot,
  Search,
  MapPin,
  Trophy,
  Flower2,
  BookOpen,
  Settings,
  Sparkles,
  Shield,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenPocketMode: () => void;
}

export function Sidebar({ onOpenPocketMode }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ai", label: "Nature AI", icon: Bot, badge: "Offline" },
    { href: "/identify", label: "Identify", icon: Search },
    { href: "/adventure", label: "Adventure Planner", icon: MapPin },
    { href: "/challenges", label: "Challenges", icon: Trophy, badge: "XP" },
    { href: "/garden", label: "Garden Planner", icon: Flower2 },
    { href: "/journal", label: "Nature Journal", icon: BookOpen },
    { href: "/settings", label: "Settings & AI", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-nature-200/80 dark:border-nature-800/80 bg-white/70 dark:bg-nature-950/70 backdrop-blur-md p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-2",
            pathname === "/"
              ? "bg-nature-100 dark:bg-nature-900 text-forest dark:text-nature-100 font-semibold"
              : "text-nature-700 dark:text-nature-300 hover:bg-nature-50 dark:hover:bg-nature-900/40"
          )}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Welcome & Vision</span>
        </Link>

        <div className="h-px bg-nature-200/60 dark:border-nature-800 my-2" />

        <div className="text-[11px] font-bold uppercase tracking-wider text-nature-500 px-3 py-1">
          Field Companion
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-forest-light text-white shadow-nature font-semibold"
                  : "text-nature-800 dark:text-nature-200 hover:bg-nature-100/80 dark:hover:bg-nature-900/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-nature-600 dark:text-nature-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-nature-100 dark:bg-nature-900 text-nature-700 dark:text-nature-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Pocket Mode Card */}
      <div className="mt-auto pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-forest to-forest-dark p-4 text-white shadow-nature-lg relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full blur-xl" />
          <div className="flex items-center gap-2 mb-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <Smartphone className="w-4 h-4" />
            Signature Feature
          </div>
          <h4 className="font-serif font-bold text-sm mb-1">Explore, Then Disconnect</h4>
          <p className="text-xs text-nature-200/90 mb-3 leading-relaxed">
            Lock your phone, step into nature, and record discoveries upon return.
          </p>
          <button
            onClick={onOpenPocketMode}
            className="w-full py-2 px-3 rounded-xl bg-white text-forest font-semibold text-xs hover:bg-nature-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            Launch Pocket Mode
          </button>
        </div>

        {/* Local & Private guarantee */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-nature-500 text-center">
          <Shield className="w-3.5 h-3.5 text-nature-600" />
          <span>100% Private • Stored on Device</span>
        </div>
      </div>
    </aside>
  );
}
