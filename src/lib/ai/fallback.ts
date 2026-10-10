import {
  AIProvider,
  AIProviderStatus,
  AdventurePlanParams,
  ChatRequestOptions,
  GardenPlanParams,
  IdentificationParams,
  ReflectionParams,
} from "./types";
import { IdentificationResult, OutdoorMission, GardenProfile } from "@/types";
import { NATURE_DATABASE } from "./nature-db";

export class LocalFallbackProvider implements AIProvider {
  name = "Local Field Guide Engine (Offline Heuristics)";

  async checkHealth(): Promise<AIProviderStatus> {
    return {
      status: "fallback",
      providerName: this.name,
      activeModel: "Local Taxonomy Heuristics Engine (100% Offline)",
      availableModels: ["local-nature-heuristics-v1"],
      latencyMs: 1,
      message: "Ready. Instant, private, fully offline intelligence without network or server dependencies.",
      isVisionCapable: false,
    };
  }

  async listModels(): Promise<string[]> {
    return ["local-nature-heuristics-v1"];
  }

  async chat(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    _options?: ChatRequestOptions
  ): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const lower = lastUserMessage.toLowerCase();

    // 1. Bird identification or queries
    if (lower.includes("bird") || lower.includes("robin") || lower.includes("owl") || lower.includes("hawk") || lower.includes("chickadee")) {
      const match = NATURE_DATABASE.find(
        (s) => s.category === "bird" && (lower.includes(s.commonName.toLowerCase()) || lower.includes(s.id.replace("bird-", "")))
      );
      if (match) {
        return `🌿 **${match.commonName}** (*${match.scientificName}*)\n\n` +
          `**Family:** ${match.family}\n` +
          `**Habitat:** ${match.habitat}\n\n` +
          `**Distinguishing Features:**\n${match.distinguishingFeatures.map((f) => `• ${f}`).join("\n")}\n\n` +
          (match.callDescription ? `**Voice & Song:** ${match.callDescription}\n\n` : "") +
          `**Field Observation Tip:** Look for movement along forest edges or lawn perimeters. Avoid making sudden movements; stay still for 3-5 minutes and birds will resume natural behavior.\n\n` +
          `*(Powered by offline local field guide database)*`;
      }

      return `🐦 **Observing Birds in Your Area:**\n\n` +
        `To identify birds without screens, focus on these 4 field markers:\n` +
        `1. **Silhouette & Size:** Is it sparrow-sized (tiny), robin-sized (medium), crow-sized (large), or raptor-sized?\n` +
        `2. **Posture & Motion:** Does it hop across open lawn (like a Robin or Starling), cling upright to tree trunks (like a Woodpecker or Nuthatch), or flutter in outer branches (like a Chickadee)?\n` +
        `3. **Beak Architecture:** Cone-shaped (seed eater like Cardinal/Finch), needle-thin (insect eater like Warbler), or hooked (predator)?\n` +
        `4. **Key Field Marks:** Look for wing bars, eye stripes, or rump color flashes in flight.\n\n` +
        `*Field Tip:* Step outside in early morning (dawn chorus) or late afternoon when bird activity peaks!`;
    }

    // 2. Poisonous or safety warnings
    if (lower.includes("poison") || lower.includes("toxic") || lower.includes("eat") || lower.includes("edible") || lower.includes("mushroom") || lower.includes("fungi")) {
      return `⚠️ **Field Safety & Foraging Protocol:**\n\n` +
        `• **Rule #1: NEVER eat wild plants, berries, or mushrooms based solely on app recommendations or casual resemblance.**\n` +
        `• **Look out for Contact Hazards:**\n` +
        `  - **Poison Ivy (*Toxicodendron radicans*):** Remember *"Leaves of three, let it be; hairy vine, no friend of mine."* Contains urushiol causing severe allergic dermatitis.\n` +
        `  - **Giant Hogweed (*Heracleum mantegazzianum*):** Extreme phytophotodermatitis hazard; sap exposed to sunlight causes severe blistering.\n` +
        `  - **Common Foxglove (*Digitalis purpurea*):** Beautiful purple bell spires, but contains deadly cardiac glycosides.\n\n` +
        `• **Safe Exploring:** Wear long pants and closed shoes when walking off-trail, stay hydrated, and observe living species with your eyes and camera rather than touching unknown plants!`;
    }

