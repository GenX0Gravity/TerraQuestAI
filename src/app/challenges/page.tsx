"use client";

import React from "react";
import { ChallengeList } from "@/components/challenges/ChallengeList";

export default function ChallengesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ChallengeList />
    </div>
  );
}
