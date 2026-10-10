// Core Types for TerraQuest AI

export type SpeciesCategory = 'bird' | 'plant' | 'tree' | 'insect' | 'fungi' | 'mammal' | 'other';

export interface SpeciesRecord {
  id: string;
  commonName: string;
  scientificName: string;
  category: SpeciesCategory;
  family: string;
  habitat: string;
  distinguishingFeatures: string[];
  safetyNotes?: string;
  edibleWarning?: string;
  callDescription?: string;
  nativeRegions: string[];
  seasonalAvailability: string[];
  confidence?: number;
  imageUrl?: string;
  conservationStatus?: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered';
}

export interface Observation {
  id: string;
  title: string;
  speciesName: string;
  scientificName?: string;
  category: SpeciesCategory;
  date: string; // ISO date
  locationName?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes: string;
  confidence?: number; // 0-100
  imageUrl?: string;
  verified: boolean;
  tags: string[];
  createdAt: number;
}

export interface OutdoorMission {
  id: string;
  title: string;
  summary: string;
  category: 'walk' | 'observe' | 'garden' | 'mindfulness' | 'challenge' | 'photography';
  durationMinutes: number;
  difficulty: 'Gentle Stroll' | 'Moderate Exploration' | 'Active Trek';
  whatToBring: string[];
  steps: string[];
  checkpoints: {
    title: string;
    description: string;
    lookFor: string;
  }[];
  educationalNugget: string;
  safetyTip: string;
  completed: boolean;
  completedAt?: string;
  reflection?: {
    observedSpecies: string[];
    sensoryNotes: string;
    calmnessRating: number; // 1-5
    reflectionNotes: string;
  };
}

export interface Challenge {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'observation' | 'mindfulness' | 'flora' | 'fauna' | 'gardening';
  xp: number;
  badgeCode: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  unlockedAt?: string;
  iconName: string;
}

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface GardenProfile {
  id: string;
  name: string;
  climateZone: string; // e.g. "Temperate Zone 6-7", "Mediterranean", "Subtropical", etc.
  sunlight: 'Full Sun (6+ hrs)' | 'Partial Sun (3-6 hrs)' | 'Shady (<3 hrs)';
  soilType: 'Loamy (Balanced)' | 'Sandy (Fast draining)' | 'Clay (Moisture retentive)' | 'Potting Mix / Raised Bed';
  spaceType: 'Balcony Pots' | 'Window Box' | 'Patio Container' | 'Raised Garden Bed' | 'Backyard Plot';
  focusGoal: 'Pollinators & Wildlife' | 'Herbs & Kitchen Greens' | 'Native Wildflowers' | 'Low Maintenance Oasis';
  plants: GardenPlant[];
  seasonalTasks: GardenTask[];
}

export interface GardenPlant {
  id: string;
  name: string;
  scientificName?: string;
  category: 'herb' | 'flower' | 'vegetable' | 'shrub' | 'native_wildflower';
  waterFrequencyDays: number;
  sunRequirement: string;
  plantingSeason: string;
  harvestOrBloomSeason: string;
  companionPlants: string[];
  careTips: string;
  plantedDate?: string;
}

export interface GardenTask {
  id: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  title: string;
  description: string;
  done: boolean;
}

export interface UserPreferences {
  id: string;
  name: string;
  experienceLevel: 'Curious Beginner' | 'Amateur Naturalist' | 'Experienced Explorer';
  interests: string[];
  favoriteEcosystems: string[];
  preferredDifficulty: 'Gentle Stroll' | 'Moderate Exploration' | 'Active Trek';
  screenFreeGoalMinsPerWeek: number;
  totalXp: number;
  totalOutdoorMinutes: number;
  completedMissionsCount: number;
  soundEnabled: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
  // AI Config
  aiProvider: 'ollama' | 'fallback' | 'custom';
  ollamaBaseUrl: string;
  selectedModel: string;
  customApiUrl?: string;
  customApiKey?: string;
  temperature: number;
  useProxy: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  isOfflineFallback?: boolean;
}

export interface IdentificationResult {
  speciesName: string;
  scientificName: string;
  category: SpeciesCategory;
  confidence: number; // 0 - 100
  isCertain: boolean;
  distinguishingFeatures: string[];
  habitat: string;
  safetyNotes?: string;
  edibleWarning?: string;
  fieldObservationTips: string[];
  candidateAlternatives: {
    speciesName: string;
    scientificName: string;
    howToDistinguish: string;
  }[];
  modelUsed: string;
  method: 'vision-model' | 'guided-heuristic' | 'local-taxonomy';
}