    // 3. Tree identification
    if (lower.includes("tree") || lower.includes("oak") || lower.includes("maple") || lower.includes("birch") || lower.includes("bark")) {
      return `🌳 **Field Guide: Identifying Trees by Bark, Leaves & Branching:**\n\n` +
        `When identifying a tree offline, inspect:\n` +
        `1. **Leaf Arrangement:** Are twigs and leaves *opposite* each other (M-A-D: Maple, Ash, Dogwood) or *alternate* (Oaks, Birches, Cherries, Beeches)?\n` +
        `2. **Leaf Shape:**\n` +
        `   • Rounded lobes without bristles: **White Oak** (*Quercus alba*)\n` +
        `   • Pointed 5-lobed leaves with U-shaped sinuses: **Sugar Maple** (*Acer saccharum*)\n` +
        `   • Triangular leaves with horizontal peeling white bark: **Silver Birch** (*Betula pendula*)\n` +
        `3. **Bark Texture:** Note whether the bark is smooth, diamond-fissured, shaggy, or scaly.\n\n` +
        `*Challenge:* Can you find one tree with opposite branching and one with alternate branching on your next walk?`;
    }

    // 4. Garden advice
    if (lower.includes("garden") || lower.includes("soil") || lower.includes("plant") || lower.includes("grow") || lower.includes("balcony")) {
      return `🌱 **Sustainable Nature Gardening Recommendations:**\n\n` +
        `• **Match Sunlight to Plants:**\n` +
        `  - Full Sun (6+ hrs): Lavender, Purple Coneflower, Basil, Tomatoes\n` +
        `  - Partial Shade (3-6 hrs): Ferns, Mint, Chives, Columbine\n` +
        `• **Support Local Pollinators:** Choose single-bloom native wildflowers over hybridized double-flowered ornamentals. Native bees and butterflies need accessible nectar glands.\n` +
        `• **Soil Health:** Enhance container potting mix with aged compost rather than synthetic fertilizers to nourish beneficial mycorrhizal fungi.\n` +
        `• **Container Tip:** Ensure drainage holes are unblocked to prevent root rot during rainy spells.`;
    }

    // 5. Nature walk / adventure / screen-free
    if (lower.includes("walk") || lower.includes("trail") || lower.includes("hike") || lower.includes("morning") || lower.includes("pocket mode") || lower.includes("disconnect")) {
      return `🌿 **Recommendations for a Mindful Nature Walk:**\n\n` +
        `1. **Leave the digital noise behind:** Set TerraQuest AI into **Pocket Mode** or tuck your phone into your pocket.\n` +
        `2. **Sensory Grounding (5-4-3-2-1):**\n` +
        `   • Notice 5 different leaf or branch silhouettes.\n` +
        `   • Feel 4 distinct natural textures (dry soil, rough bark, cool breeze, warm sunlight).\n` +
        `   • Hear 3 non-human sounds (wind, water, bird calls).\n` +
        `   • Inhale 2 natural scents (pine, damp moss, damp earth).\n` +
        `   • Acknowledge 1 feeling of peaceful presence.\n` +
        `3. **Keep moving gently:** Aim for 20-30 minutes outdoors. You don't need a national park—a neighborhood street tree or urban park edge is brimming with life!`;
    }

