"use client";

import React from "react";
import { WelcomeView } from "@/components/welcome/WelcomeView";

export default function HomePage() {
  const handleOpenPocketMode = () => {
    // Trigger pocket mode button in DOM or header
    const pocketBtn = document.querySelector('button[title*="screen-free"]') as HTMLButtonElement | null;
    if (pocketBtn) {
      pocketBtn.click();
    }
  };

  return <WelcomeView onOpenPocketMode={handleOpenPocketMode} />;
}
