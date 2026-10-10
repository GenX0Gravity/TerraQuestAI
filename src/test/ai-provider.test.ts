import { describe, it, expect } from "vitest";
import { LocalFallbackProvider } from "@/lib/ai/fallback";

describe("LocalFallbackProvider (Offline Nature Intelligence)", () => {
  const provider = new LocalFallbackProvider();

  it("should report offline fallback status on health check", async () => {
    const health = await provider.checkHealth();
    expect(health.status).toBe("fallback");
    expect(health.activeModel).toContain("Offline");
    expect(health.latencyMs).toBeDefined();
  });

  it("should answer bird identification queries with field guide details", async () => {
    const reply = await provider.chat([
      { role: "user", content: "What birds might I see in this area, like an American Robin?" },
    ]);
    expect(reply.toLowerCase()).toContain("robin");
    expect(reply).toContain("Turdus migratorius");
    expect(reply).toContain("Distinguishing Features");
  });

  it("should provide immediate safety warning when asking about poisonous wild plants", async () => {
    const reply = await provider.chat([
      { role: "user", content: "Is it safe to eat wild berries or touch unknown plants?" },
    ]);
    expect(reply).toContain("Field Safety");
    expect(reply).toContain("NEVER eat wild plants");
    expect(reply.toLowerCase()).toContain("poison ivy");
  });

  it("should identify species based on morphological traits (leaf, color, category)", async () => {
    const result = await provider.identify({
      userObservations: {
        category: "bird",
        colors: ["red", "orange"],
        additionalNotes: "Brick-red breast singing cheerful song on morning lawn",
      },
    });

    expect(result.speciesName).toBe("American Robin");
    expect(result.category).toBe("bird");
    expect(result.confidence).toBeGreaterThan(60);
    expect(result.isCertain).toBe(false); // Honesty: never claim certain
    expect(result.distinguishingFeatures.length).toBeGreaterThan(0);
  });

  it("should generate a realistic adventure mission plan with checkpoints", async () => {
    const mission = await provider.planAdventure({
      durationMinutes: 30,
      difficulty: "Gentle Stroll",
      activityType: "walk",
      interests: ["Birdwatching", "Native Flora"],
      locationQuery: "Neighborhood Park",
    });

    expect(mission.durationMinutes).toBe(30);
    expect(mission.difficulty).toBe("Gentle Stroll");
    expect(mission.checkpoints.length).toBeGreaterThanOrEqual(1);
    expect(mission.whatToBring.length).toBeGreaterThanOrEqual(1);
    expect(mission.safetyTip).toBeDefined();
  });

  it("should synthesize a post-exploration reflection based on sensory notes", async () => {
    const reflection = await provider.generateReflection({
      missionTitle: "Morning Canopy Walk",
      durationMinutes: 25,
      observedSpecies: ["American Robin", "White Oak"],
      sensoryNotes: "Heard birds singing, smelled damp soil after morning dew",
      calmnessRating: 5,
    });

    expect(reflection).toContain("Morning Canopy Walk");
    expect(reflection).toContain("25 minutes");
    expect(reflection).toContain("American Robin");
  });
});