    // Default conversational response
    return `🌲 **Welcome to TerraQuest AI Nature Assistant (Offline Mode)**\n\n` +
      `I'm your local nature guide, designed to help you understand the outdoor world and put your screen away.\n\n` +
      `Here are things you can ask me:\n` +
      `• *"What birds might I spot near oak trees or garden hedges?"*\n` +
      `• *"How do I tell poison ivy apart from Virginia creeper?"*\n` +
      `• *"Give me a 15-minute nature scavenger walk for my neighborhood."*\n` +
      `• *"What plants can I grow in a balcony pot with 4 hours of sun?"*\n\n` +
      `If you have **Ollama** running locally, you can switch to an open-weight model (like Qwen 2.5 or Gemma 2) in **Settings** for unlimited generative responses!`;
  }

  async identify(params: IdentificationParams): Promise<IdentificationResult> {
    const { userObservations = {} } = params;
    const cat = (userObservations.category || "").toLowerCase();
    const queryColors = (userObservations.colors || []).map((c) => c.toLowerCase());
    const notes = (userObservations.additionalNotes || "").toLowerCase();
    const shape = (userObservations.leafOrFeatherShape || "").toLowerCase();

    // Score candidates from database
    let candidates = NATURE_DATABASE.filter((sp) => {
      if (cat && sp.category !== cat && cat !== "all") return false;
      return true;
    });

    if (candidates.length === 0) {
      candidates = NATURE_DATABASE;
    }

    // Score each candidate
    const scored = candidates.map((sp) => {
      let score = 50;
      const spText = `${sp.commonName} ${sp.scientificName} ${sp.distinguishingFeatures.join(" ")} ${sp.habitat}`.toLowerCase();

      // Check colors
      queryColors.forEach((color) => {
        if (spText.includes(color)) score += 15;
      });

      // Check shapes
      if (shape && spText.includes(shape)) score += 20;

      // Check notes keywords
      const words = notes.split(/\s+/).filter((w) => w.length > 3);
      words.forEach((w) => {
        if (spText.includes(w)) score += 10;
      });

      return { sp, score: Math.min(score, 94) };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored[0].sp;
    const second = scored[1]?.sp;
    const third = scored[2]?.sp;

    const alternatives = [second, third]
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({
        speciesName: s.commonName,
        scientificName: s.scientificName,
        howToDistinguish: `Compare ${s.distinguishingFeatures[0] || "habitat and size characteristics"}.`,
      }));

    return {
      speciesName: top.commonName,
      scientificName: top.scientificName,
      category: top.category,
      confidence: scored[0].score,
      isCertain: false, // Honesty: Never claim certain without lab/botanist review
      distinguishingFeatures: top.distinguishingFeatures,
      habitat: top.habitat,
      safetyNotes: top.safetyNotes,
      edibleWarning: top.edibleWarning,
      fieldObservationTips: [
        "Observe species in natural lighting before disturbing.",
        "Take a close-up photo of leaf attachment or beak profile for your journal.",
        "Check surrounding vegetation and microclimate to confirm habitat.",
      ],
      candidateAlternatives: alternatives,
      modelUsed: "Offline Taxonomy Matcher",
      method: "guided-heuristic",
    };
  }

  async planAdventure(params: AdventurePlanParams): Promise<OutdoorMission> {
    const {
      durationMinutes = 25,
      difficulty = "Gentle Stroll",
      activityType = "walk",
      interests = ["Nature"],
      locationQuery = "Local Trail / Neighborhood",
    } = params;

    const missionTitles: Record<string, string> = {
      walk: "Mindful Neighborhood Loop: Forest Architecture",
      observe: "Canopy & Understory Biodiversity Expedition",
      mindfulness: "Screen-Free Forest Bathing & Sensory Reset",
      challenge: "The 5-Species Nature Scavenger Sprint",
      garden: "Soil, Sprout & Pollinator Habitat Inspection",
      photography: "Golden Hour Botanical Light & Shadow Safari",
    };

    const title = missionTitles[activityType] || "Personalized Outdoor Field Quest";

    return {
      id: `mission-${Date.now()}`,
      title,
      summary: `A ${durationMinutes}-minute ${difficulty.toLowerCase()} around ${locationQuery} focusing on ${interests.join(", ")}.`,
      category: activityType,
      durationMinutes,
      difficulty,
      whatToBring: [
        "Comfortable walking shoes",
        "Water bottle",
        "Phone locked in pocket (use Pocket Mode)",
        "Optional field loupe or notebook",
      ],
      steps: [
        `Depart from ${locationQuery} and begin at an easy, relaxed pace.`,
        "Spend the first 5 minutes getting into rhythm; leave phone screens in pocket.",
        `Look specifically for indicators of: ${interests.join(" and ")}.`,
        "Pause at a midpoint natural landmark for 3 minutes of quiet observation.",
        "Conclude the loop and record your reflections upon returning.",
      ],
      checkpoints: [
        {
          title: "Initial Acclimatization",
          description: "Stop after 50 paces and take 3 deep belly breaths.",
          lookFor: "Notice the temperature of the air and humidity.",
        },
        {
          title: "Biodiversity Checkpoint",
          description: "Inspect the boundary between path and vegetation.",
          lookFor: "Native wild plants, insects, or leaf litter dwellers.",
        },
        {
          title: "Canopy Observation",
          description: "Look upward into the crown of a mature tree.",
          lookFor: "Branch patterns, bird perches, or squirrels.",
        },
      ],
      educationalNugget:
        "Spending as little as 20 minutes in a green space has been clinically shown to reduce salivary cortisol and boost executive mental clarity.",
      safetyTip:
        "Watch your footing on tree roots or wet grass. Do not touch unidentified thorny or hairy vines.",
      completed: false,
    };
  }

  async adviseGarden(params: GardenPlanParams): Promise<Partial<GardenProfile>> {
    const { sunlight, soilType, spaceType, focusGoal, climateZone } = params;

    return {
      name: `${spaceType} - ${focusGoal} Plan`,
      climateZone,
      sunlight: sunlight as GardenProfile["sunlight"],
      soilType: soilType as GardenProfile["soilType"],
      spaceType: spaceType as GardenProfile["spaceType"],
      focusGoal: focusGoal as GardenProfile["focusGoal"],
      plants: [
        {
          id: `plant-${Date.now()}-1`,
          name: sunlight.includes("Full") ? "Purple Coneflower" : "Wild Columbine",
          scientificName: sunlight.includes("Full") ? "Echinacea purpurea" : "Aquilegia canadensis",
          category: "native_wildflower",
          waterFrequencyDays: 3,
          sunRequirement: sunlight,
          plantingSeason: "Spring",
          harvestOrBloomSeason: "Summer through Autumn",
          companionPlants: ["Lavender", "Black-eyed Susan"],
          careTips: "Requires minimal fertilizer. Thrives in native conditions and attracts pollinators.",
        },
        {
          id: `plant-${Date.now()}-2`,
          name: "Sweet Genovese Basil",
          scientificName: "Ocimum basilicum",
          category: "herb",
          waterFrequencyDays: 2,
          sunRequirement: "Bright sun and shelter from wind",
          plantingSeason: "Late Spring",
          harvestOrBloomSeason: "Summer",
          companionPlants: ["Tomatoes", "Marigolds"],
          careTips: "Pinch flower buds to maintain tender leafy harvests.",
        },
      ],
      seasonalTasks: [
        {
          id: `task-sp-${Date.now()}`,
          season: "Spring",
          title: "Soil Preparation & Seed Starting",
          description: `Prepare ${spaceType} containers using fresh compost. Ensure drainage holes are open.`,
          done: false,
        },
        {
          id: `task-su-${Date.now()}`,
          season: "Summer",
          title: "Morning Watering & Pollinator Watch",
          description: "Water at base of plants before midday heat. Enjoy watching visiting solitary bees.",
          done: false,
        },
      ],
    };
  }

  async generateReflection(params: ReflectionParams): Promise<string> {
    const { missionTitle, durationMinutes, observedSpecies, sensoryNotes, calmnessRating } = params;

    const calmAdjectives = ["grounded", "peaceful", "revitalized", "tranquil", "centered"];
    const calmWord = calmAdjectives[Math.min(calmnessRating - 1, 4)] || "refreshed";

    return `🌿 **Post-Exploration Reflection**\n\n` +
      `You completed **${durationMinutes} minutes** of screen-free outdoor exploration during *"${missionTitle}"*.\n\n` +
      `**What You Experienced:**\n` +
      `• Recorded Sensory Notes: "${sensoryNotes || "Enjoyed the quiet presence of the natural world."}"\n` +
      (observedSpecies.length > 0 ? `• Species Noticed: ${observedSpecies.join(", ")}\n` : "") +
      `• Mindfulness Rating: ${calmnessRating}/5 (Feeling ${calmWord})\n\n` +
      `**Naturalist Takeaway:**\n` +
      `By stepping away from digital feeds, you allowed your nervous system to down-regulate and reconnected with real-world biological rhythms. Your observations have been safely stored in your offline private journal. Well done! 🍃`;
  }
}
