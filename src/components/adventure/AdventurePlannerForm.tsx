"use client";

import React, { useState } from "react";
import { OutdoorMission } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NatureMap } from "./NatureMap";
import {
  Compass,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Smartphone,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { getAIProvider } from "@/lib/ai/provider";
import { db } from "@/lib/db";
import { playNatureChime } from "@/lib/utils";

interface AdventurePlannerFormProps {
  onLaunchPocketMode: (mission: OutdoorMission) => void;
}

export function AdventurePlannerForm({ onLaunchPocketMode }: AdventurePlannerFormProps) {
  const [duration, setDuration] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<"Gentle Stroll" | "Moderate Exploration" | "Active Trek">("Gentle Stroll");
  const [activityType, setActivityType] = useState<"walk" | "observe" | "garden" | "mindfulness" | "challenge" | "photography">("walk");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Birdwatching", "Native Flora"]);
  const [locationText, setLocationText] = useState<string>("Local Park & Trail");
  const [accessibility, setAccessibility] = useState<string>("Paved / even terrain preferred");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMission, setGeneratedMission] = useState<OutdoorMission | null>(null);

  const interestOptions = [
    "Birdwatching",
    "Native Flora",
    "Tree Canopy & Bark",
    "Insects & Pollinators",
    "Mindful Forest Bathing",
    "Nature Photography",
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const provider = await getAIProvider();
      const plan = await provider.planAdventure({
        durationMinutes: duration,
        difficulty,
        activityType,
        interests: selectedInterests,
        locationQuery: locationText,
        accessibilityNeeds: accessibility,
      });

      // Save to IndexedDB
      await db.missions.add(plan);
      setGeneratedMission(plan);
      playNatureChime("complete");
    } catch (err) {
      console.error("Adventure planning error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Configuration Form Card */}
      <Card className="border-nature-200 dark:border-nature-800 p-6">
        <div className="flex items-center gap-2 border-b border-nature-100 dark:border-nature-900 pb-3 mb-6">
          <div className="p-2 rounded-xl bg-forest-light text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
              Smart Outdoor Adventure Planner
            </h3>
            <p className="text-xs text-nature-600 dark:text-nature-400">
              Create a personalized real-world mission designed to help you disconnect from screens.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Available Exploration Time
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    duration === mins
                      ? "border-forest-light bg-forest-light text-white shadow-nature"
                      : "border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins} mins</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Pace / Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              >
                <option value="Gentle Stroll">Gentle Stroll (Mindful & Relaxed)</option>
                <option value="Moderate Exploration">Moderate Exploration (Brisk Loop)</option>
                <option value="Active Trek">Active Trek (Continuous Footwork)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Activity Modality
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as typeof activityType)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              >
                <option value="walk">Neighborhood / Trail Walk</option>
                <option value="observe">Biodiversity Observation</option>
                <option value="mindfulness">Screen-Free Forest Bathing</option>
                <option value="challenge">Nature Scavenger Mission</option>
                <option value="photography">Botanical Light & Texture Safari</option>
              </select>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Primary Nature Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? "border-forest-light bg-forest/10 text-forest dark:text-emerald-300 font-bold"
                        : "border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Starting Location & Accessibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Starting Trailhead or Area
              </label>
              <input
                type="text"
                placeholder="e.g. Maple Grove Park, Backyard, Canal Trail"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Accessibility Preferences
              </label>
              <input
                type="text"
                placeholder="e.g. Flat paved path, stroller friendly, shady seating"
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isGenerating}
            className="w-full bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-nature flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{isGenerating ? "Synthesizing Realistic Outdoor Plan..." : "Generate Outdoor Plan"}</span>
          </Button>
        </form>
      </Card>

      {/* Generated Itinerary Display */}
      {generatedMission && (
        <Card className="border-forest-light/60 p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-nature-100 dark:border-nature-900 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="forest">{generatedMission.difficulty}</Badge>
                <Badge variant="amber">{generatedMission.durationMinutes} Minutes</Badge>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-forest dark:text-nature-50">
                {generatedMission.title}
              </h3>
              <p className="text-xs sm:text-sm text-nature-600 dark:text-nature-300 mt-1">
                {generatedMission.summary}
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => onLaunchPocketMode(generatedMission)}
              className="bg-forest-light hover:bg-forest text-white rounded-xl shadow-nature-lg flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Launch Pocket Mode & Go Outside</span>
            </Button>
          </div>

          {/* OpenStreetMap Component */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Offline-Friendly OpenStreetMap Exploration Route</span>
            </span>
            <NatureMap
              waypoints={[
                {
                  title: "Start Point: Departure",
                  lat: 40.7128,
                  lng: -74.006,
                  description: "Begin walking at a calm pace. Screen in pocket.",
                },
                {
                  title: "Midway Checkpoint",
                  lat: 40.7155,
                  lng: -74.0035,
                  description: "Pause for 3 minutes. Tune into auditory landscape.",
                },
              ]}
              className="h-[300px]"
            />
          </div>

          {/* What to bring */}
          {generatedMission.whatToBring && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
              <span className="font-semibold text-xs text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                What to Bring Checklist
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-stone-800 dark:text-stone-200">
                {generatedMission.whatToBring.map((item, idx) => (
                  <span key={idx} className="bg-white/80 dark:bg-nature-900/80 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Checkpoints */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Naturalist Checkpoints Along the Way
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {generatedMission.checkpoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-nature-50/60 dark:bg-nature-900/40 border border-nature-200/80 dark:border-nature-800 space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-forest dark:text-emerald-400">
                    <span className="w-5 h-5 rounded-full bg-forest-light text-white flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{cp.title}</span>
                  </div>
                  <p className="text-xs text-nature-700 dark:text-nature-300 leading-snug">
                    {cp.description}
                  </p>
                  <p className="text-[11px] text-nature-500 italic">
                    Look for: {cp.lookFor}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Educational note */}
          <div className="p-3.5 rounded-xl bg-nature-50 dark:bg-nature-900/30 border border-nature-200/60 dark:border-nature-800 text-xs text-nature-600 dark:text-nature-400 flex items-center justify-between">
            <span>Safety: {generatedMission.safetyTip}</span>
            <span className="font-semibold text-forest dark:text-nature-300">Never invent trail access rules</span>
          </div>
        </Card>
      )}
    </div>
  );
}
