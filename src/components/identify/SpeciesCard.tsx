"use client";

import React, { useState } from "react";
import { IdentificationResult, Observation } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { BookmarkPlus, Check, AlertTriangle, ShieldAlert, Sparkles, Compass } from "lucide-react";
import { db } from "@/lib/db";
import { playNatureChime } from "@/lib/utils";

interface SpeciesCardProps {
  result: IdentificationResult;
  capturedImageUrl?: string | null;
  onSavedToJournal?: () => void;
}

export function SpeciesCard({
  result,
  capturedImageUrl,
  onSavedToJournal,
}: SpeciesCardProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const newObs: Observation = {
        id: `obs-${Date.now()}`,
        title: `Observation of ${result.speciesName}`,
        speciesName: result.speciesName,
        scientificName: result.scientificName,
        category: result.category,
        date: new Date().toISOString().split("T")[0],
        notes: `Identified via ${result.method}. Distinguishing marks: ${result.distinguishingFeatures.join(", ")}`,
        confidence: result.confidence,
        imageUrl: capturedImageUrl || undefined,
        verified: result.isCertain,
        tags: [result.category, "Identified Specimen"],
        createdAt: Date.now(),
      };

      await db.observations.add(newObs);

      // Award XP
      const prefs = await db.userPreferences.get("default");
      if (prefs) {
        await db.userPreferences.update("default", {
          totalXp: (prefs.totalXp || 0) + 30,
        });
      }

      playNatureChime("complete");
      setSaved(true);
      if (onSavedToJournal) onSavedToJournal();
    } catch (err) {
      console.error("Error saving observation:", err);
    }
  };

  return (
    <Card className="border-nature-300 dark:border-nature-700 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-nature-100 dark:border-nature-900 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="forest" className="capitalize">
              {result.category}
            </Badge>
            <Badge variant={result.confidence > 80 ? "forest" : "amber"}>
              {result.confidence}% Match ({result.isCertain ? "Verified" : "Candidate"})
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest dark:text-nature-50">
            {result.speciesName}
          </h2>
          <p className="text-sm italic text-nature-600 dark:text-nature-400">
            {result.scientificName}
          </p>
        </div>

        <Button
          variant={saved ? "secondary" : "primary"}
          size="sm"
          onClick={handleSave}
          disabled={saved}
          className="rounded-xl flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Saved to Journal (+30 XP)</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              <span>Record in Journal</span>
            </>
          )}
        </Button>
      </div>

      {/* Safety / Toxic Warnings (Critical for Nature Apps!) */}
      {result.safetyNotes && (
        <Alert variant="warning" title="Field Safety Notice">
          {result.safetyNotes}
        </Alert>
      )}

      {result.edibleWarning && (
        <Alert variant="danger" title="⚠️ Strict Foraging Warning">
          {result.edibleWarning}
        </Alert>
      )}

      {/* Distinguishing Features */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
          Distinguishing Identification Characteristics
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-nature-800 dark:text-nature-200">
          {result.distinguishingFeatures.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-nature-50/70 dark:bg-nature-900/40 p-2.5 rounded-xl border border-nature-200/60 dark:border-nature-800">
              <span className="text-emerald-600 font-bold shrink-0">•</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Habitat & Field Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-nature-50/50 dark:bg-nature-900/30 border border-nature-200/60 dark:border-nature-800 space-y-1">
          <span className="font-semibold text-forest dark:text-nature-200">Typical Habitat:</span>
          <p className="text-nature-700 dark:text-nature-300">{result.habitat}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-nature-50/50 dark:bg-nature-900/30 border border-nature-200/60 dark:border-nature-800 space-y-1">
          <span className="font-semibold text-forest dark:text-nature-200">Independent Observation Tip:</span>
          <p className="text-nature-700 dark:text-nature-300">
            {result.fieldObservationTips[0] || "Examine without touching; observe sunlight reflection on foliage or feathers."}
          </p>
        </div>
      </div>

      {/* Alternative Possibilities */}
      {result.candidateAlternatives && result.candidateAlternatives.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-nature-100 dark:border-nature-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-nature-600">
            Similar Species to Compare
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.candidateAlternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-nature-200 dark:border-nature-800 text-xs space-y-1"
              >
                <div className="font-semibold text-forest dark:text-nature-200">
                  {alt.speciesName} <span className="italic font-normal">({alt.scientificName})</span>
                </div>
                <p className="text-nature-600 dark:text-nature-400">{alt.howToDistinguish}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model & Source Attribution */}
      <div className="text-[11px] text-nature-500 flex items-center justify-between pt-1">
        <span>Analysis Engine: {result.modelUsed} ({result.method})</span>
        <span>Always verify with field guide</span>
      </div>
    </Card>
  );
}
