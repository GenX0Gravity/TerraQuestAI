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
import { LocalFallbackProvider } from "./fallback";

export class OllamaProvider implements AIProvider {
  name = "Ollama Local Engine";
  baseUrl: string;
  defaultModel: string;
  useProxy: boolean;
  private fallback: LocalFallbackProvider;

  constructor(
    baseUrl: string = "http://localhost:11434",
    defaultModel: string = "qwen2.5:3b",
    useProxy: boolean = true
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultModel = defaultModel;
    this.useProxy = useProxy;
    this.fallback = new LocalFallbackProvider();
  }

  async checkHealth(): Promise<AIProviderStatus> {
    const startTime = Date.now();
    try {
      // If in browser and useProxy is true, ping our Next.js API endpoint
      const url = typeof window !== "undefined" && this.useProxy
        ? `/api/ai/health?url=${encodeURIComponent(this.baseUrl)}`
        : `${this.baseUrl}/api/tags`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const models: string[] = (data.models || []).map((m: { name: string }) => m.name);
      const latencyMs = Date.now() - startTime;

      const hasActiveModel = models.some(
        (m) => m === this.defaultModel || m.startsWith(this.defaultModel.split(":")[0])
      );
      const isVisionCapable = models.some(
        (m) => m.includes("llava") || m.includes("vision") || m.includes("moondream")
      );

      return {
        status: "online",
        providerName: this.name,
        activeModel: hasActiveModel ? this.defaultModel : models[0] || this.defaultModel,
        availableModels: models.length > 0 ? models : [this.defaultModel],
        latencyMs,
        message: models.length > 0
          ? `Connected to Ollama (${models.length} local model${models.length > 1 ? "s" : ""} detected)`
          : "Connected, but no models found. Run `ollama pull qwen2.5:3b` in your terminal.",
        isVisionCapable,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        status: "offline",
        providerName: this.name,
        activeModel: this.defaultModel,
        availableModels: [],
        latencyMs: Date.now() - startTime,
        message: `Ollama is offline or unreachable (${errorMsg}). Using offline field guide heuristics. To start Ollama: run 'ollama serve' in your terminal.`,
        isVisionCapable: false,
      };
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const url = typeof window !== "undefined" && this.useProxy
        ? `/api/ai/models?url=${encodeURIComponent(this.baseUrl)}`
        : `${this.baseUrl}/api/tags`;

      const res = await fetch(url, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map((m: { name: string }) => m.name);
    } catch {
      return [];
    }
  }

  async chat(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    options?: ChatRequestOptions
  ): Promise<string> {
    const modelToUse = options?.model || this.defaultModel;

    try {
      const systemPrompt = options?.systemPrompt ||
        "You are TerraQuest AI, an outdoor companion encouraging people to put their screens away and connect with real nature. Be concise, inspiring, scientifically accurate, and emphasize sensory awareness, respectful observation, and field safety. Warn against tasting unknown wild plants or fungi.";

      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
      ];

      const url = typeof window !== "undefined" && this.useProxy
        ? "/api/ai/chat"
        : `${this.baseUrl}/api/chat`;

      const body = typeof window !== "undefined" && this.useProxy
        ? {
            baseUrl: this.baseUrl,
            model: modelToUse,
            messages: formattedMessages,
            temperature: options?.temperature ?? 0.7,
          }
        : {
            model: modelToUse,
            messages: formattedMessages,
            stream: false,
            options: {
              temperature: options?.temperature ?? 0.7,
            },
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: options?.signal || AbortSignal.timeout(35000),
      });

      if (!res.ok) {
        throw new Error(`Ollama request failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.message?.content || data.response || "No response received from local model.";
    } catch (err) {
      console.warn("Ollama chat failed, using offline fallback:", err);
      return this.fallback.chat(messages, options);
    }
  }

  async identify(params: IdentificationParams): Promise<IdentificationResult> {
    // If vision model is available and image is present
    if (params.imageBase64) {
      try {
        const cleanBase64 = params.imageBase64.includes(",")
          ? params.imageBase64.split(",")[1]
          : params.imageBase64;

        const visionKeywords = ["moondream", "llava", "vision", "minicpm-v", "qwen2-vl", "bakllava"];
        const available = await this.listModels();

        // Check if selected model is vision capable, or find any installed vision model
        let visionModel: string | undefined = undefined;
        if (visionKeywords.some((vk) => this.defaultModel.toLowerCase().includes(vk))) {
          visionModel = this.defaultModel;
        } else {
          visionModel = available.find((m) =>
            visionKeywords.some((vk) => m.toLowerCase().includes(vk))
          );
        }

        if (visionModel) {
          // Construct rich context hints to guide high-confidence classification
          let contextHints = "";
          if (params.userObservations?.category && params.userObservations.category !== "all") {
            contextHints += ` The observer notes this specimen is likely a ${params.userObservations.category}.`;
          }
          if (params.userObservations?.colors && params.userObservations.colors.length > 0) {
            contextHints += ` Dominant colors observed in specimen: ${params.userObservations.colors.join(", ")}.`;
          }
          if (params.imageFileName && !params.imageFileName.startsWith("captured_specimen")) {
            contextHints += ` Specimen file name: ${params.imageFileName}.`;
          }
          if (params.userObservations?.additionalNotes) {
            contextHints += ` Observer field notes: "${params.userObservations.additionalNotes}".`;
          }

          const prompt =
            `You are an expert botanist, ornithologist, and field naturalist. Analyze this nature specimen image carefully.${contextHints}\n\n` +
            `Identify the species with high biological precision. Provide your answer strictly as a valid JSON object with the following schema:\n` +
            `{\n` +
            `  "speciesName": "Common name (e.g. Common Rose / Garden Rose, American Robin, Monarch Butterfly)",\n` +
            `  "scientificName": "Binomial nomenclature (e.g. Rosa gallica, Turdus migratorius)",\n` +
            `  "category": "plant" | "bird" | "tree" | "insect" | "fungi" | "mammal",\n` +
            `  "confidence": integer between 1 and 100,\n` +
            `  "distinguishingFeatures": ["key visual trait 1", "key visual trait 2", "key visual trait 3"],\n` +
            `  "habitat": "typical habitat description",\n` +
            `  "safetyNotes": "safety precautions or touching/handling advisory",\n` +
            `  "edibleWarning": "edible or toxic note (clearly warn if toxic or inedible)"\n` +
            `}`;

          const url = typeof window !== "undefined" && this.useProxy
            ? "/api/ai/chat"
            : `${this.baseUrl}/api/generate`;

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              baseUrl: this.baseUrl,
              model: visionModel,
              prompt,
              images: [cleanBase64],
              stream: false,
            }),
            signal: AbortSignal.timeout(45000),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.response || data.message?.content || "";
            // Attempt to parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return {
                speciesName: parsed.speciesName || "Candidate Species",
                scientificName: parsed.scientificName || "Taxon unknown",
                category: parsed.category || (params.userObservations?.category !== "all" ? params.userObservations?.category as any : "plant"),
                confidence: Number(parsed.confidence) || 82,
                isCertain: false,
                distinguishingFeatures: Array.isArray(parsed.distinguishingFeatures)
                  ? parsed.distinguishingFeatures
                  : ["Visual feature matching conducted via local vision model."],
                habitat: parsed.habitat || "Local ecosystem",
                safetyNotes: parsed.safetyNotes || "Observe without disturbing natural habitat.",
                edibleWarning: parsed.edibleWarning || "Do not consume unknown wild specimens.",
                fieldObservationTips: [
                  `Analyzed with local open-source vision model (${visionModel}).`,
                  "Examine specimen in daylight and check leaf attachment or feather plumage.",
                ],
                candidateAlternatives: [],
                modelUsed: visionModel,
                method: "vision-model",
              };
            }
          }
        }
      } catch (err) {
        console.warn("Vision model analysis failed, utilizing guided heuristic fallback:", err);
      }
    }

    // Default to guided heuristic analysis with database
    return this.fallback.identify(params);
  }

  async planAdventure(params: AdventurePlanParams): Promise<OutdoorMission> {
    try {
      const prompt = `Generate a structured outdoor mission plan in JSON for a user with these parameters:
Duration: ${params.durationMinutes} minutes
Difficulty: ${params.difficulty}
Activity: ${params.activityType}
Interests: ${params.interests.join(", ")}
Location: ${params.locationQuery || "local park/neighborhood"}
Accessibility needs: ${params.accessibilityNeeds || "none"}

Respond ONLY with valid JSON having the following schema:
{
  "title": string,
  "summary": string,
  "whatToBring": string[],
  "steps": string[],
  "checkpoints": [{"title": string, "description": string, "lookFor": string}],
  "educationalNugget": string,
  "safetyTip": string
}`;

      const res = await this.chat(
        [{ role: "user", content: prompt }],
        { temperature: 0.5 }
      );

      const jsonMatch = res.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          id: `mission-${Date.now()}`,
          title: parsed.title || "Custom Nature Mission",
          summary: parsed.summary || `A ${params.durationMinutes}-min outdoor journey.`,
          category: params.activityType,
          durationMinutes: params.durationMinutes,
          difficulty: params.difficulty,
          whatToBring: parsed.whatToBring || ["Comfortable shoes", "Water bottle"],
          steps: parsed.steps || ["Step outside and begin walking at a gentle pace."],
          checkpoints: parsed.checkpoints || [
            {
              title: "Canopy Checkpoint",
              description: "Look up and observe leaf architecture.",
              lookFor: "Branches and birds",
            },
          ],
          educationalNugget: parsed.educationalNugget || "Time outdoors lowers stress hormones.",
          safetyTip: parsed.safetyTip || "Watch footing and stay hydrated.",
          completed: false,
        };
      }
    } catch {
      // Fallback
    }

    return this.fallback.planAdventure(params);
  }

  async adviseGarden(params: GardenPlanParams): Promise<Partial<GardenProfile>> {
    return this.fallback.adviseGarden(params);
  }

  async generateReflection(params: ReflectionParams): Promise<string> {
    try {
      const prompt = `Write a mindful, encouraging post-exploration reflection for an outdoor explorer who just completed:
Mission: "${params.missionTitle}" (${params.durationMinutes} minutes screen-free)
Observed species: ${params.observedSpecies.join(", ") || "various local flora and fauna"}
Sensory notes recorded: "${params.sensoryNotes}"
Calmness rating: ${params.calmnessRating}/5

Highlight the physical and mental benefits of touching grass, putting the phone away, and being present in nature. Keep it under 150 words in markdown.`;

      return await this.chat([{ role: "user", content: prompt }], { temperature: 0.7 });
    } catch {
      return this.fallback.generateReflection(params);
    }
  }
}
