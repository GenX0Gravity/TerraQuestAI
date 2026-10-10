"use client";

import React, { useState, useEffect } from "react";
import { OutdoorMission } from "@/types";
import { Smartphone, Check, Play, Pause, RotateCcw, Volume2, ArrowLeft, Sun, Trees, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { playNatureChime } from "@/lib/utils";

interface PocketModeOverlayProps {
  isOpen: boolean;
  mission?: OutdoorMission | null;
  onClose: () => void;
  onCompleteMission: (mission: OutdoorMission, timeSpentMinutes: number) => void;
}

export function PocketModeOverlay({
  isOpen,
  mission,
  onClose,
  onCompleteMission,
}: PocketModeOverlayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Initialize timer when mission changes
  useEffect(() => {
    if (mission) {
      setSecondsRemaining(mission.durationMinutes * 60);
    } else {
      setSecondsRemaining(20 * 60);
    }
    setTimerRunning(false);
    setActiveStepIndex(0);
    setTimeSpentSeconds(0);
  }, [mission]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(prev - 1, 0));
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  if (!isOpen) return null;

  const currentMission = mission || {
    id: "quick-walk",
    title: "The 20-Minute Sensory Nature Immersion",
    durationMinutes: 20,
    difficulty: "Gentle Stroll",
    whatToBring: ["Comfortable shoes", "Water bottle", "Eyes and ears tuned to nature"],
    steps: [
      "Put your phone in your pocket or lock the screen.",
      "Notice sounds: wind in leaves, distant birds, footsteps on earth.",
      "Look for 3 distinct leaf structures (lobed, serrated, smooth).",
      "Notice natural scents (pine, damp soil, blooming flowers).",
      "Touch a tree trunk or stone gently without disturbing it."
    ],
    checkpoints: [],
    educationalNugget: "20 minutes outdoors significantly lowers cortisol levels.",
    safetyTip: "Stay on safe paths and mind tree roots.",
    completed: false,
    category: "mindfulness" as const,
    summary: "Screen-free nature immersion."
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleStartTimer = () => {
    playNatureChime("click");
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
  };

  const handleFinish = () => {
    playNatureChime("complete");
    const spentMins = Math.max(Math.round(timeSpentSeconds / 60), 1);
    onCompleteMission(currentMission, spentMins);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1710] text-[#e3efe4] flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-emerald-300/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Pocket Mode</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Screen-Free Active</span>
        </div>
      </div>

      {/* Main Focus Center */}
      <div className="max-w-xl mx-auto w-full my-auto py-8 text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-emerald-300 mb-2">
          <Trees className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          {currentMission.title}
        </h1>

        <p className="text-sm sm:text-base text-emerald-200/80 leading-relaxed max-w-md mx-auto">
          Put your phone away. Step outside. The screen will stay calm while you explore the real world.
        </p>

        {/* Big Outdoor Timer */}
        <div className="py-4">
          <div className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-white mb-2">
            {formattedTime}
          </div>
          <p className="text-xs text-emerald-400 uppercase tracking-widest">
            {timerRunning ? "Exploring in the wild" : "Timer Ready"}
          </p>
        </div>

        {/* Essential Step Card (Shows 1 step at a time) */}
        {currentMission.steps && currentMission.steps.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span className="font-semibold uppercase tracking-wider">
                Field Instruction {activeStepIndex + 1} of {currentMission.steps.length}
              </span>
              <span>Tap to advance</span>
            </div>

            <p className="text-base sm:text-lg font-medium text-white leading-snug">
              {currentMission.steps[activeStepIndex]}
            </p>

            <div className="flex items-center gap-1.5 pt-2">
              {currentMission.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeStepIndex
                      ? "w-8 bg-emerald-400"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* What to bring reminder */}
        {currentMission.whatToBring && (
          <div className="text-xs text-emerald-300/70 flex items-center justify-center gap-2 flex-wrap">
            <span className="font-semibold text-emerald-300">Kit:</span>
            {currentMission.whatToBring.map((item, idx) => (
              <span key={idx} className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="max-w-md mx-auto w-full pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          {!timerRunning ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTimer}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base py-4 rounded-2xl shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Exploration</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePauseTimer}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-base py-4 rounded-2xl border border-white/20"
            >
              <Pause className="w-5 h-5" />
              <span>Pause Timer</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSecondsRemaining(currentMission.durationMinutes * 60);
              setTimerRunning(false);
            }}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Return Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleFinish}
          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-nature-lg"
        >
          <Check className="w-5 h-5" />
          <span>I Have Returned — Record Discoveries</span>
        </Button>
      </div>
    </div>
  );
}
