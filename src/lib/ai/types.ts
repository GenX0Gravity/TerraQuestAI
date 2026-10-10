import { IdentificationResult, OutdoorMission, GardenProfile } from "@/types";

export interface AIProviderStatus {
  status: "online" | "offline" | "fallback";
  providerName: string;
  activeModel: string;
  availableModels: string[];
  latencyMs?: number;
  message?: string;
  isVisionCapable?: boolean;
}

export interface ChatRequestOptions {
  model?: string;
  temperature?: number;
  systemPrompt?: string;
  signal?: AbortSignal;
}

export interface AdventurePlanParams {
  durationMinutes: number;
  difficulty: "Gentle Stroll" | "Moderate Exploration" | "Active Trek";
  activityType: "walk" | "observe" | "garden" | "mindfulness" | "challenge" | "photography";
  interests: string[];
  locationQuery?: string;
  accessibilityNeeds?: string;
}

export interface IdentificationParams {
  imageBase64?: string;
  imageFileName?: string;
  userObservations?: {
    category?: string;
    colors?: string[];
    leafOrFeatherShape?: string;
    size?: string;
    habitat?: string;
    additionalNotes?: string;
  };
}

export interface ReflectionParams {
  missionTitle: string;
  durationMinutes: number;
  observedSpecies: string[];
  sensoryNotes: string;
  calmnessRating: number;
}

export interface GardenPlanParams {
  climateZone: string;
  sunlight: string;
  soilType: string;
  spaceType: string;
  focusGoal: string;
  currentPlants?: string[];
}

export interface AIProvider {
  name: string;
  chat(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    options?: ChatRequestOptions
  ): Promise<string>;
  identify(params: IdentificationParams): Promise<IdentificationResult>;
  planAdventure(params: AdventurePlanParams): Promise<OutdoorMission>;
  adviseGarden(params: GardenPlanParams): Promise<Partial<GardenProfile>>;
  generateReflection(params: ReflectionParams): Promise<string>;
  checkHealth(): Promise<AIProviderStatus>;
  listModels(): Promise<string[]>;
}
