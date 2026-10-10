"use client";

import React from "react";
import { GardenPlannerView } from "@/components/garden/GardenPlannerView";

export default function GardenPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GardenPlannerView />
    </div>
  );
}
