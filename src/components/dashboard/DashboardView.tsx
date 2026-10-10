"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OutdoorMission } from "@/types";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Compass,
  Smartphone,
  Sparkles,
  Trophy,
  BookOpen,
  Search,
  Flower2,
  Clock,
  Trees,
  CheckCircle2,
  ArrowRight,
  Sun,
  Shield,
  Feather,
  Sprout,
  Heart,
} from "lucide-react";
import { NATURE_DATABASE } from "@/lib/ai/nature-db";

interface DashboardViewProps {
  onLaunchPocketMode: (mission: OutdoorMission) => void;
}

export function DashboardView({ onLaunchPocketMode }: DashboardViewProps) {
  const prefs = useLiveQuery(async () => {
    return await db.userPreferences.get("default");
  }, []);

  const missions = useLiveQuery(async () => {
    return await db.missions.toArray();
  }, []);

  const observations = useLiveQuery(async () => {
    return await db.observations.toArray();
  }, []);

  const challenges = useLiveQuery(async () => {
    return await db.challenges.toArray();
  }, []);

  // Featured Daily Outdoor Mission
  const activeMission = (missions || []).find((m) => !m.completed) || missions?.[0];

  const totalXp = prefs?.totalXp ?? 180;
  const totalMins = prefs?.totalOutdoorMinutes ?? 45;
  const targetMins = prefs?.screenFreeGoalMinsPerWeek ?? 120;
  const progressPercent = Math.min(Math.round((totalMins / targetMins) * 100), 100);

  const seasonalSpotlights = NATURE_DATABASE.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Hero / Mission Card */}
      <div className="rounded-3xl bg-gradient-to-br from-forest via-forest-light to-[#14271c] p-6 sm:p-8 text-white shadow-nature-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>Today's Outdoor Mission</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
            {activeMission?.title || "The 20-Minute Sensory Nature Immersion"}
          </h1>

          <p className="text-xs sm:text-sm text-nature-200/90 leading-relaxed">
            {activeMission?.summary || "Put your phone in your pocket, breathe in the fresh air, and tune your five senses to the living world."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeMission && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => onLaunchPocketMode(activeMission)}
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl shadow-lg flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Launch Pocket Mode ({activeMission.durationMinutes}m)</span>
              </Button>
            )}

            <Link href="/adventure">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl"
              >
                Custom Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress & Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Screen-Free Goal */}
        <Card className="p-5 border-nature-200 dark:border-nature-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-nature-600 dark:text-nature-400">
              Screen-Free Time
            </span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif font-bold text-2xl text-forest dark:text-nature-100">
            {totalMins} <span className="text-xs font-sans font-normal text-nature-500">/ {targetMins}m goal</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
          <p className="text-[11px] text-nature-500">
            {progressPercent}% of weekly outdoor goal
          </p>
        </Card>

        {/* Total XP & Rank */}
        <Card className="p-5 border-nature-200 dark:border-nature-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-nature-600 dark:text-nature-400">
              Explorer Rank
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-serif font-bold text-2xl text-forest dark:text-nature-100">
            {totalXp} <span className="text-xs font-sans font-normal text-nature-500">XP</span>
          </div>
          <Badge variant="amber" className="text-[10px]">
            {prefs?.experienceLevel || "Curious Beginner"}
          </Badge>
          <p className="text-[11px] text-nature-500">Real-world discoveries</p>
        </Card>

        {/* Documented Species */}
        <Card className="p-5 border-nature-200 dark:border-nature-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-nature-600 dark:text-nature-400">
              Field Journal
            </span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-serif font-bold text-2xl text-forest dark:text-nature-100">
            {observations?.length || 0}
          </div>
          <p className="text-[11px] text-nature-500">Documented observations</p>
          <Link href="/journal" className="text-[11px] text-forest-light font-bold hover:underline flex items-center gap-1">
            <span>View Journal</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>

        {/* Challenges Completed */}
        <Card className="p-5 border-nature-200 dark:border-nature-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-nature-600 dark:text-nature-400">
              Touch Grass Badges
            </span>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif font-bold text-2xl text-forest dark:text-nature-100">
            {(challenges || []).filter((c) => c.completed).length} <span className="text-xs font-sans font-normal text-nature-500">/ {challenges?.length || 8}</span>
          </div>
          <p className="text-[11px] text-nature-500">Completed missions</p>
          <Link href="/challenges" className="text-[11px] text-forest-light font-bold hover:underline flex items-center gap-1">
            <span>View Badges</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      {/* Quick Launch Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/identify" className="group">
          <Card className="p-5 border-nature-200 dark:border-nature-800 h-full flex flex-col justify-between group-hover:border-forest-light transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-forest/10 dark:bg-nature-800 text-forest-light dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-forest dark:text-nature-100">
                Identify Bird or Plant
              </h4>
              <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
                Take a photo or answer guided morphology questions to recognize wildlife.
              </p>
            </div>
            <span className="text-xs font-semibold text-forest-light dark:text-emerald-400 flex items-center gap-1 pt-3">
              <span>Start Identification</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Card>
        </Link>

        <Link href="/garden" className="group">
          <Card className="p-5 border-nature-200 dark:border-nature-800 h-full flex flex-col justify-between group-hover:border-forest-light transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flower2 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-forest dark:text-nature-100">
                AI Garden Planner
              </h4>
              <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
                Plan balcony pots or garden beds with native pollinator companions and care calendars.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 pt-3">
              <span>Manage Garden</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Card>
        </Link>

        <Link href="/ai" className="group">
          <Card className="p-5 border-nature-200 dark:border-nature-800 h-full flex flex-col justify-between group-hover:border-forest-light transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-forest dark:text-nature-100">
                Nature AI Assistant
              </h4>
              <p className="text-xs text-nature-600 dark:text-nature-400 leading-relaxed">
                Ask questions about tracks, ecosystems, dawn chorus timings, and trail etiquette.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-1 pt-3">
              <span>Open Field Chat</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Card>
        </Link>
      </div>

      {/* Seasonal Flora & Fauna Field Guide Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100 flex items-center gap-2">
            <span>What to Look For Outdoors Right Now</span>
            <Badge variant="forest">Field Guide</Badge>
          </h3>
          <span className="text-xs text-nature-600 dark:text-nature-400">
            Common local species
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {seasonalSpotlights.map((sp) => (
            <Card key={sp.id} className="p-5 border-nature-200 dark:border-nature-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="sage" className="capitalize text-[10px] mb-1">
                    {sp.category}
                  </Badge>
                  <h4 className="font-semibold text-base text-forest dark:text-nature-100">
                    {sp.commonName}
                  </h4>
                  <p className="text-xs italic text-nature-600 dark:text-nature-400">
                    {sp.scientificName}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-nature-700 dark:text-nature-300">
                <div className="font-semibold text-[11px] uppercase tracking-wider text-nature-500">
                  Key Field Mark:
                </div>
                <p className="line-clamp-2">
                  {sp.distinguishingFeatures[0]}
                </p>
              </div>

              <div className="text-[11px] text-nature-500 pt-2 border-t border-nature-100 dark:border-nature-900">
                Habitat: {sp.habitat}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
