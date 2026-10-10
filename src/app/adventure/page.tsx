"use client";

import React from "react";
import { AdventurePlannerForm } from "@/components/adventure/AdventurePlannerForm";
import { OutdoorMission } from "@/types";

export default function AdventurePage() {
  const handleLaunchPocketMode = (mission: OutdoorMission) => {
    const pocketBtn = document.querySelector('button[title*="screen-free"]') as HTMLButtonElement | null;
    if (pocketBtn) {
      pocketBtn.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdventurePlannerForm onLaunchPocketMode={handleLaunchPocketMode} />
    </div>
  );
}
