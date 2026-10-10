"use client";

import React, { useState } from "react";
import { OutdoorMission, Observation } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Sparkles, Trees, CheckCircle2, BookmarkPlus } from "lucide-react";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import { playNatureChime } from "@/lib/utils";
import confetti from "canvas-confetti";

interface ReturnReflectionModalProps {
  isOpen: boolean;
  mission: OutdoorMission | null;
  timeSpentMinutes: number;
  onClose: () => void;
  onSaved: () => void;
}

export function ReturnReflectionModal({
  isOpen,
  mission,
  timeSpentMinutes,
  onClose,
  onSaved,
}: ReturnReflectionModalProps) {
  const [speciesInput, setSpeciesInput] = useState<string>("");
  const [speciesTags, setSpeciesTags] = useState<string[]>([]);
  const [sensoryNotes, setSensoryNotes] = useState<string>("");
  const [calmnessRating, setCalmnessRating] = useState<number>(5);
  const [loadingReflection, setLoadingReflection] = useState<boolean>(false);
  const [generatedReflection, setGeneratedReflection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen || !mission) return null;

  const handleAddSpecies = () => {
    if (speciesInput.trim() && !speciesTags.includes(speciesInput.trim())) {
      setSpeciesTags([...speciesTags, speciesInput.trim()]);
      setSpeciesInput("");
    }
  };

  const handleGenerateReflection = async () => {
    setLoadingReflection(true);
    try {
      const provider = await getAIProvider();
      const reflection = await provider.generateReflection({
        missionTitle: mission.title,
        durationMinutes: timeSpentMinutes,
        observedSpecies: speciesTags,
        sensoryNotes: sensoryNotes || "Breathed fresh air and tuned into natural surroundings.",
        calmnessRating,
      });

      setGeneratedReflection(reflection);
    } catch (err) {
      console.warn("Reflection generation error:", err);
      setGeneratedReflection(
        `🌿 **Mindful Observation Saved!** You spent ${timeSpentMinutes} minutes offline observing nature. Regular screen-free immersion improves sensory acuity and mental well-being.`
      );
    } finally {
      setLoadingReflection(false);
    }
  };

  const handleSaveAndAward = async () => {
    try {
      // 1. Update Mission
      await db.missions.update(mission.id, {
        completed: true,
        completedAt: new Date().toISOString(),
        reflection: {
          observedSpecies: speciesTags,
          sensoryNotes,
          calmnessRating,
          reflectionNotes: generatedReflection || "",
        },
      });

      // 2. Add Observation to Journal if species or notes present
      const newObs: Observation = {
        id: `obs-${Date.now()}`,
        title: `${mission.title} Reflection`,
        speciesName: speciesTags[0] || "General Nature Exploration",
        category: "other",
        date: new Date().toISOString().split("T")[0],
        notes: sensoryNotes || "Completed screen-free outdoor exploration in Pocket Mode.",
        verified: true,
        tags: ["Pocket Mode", ...speciesTags],
        createdAt: Date.now(),
      };
      await db.observations.add(newObs);

      // 3. Award XP & Outdoor Minutes
      const prefs = await db.userPreferences.get("default");
      if (prefs) {
        const earnedXp = 50 + (speciesTags.length * 15);
        await db.userPreferences.update("default", {
          totalXp: (prefs.totalXp || 0) + earnedXp,
          totalOutdoorMinutes: (prefs.totalOutdoorMinutes || 0) + timeSpentMinutes,
          completedMissionsCount: (prefs.completedMissionsCount || 0) + 1,
        });

        // Trigger confetti!
        try {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#2d543e", "#7aa17a", "#d88939", "#8fa382"],
          });
        } catch {}
      }

      playNatureChime("complete");
      setSaveSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving return debrief:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back Inside 🍃" maxWidth="lg">
      <div className="space-y-5">
        {!saveSuccess ? (
          <>
            <div className="bg-nature-50 dark:bg-nature-900/50 p-4 rounded-2xl border border-nature-200 dark:border-nature-800 space-y-1">
              <h4 className="font-semibold text-sm text-forest dark:text-nature-100 flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>{mission.title}</span>
              </h4>
              <p className="text-xs text-nature-600 dark:text-nature-400">
                You disconnected for approximately <strong>{timeSpentMinutes} minutes</strong> in nature.
              </p>
            </div>

            {/* Species spotted */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Species or Wildlife Noticed (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Robin, Oak leaf, Bumblebee, Lichen"
                  value={speciesInput}
                  onChange={(e) => setSpeciesInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecies())}
                  className="flex-1 rounded-xl border border-nature-200 dark:border-nature-800 px-3 py-2 text-sm bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100 focus:outline-none focus:ring-2 focus:ring-forest-light"
                />
                <Button variant="secondary" size="sm" onClick={handleAddSpecies}>
                  Add
                </Button>
              </div>

              {speciesTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {speciesTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-nature-100 dark:bg-nature-800 text-nature-800 dark:text-nature-200 text-xs font-medium flex items-center gap-1.5"
                    >
                      {tag}
                      <button
                        onClick={() => setSpeciesTags(speciesTags.filter((_, i) => i !== idx))}
                        className="text-nature-500 hover:text-nature-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sensory observations */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Sensory Impressions (What did you hear, smell, feel?)
              </label>
              <textarea
                rows={3}
                placeholder="Heard breeze whispering through the canopy, smelled damp pine needles, felt the warmth of the sun..."
                value={sensoryNotes}
                onChange={(e) => setSensoryNotes(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-3 text-sm bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100 placeholder:text-nature-400 focus:outline-none focus:ring-2 focus:ring-forest-light"
              />
            </div>

            {/* Calmness / Presence rating */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Sense of Calm & Presence (1 - 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCalmnessRating(num)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      calmnessRating >= num
                        ? "bg-forest-light text-white shadow-nature"
                        : "bg-nature-100 dark:bg-nature-900 text-nature-600 dark:text-nature-400"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <span className="text-xs text-nature-600 ml-2">
                  {calmnessRating >= 4 ? "🌿 Deeply Grounded" : "🌱 Recharged"}
                </span>
              </div>
            </div>

            {/* AI debrief reflection */}
            {generatedReflection ? (
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">
                {generatedReflection}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateReflection}
                disabled={loadingReflection}
                className="w-full py-2.5 text-xs text-forest border-dashed border-nature-300 hover:border-forest flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {loadingReflection ? "Synthesizing Local Reflection..." : "Generate AI Field Reflection"}
                </span>
              </Button>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveAndAward}
                className="flex-1 bg-forest hover:bg-forest-dark text-white font-semibold flex items-center justify-center gap-2 shadow-nature"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save to Journal (+XP)</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-forest dark:text-nature-100">
              Outdoor Mission Recorded!
            </h4>
            <p className="text-xs text-nature-600 dark:text-nature-400">
              Your journal has been updated and XP awarded locally. Keep touching grass! 🌿
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
