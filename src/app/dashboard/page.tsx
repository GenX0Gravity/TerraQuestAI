"use client";

import React from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { OutdoorMission } from "@/types";

export default function DashboardPage() {
  const handleLaunchPocketMode = (mission: OutdoorMission) => {
    // Pocket Mode handler
    const pocketBtn = document.querySelector('button[title*="screen-free"]') as HTMLButtonElement | null;
    if (pocketBtn) {
      pocketBtn.click();
    }
  };

  return <DashboardView onLaunchPocketMode={handleLaunchPocketMode} />;
}
