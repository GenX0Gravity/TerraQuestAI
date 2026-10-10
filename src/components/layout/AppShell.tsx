"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { PocketModeOverlay } from "@/components/pocket-mode/PocketModeOverlay";
import { ReturnReflectionModal } from "@/components/pocket-mode/ReturnReflectionModal";
import { OutdoorMission } from "@/types";
import { initializeDatabase } from "@/lib/db";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [pocketModeOpen, setPocketModeOpen] = useState(false);
  const [activeMission, setActiveMission] = useState<OutdoorMission | null>(null);
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [timeSpentMins, setTimeSpentMins] = useState(20);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleLaunchPocketMode = (mission?: OutdoorMission) => {
    if (mission) {
      setActiveMission(mission);
    }
    setPocketModeOpen(true);
  };

  const handleCompleteMissionFromPocket = (mission: OutdoorMission, mins: number) => {
    setActiveMission(mission);
    setTimeSpentMins(mins);
    setPocketModeOpen(false);
    setReflectionModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-nature-950 bg-field-pattern">
      {/* Top Navbar */}
      <Navbar onOpenPocketMode={() => handleLaunchPocketMode()} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar onOpenPocketMode={() => handleLaunchPocketMode()} />

        {/* Main Page Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav onOpenPocketMode={() => handleLaunchPocketMode()} />

      {/* Pocket Mode Fullscreen Overlay */}
      <PocketModeOverlay
        isOpen={pocketModeOpen}
        mission={activeMission}
        onClose={() => setPocketModeOpen(false)}
        onCompleteMission={handleCompleteMissionFromPocket}
      />

      {/* Return & Reflection Modal */}
      <ReturnReflectionModal
        isOpen={reflectionModalOpen}
        mission={activeMission}
        timeSpentMinutes={timeSpentMins}
        onClose={() => setReflectionModalOpen(false)}
        onSaved={() => {
          setActiveMission(null);
        }}
      />
    </div>
  );
}
