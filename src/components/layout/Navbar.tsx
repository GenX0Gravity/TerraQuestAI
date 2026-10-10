"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Smartphone, Menu, X, ShieldCheck, WifiOff, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { getAIProvider } from "@/lib/ai/provider";
import { AIProviderStatus } from "@/lib/ai/types";

interface NavbarProps {
  onOpenPocketMode: () => void;
}

export function Navbar({ onOpenPocketMode }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIProviderStatus | null>(null);

  const prefs = useLiveQuery(async () => {
    return await db.userPreferences.get("default");
  }, []);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const provider = await getAIProvider();
        const status = await provider.checkHealth();
        if (mounted) setAiStatus(status);
      } catch {
        if (mounted) {
          setAiStatus({
            status: "fallback",
            providerName: "Local Field Guide",
            activeModel: "Offline Heuristics",
            availableModels: [],
          });
        }
      }
    }
    check();
    const interval = setInterval(check, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [prefs?.aiProvider, prefs?.ollamaBaseUrl, prefs?.selectedModel]);

  const totalXp = prefs?.totalXp ?? 180;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-nature-200/80 dark:border-nature-800/80 bg-white/80 dark:bg-nature-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg md:text-xl text-forest dark:text-nature-50 tracking-tight group"
          >
            <div className="w-9 h-9 rounded-xl bg-forest-light dark:bg-nature-700 flex items-center justify-center text-white shadow-nature group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight flex items-center gap-1.5 font-serif text-lg tracking-normal">
                TerraQuest <span className="text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-nature-100 dark:bg-nature-800 text-nature-700 dark:text-nature-300 font-sans font-semibold">AI</span>
              </span>
              <span className="text-[10px] text-nature-600 dark:text-nature-400 font-normal">
                Touch Grass, Not Screens 🌿
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5">
          {/* AI Engine Status Pill */}
          <Link
            href="/settings"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-nature-200 dark:border-nature-800 bg-nature-50 dark:bg-nature-900/60 text-nature-800 dark:text-nature-200 hover:border-nature-400 transition-colors"
            title="Local AI Inference Status"
          >
            {aiStatus?.status === "online" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Cpu className="w-3.5 h-3.5 text-nature-600" />
                <span className="truncate max-w-[120px]">{aiStatus.activeModel}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline Engine</span>
              </>
            )}
          </Link>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{totalXp} XP</span>
          </div>

          {/* Signature Action: Pocket Mode */}
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenPocketMode}
            className="bg-forest dark:bg-nature-700 hover:bg-forest-dark text-white rounded-xl shadow-nature flex items-center gap-1.5"
            title="Switch to screen-free exploration mode"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden xs:inline font-medium">Pocket Mode</span>
          </Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-nature-700 hover:bg-nature-100 dark:hover:bg-nature-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-nature-200 dark:border-nature-800 bg-white/95 dark:bg-nature-950/95 backdrop-blur-md px-4 py-4 space-y-2">
          {[
            { href: "/", label: "Welcome & Vision" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/ai", label: "Nature AI Assistant" },
            { href: "/identify", label: "Bird & Plant Identification" },
            { href: "/adventure", label: "Adventure Planner" },
            { href: "/challenges", label: "Touch Grass Challenges" },
            { href: "/garden", label: "AI Garden Planner" },
            { href: "/journal", label: "Private Nature Journal" },
            { href: "/settings", label: "Model Settings & Privacy" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-forest-light text-white font-semibold"
                  : "text-nature-800 dark:text-nature-200 hover:bg-nature-100 dark:hover:bg-nature-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
