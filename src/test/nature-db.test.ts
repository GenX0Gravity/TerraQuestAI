import { describe, it, expect } from "vitest";
import { NATURE_DATABASE, NATURE_ECOSYSTEMS } from "@/lib/ai/nature-db";

describe("Nature Database Integrity & Safety Protocol", () => {
  it("should contain species records across multiple categories", () => {
    expect(NATURE_DATABASE.length).toBeGreaterThan(10);
    const categories = new Set(NATURE_DATABASE.map((s) => s.category));
    expect(categories.has("bird")).toBe(true);
    expect(categories.has("plant")).toBe(true);
    expect(categories.has("tree")).toBe(true);
    expect(categories.has("insect")).toBe(true);
  });

  it("should have safety warnings for hazardous species like Poison Ivy and Giant Hogweed", () => {
    const poisonIvy = NATURE_DATABASE.find((s) => s.id === "plant-poison-ivy");
    expect(poisonIvy).toBeDefined();
    expect(poisonIvy?.safetyNotes?.toLowerCase()).toContain("contact hazard");
    expect(poisonIvy?.safetyNotes?.toLowerCase()).toContain("urushiol");

    const giantHogweed = NATURE_DATABASE.find((s) => s.id === "plant-giant-hogweed");
    expect(giantHogweed).toBeDefined();
    expect(giantHogweed?.safetyNotes?.toLowerCase()).toContain("extreme health hazard");
  });

  it("should have distinguishing characteristics for all species", () => {
    NATURE_DATABASE.forEach((sp) => {
      expect(sp.distinguishingFeatures.length).toBeGreaterThanOrEqual(2);
      expect(sp.scientificName).toBeDefined();
      expect(sp.habitat).toBeDefined();
    });
  });

  it("should define representative ecosystems with gear recommendations", () => {
    expect(NATURE_ECOSYSTEMS.length).toBeGreaterThanOrEqual(3);
    NATURE_ECOSYSTEMS.forEach((eco) => {
      expect(eco.recommendedGear.length).toBeGreaterThanOrEqual(1);
      expect(eco.keySpecies.length).toBeGreaterThanOrEqual(2);
    });
  });
});
