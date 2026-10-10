"use client";

import React from "react";
import { Challenge, Badge } from "@/types";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge as UiBadge } from "@/components/ui/Badge";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Feather,
  PhoneOff,
  Sprout,
  Compass,
  Leaf,
  Droplets,
  Footprints,
  Eye,
  Trees,
  Award,
} from "lucide-react";
import { playNatureChime } from "@/lib/utils";
import confetti from "canvas-confetti";

export function ChallengeList() {
  const challenges = useLiveQuery(async () => {
    return await db.challenges.toArray();
  }, []);

  const badges = useLiveQuery(async () => {
    return await db.badges.toArray();
  }, []);

  const prefs = useLiveQuery(async () => {
    return await db.userPreferences.get("default");
  }, []);

  const iconMap: Record<string, React.ElementType> = {
    Feather,
    SmartphoneOff: PhoneOff,
    PhoneOff,
    Sprout,
    Compass,
    Leaf,
    Droplets,
    Footprints,
    Eye,
    Trees,
    Sparkles,
  };

  const handleIncrement = async (challenge: Challenge) => {
    const newCount = challenge.currentCount + 1;
    const isNowCompleted = newCount >= challenge.targetCount;

    await db.challenges.update(challenge.id, {
      currentCount: newCount,
      completed: isNowCompleted,
      unlockedAt: isNowCompleted ? new Date().toISOString() : challenge.unlockedAt,
    });

    // If completed, award XP and unlock associated badge
    if (isNowCompleted && !challenge.completed) {
      playNatureChime("badge");
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#2d543e", "#7aa17a", "#d88939"],
        });
      } catch {}

      if (prefs) {
        await db.userPreferences.update("default", {
          totalXp: (prefs.totalXp || 0) + challenge.xp,
        });
      }

      // Check if badge needs unlocking
      if (challenge.badgeCode) {
        const badge = await db.badges.where("code").equals(challenge.badgeCode).first();
        if (badge && !badge.unlocked) {
          await db.badges.update(badge.id, {
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          });
        }
      }
    } else {
      playNatureChime("click");
    }
  };

  const completedCount = (challenges || []).filter((c) => c.completed).length;
  const totalCount = (challenges || []).length;
  const unlockedBadgesCount = (badges || []).filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest to-forest-light p-6 sm:p-8 text-white shadow-nature-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <Trophy className="w-4 h-4" />
            <span>Screen-Free Outdoor Milestones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Touch Grass Challenges 🌿
          </h2>
          <p className="text-xs sm:text-sm text-nature-200/90 leading-relaxed">
            Real rewards for real outdoor curiosity. Level up by exploring bird habitats, noticing leaf morphologies, and leaving digital feeds behind.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{completedCount} of {totalCount} Completed</span>
            </div>
            <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{unlockedBadgesCount} Naturalist Badges Earned</span>
            </div>
            <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{prefs?.totalXp ?? 180} Lifetime XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
            Active Outdoor Missions
          </h3>
          <span className="text-xs text-nature-600 dark:text-nature-400">
            Progress saved locally on this device
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges?.map((chal) => {
            const Icon = iconMap[chal.iconName] || Trophy;
            const progress = (chal.currentCount / chal.targetCount) * 100;

            return (
              <Card
                key={chal.id}
                className={`p-5 transition-all ${
                  chal.completed
                    ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : "border-nature-200 dark:border-nature-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        chal.completed
                          ? "bg-emerald-600 text-white shadow-nature"
                          : "bg-nature-100 dark:bg-nature-800 text-forest dark:text-emerald-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-forest dark:text-nature-100">
                        {chal.title}
                      </h4>
                      <p className="text-xs text-nature-600 dark:text-nature-400 line-clamp-2">
                        {chal.description}
                      </p>
                    </div>
                  </div>

                  <UiBadge variant="amber">+{chal.xp} XP</UiBadge>
                </div>

                {/* Progress bar & Counter */}
                <div className="space-y-2 pt-2 border-t border-nature-100 dark:border-nature-900">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-nature-600 dark:text-nature-400">
                      Progress: {chal.currentCount} / {chal.targetCount}
                    </span>
                    {chal.completed ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="text-nature-500 font-medium">In Progress</span>
                    )}
                  </div>

                  <Progress value={progress} />

                  {!chal.completed && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleIncrement(chal)}
                        className="rounded-xl text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Field Check (+1)</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4 pt-4 border-t border-nature-200 dark:border-nature-800">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
            Naturalist Badges & Honors
          </h3>
          <span className="text-xs text-nature-600 dark:text-nature-400">
            Earned through screen-free observation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges?.map((badge) => {
            const Icon = iconMap[badge.iconName] || Award;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-2 ${
                  badge.unlocked
                    ? "bg-white dark:bg-nature-950 border-amber-300 dark:border-amber-700/60 shadow-nature"
                    : "bg-nature-50/50 dark:bg-nature-900/20 border-nature-200 dark:border-nature-800 opacity-50 grayscale"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    badge.unlocked
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 ring-2 ring-amber-300"
                      : "bg-stone-200 dark:bg-stone-800 text-stone-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h5 className="font-semibold text-xs text-forest dark:text-nature-100">
                  {badge.title}
                </h5>
                <p className="text-[11px] text-nature-600 dark:text-nature-400 leading-snug line-clamp-2">
                  {badge.description}
                </p>
                {badge.unlocked && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
