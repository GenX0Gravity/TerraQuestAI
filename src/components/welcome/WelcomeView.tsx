"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Smartphone,
  ShieldCheck,
  Cpu,
  Trophy,
  Search,
  BookOpen,
  Flower2,
  Trees,
  CheckCircle2,
  ArrowRight,
  Heart,
  Leaf,
  WifiOff,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface WelcomeViewProps {
  onOpenPocketMode: () => void;
}

export function WelcomeView({ onOpenPocketMode }: WelcomeViewProps) {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#183123] via-[#1f3b2b] to-[#122419] text-white p-8 sm:p-14 shadow-nature-lg overflow-hidden text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Built for the "Touch Grass" Open-Source AI Challenge</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.15]">
            Touch Grass, <br />
            <span className="text-emerald-300 italic font-normal">Not Screens.</span>
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed font-sans max-w-2xl mx-auto">
            TerraQuest AI is your offline AI companion for the real world. We believe AI should prepare you for real-world adventures, guide your curiosity, and then encourage you to put your phone away.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-8 py-4 rounded-2xl shadow-xl flex items-center gap-2.5"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenPocketMode}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-6 py-4 rounded-2xl flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Launch Pocket Mode</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-emerald-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Private & Local
            </span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-emerald-400" />
              Works Completely Offline
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Open-Weight Models (Ollama)
            </span>
          </div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="space-y-2">
          <Badge variant="forest">Core Philosophy</Badge>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest dark:text-nature-100">
            Why We Built TerraQuest AI
          </h2>
          <p className="text-xs sm:text-sm text-nature-600 dark:text-nature-400 max-w-2xl mx-auto leading-relaxed">
            Most modern apps measure success by time on screen. TerraQuest AI measures success by time spent outside with your phone in your pocket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
          <Card className="p-6 space-y-3 border-nature-200 dark:border-nature-800">
            <div className="w-10 h-10 rounded-2xl bg-forest/10 dark:bg-nature-800 text-forest-light dark:text-emerald-300 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif font-bold text-base text-forest dark:text-nature-100">
              Prepare & Disconnect
            </h3>
            <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
              Use local AI to generate a focused 20-minute mission, pack your gear, and enter Pocket Mode. The screen goes quiet so you can observe the canopy.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-nature-200 dark:border-nature-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif font-bold text-base text-forest dark:text-nature-100">
              Explore in the Real World
            </h3>
            <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
              Step outside. Listen for the American Robin caroling at dawn, trace the leaf veins of a White Oak, or check on balcony pollinator sprouts.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-nature-200 dark:border-nature-800">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif font-bold text-base text-forest dark:text-nature-100">
              Return & Reflect
            </h3>
            <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
              When you return, record what you noticed. The local AI creates a mindful debrief, awards Touch Grass XP, and saves the observation privately.
            </p>
          </Card>
        </div>
      </section>

      {/* Feature Catalog Grid */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="sage">Complete Nature Toolkit</Badge>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest dark:text-nature-100">
            Designed for Curious Naturalists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              href: "/ai",
              icon: Trees,
              title: "Nature AI Field Assistant",
              desc: "Ask questions about trees, birds, insects, and trail safety with local open-weight model status.",
            },
            {
              href: "/identify",
              icon: Search,
              title: "Bird & Plant Identification",
              desc: "Photo capture or guided morphology questions with honest confidence, safety warnings, and acoustic bird-call interface.",
            },
            {
              href: "/adventure",
              icon: Compass,
              title: "Adventure Planner & Maps",
              desc: "Generate realistic hiking or stroll plans with checkpoints, gear checklists, and OpenStreetMap views.",
            },
            {
              href: "/challenges",
              icon: Trophy,
              title: "Touch Grass Challenges",
              desc: "Gamified milestones that reward screen-free outdoor exploration and grant naturalist badges.",
            },
            {
              href: "/garden",
              icon: Flower2,
              title: "AI Garden Planner",
              desc: "Microclimate planning for balconies and backyards with companion planting and four-season care calendars.",
            },
            {
              href: "/journal",
              icon: BookOpen,
              title: "Private Nature Journal",
              desc: "100% offline observation records with photos, notes, search filters, and CSV/JSON backup.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} href={item.href} className="group">
                <Card className="p-6 h-full flex flex-col justify-between border-nature-200 dark:border-nature-800 group-hover:border-forest-light transition-all">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-forest/10 dark:bg-nature-800 text-forest-light dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-forest dark:text-nature-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-forest-light dark:text-emerald-400 flex items-center gap-1 pt-4">
                    <span>Open Feature</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Open-Source Architecture Highlights */}
      <section className="max-w-4xl mx-auto rounded-3xl bg-nature-100/70 dark:bg-nature-900/40 border border-nature-200 dark:border-nature-800 p-8 space-y-6">
        <div className="space-y-2">
          <Badge variant="forest">Open Source AI Differentiation</Badge>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest dark:text-nature-100">
            Why Open Innovation is Essential
          </h2>
          <p className="text-xs sm:text-sm text-nature-700 dark:text-nature-300 leading-relaxed">
            Nature observations are deeply personal. Private journals and location data should never be harvested to train commercial ad models.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-nature-800 dark:text-nature-200">
          <div className="p-4 rounded-2xl bg-white dark:bg-nature-950 border border-nature-200 dark:border-nature-800 space-y-1.5">
            <div className="font-bold text-forest dark:text-emerald-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Pluggable Local Model Provider</span>
            </div>
            <p className="text-nature-600 dark:text-nature-400 leading-relaxed">
              Switch seamlessly between Qwen 2.5, Gemma 2, Llama 3.2, LLaVA, or the local taxonomy engine without rewriting application code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-nature-950 border border-nature-200 dark:border-nature-800 space-y-1.5">
            <div className="font-bold text-forest dark:text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Operating Costs & Cloud Lock-in</span>
            </div>
            <p className="text-nature-600 dark:text-nature-400 leading-relaxed">
              No subscription or per-token API charges. Once models are installed locally, inference is free, unlimited, and forever yours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-nature-950 border border-nature-200 dark:border-nature-800 space-y-1.5">
            <div className="font-bold text-forest dark:text-emerald-400 flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span>Resilient in the Backcountry</span>
            </div>
            <p className="text-nature-600 dark:text-nature-400 leading-relaxed">
              Nature trails often lack cellular coverage. Our IndexedDB persistence and offline heuristics work in dense forests and mountain ravines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-nature-950 border border-nature-200 dark:border-nature-800 space-y-1.5">
            <div className="font-bold text-forest dark:text-emerald-400 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>Auditable & Community-Driven</span>
            </div>
            <p className="text-nature-600 dark:text-nature-400 leading-relaxed">
              Full transparency on safety recommendations. Open taxonomy rules ensure accurate warnings for toxic plants like poison ivy and hogweed.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="text-center space-y-4 py-6">
        <h3 className="font-serif font-bold text-2xl text-forest dark:text-nature-100">
          Ready to Step Outside?
        </h3>
        <p className="text-xs sm:text-sm text-nature-600 dark:text-nature-400 max-w-md mx-auto">
          Start your first 20-minute sensory loop today and experience the calm of the living world.
        </p>
        <Link href="/dashboard">
          <Button
            variant="primary"
            size="lg"
            className="bg-forest hover:bg-forest-dark text-white rounded-2xl px-8 shadow-nature-lg"
          >
            Open Dashboard
          </Button>
        </Link>
      </section>
    </div>
  );
}
