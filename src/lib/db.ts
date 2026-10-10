import Dexie, { type Table } from "dexie";
import {
  Observation,
  OutdoorMission,
  Challenge,
  Badge,
  GardenProfile,
  ChatMessage,
  UserPreferences,
} from "@/types";

export class TerraQuestDatabase extends Dexie {
  observations!: Table<Observation, string>;
  missions!: Table<OutdoorMission, string>;
  challenges!: Table<Challenge, string>;
  badges!: Table<Badge, string>;
  gardens!: Table<GardenProfile, string>;
  chatHistory!: Table<ChatMessage, string>;
  userPreferences!: Table<UserPreferences, string>;

  constructor() {
    super("TerraQuestDB");
    this.version(1).stores({
      observations: "id, category, speciesName, date, createdAt, verified",
      missions: "id, category, difficulty, completed",
      challenges: "id, code, category, completed",
      badges: "id, code, unlocked",
      gardens: "id, name",
      chatHistory: "id, timestamp, role",
      userPreferences: "id",
    });
  }
}

export const db = new TerraQuestDatabase();

// Initial Seed Data to ensure instant offline capability and rich first experience
export const INITIAL_USER_PREFERENCES: UserPreferences = {
  id: "default",
  name: "Nature Wanderer",
  experienceLevel: "Curious Beginner",
  interests: ["Birdwatching", "Native Flora", "Mindfulness", "Forest Bathing", "Urban Biodiversity"],
  favoriteEcosystems: ["Urban Park & Green Belt", "Deciduous Woodland"],
  preferredDifficulty: "Gentle Stroll",
  screenFreeGoalMinsPerWeek: 120,
  totalXp: 180,
  totalOutdoorMinutes: 45,
  completedMissionsCount: 1,
  soundEnabled: true,
  highContrastMode: false,
  reducedMotion: false,
  aiProvider: "ollama",
  ollamaBaseUrl: "http://localhost:11434",
  selectedModel: "qwen2.5:3b",
  temperature: 0.6,
  useProxy: true,
};

export const INITIAL_MISSIONS: OutdoorMission[] = [
  {
    id: "mission-sensory-walk",
    title: "The 20-Minute Sensory Nature Immersion",
    summary: "Put your phone in your pocket, breathe in the outdoor air, and tune your five senses to the immediate living world.",
    category: "mindfulness",
    durationMinutes: 20,
    difficulty: "Gentle Stroll",
    whatToBring: ["Comfortable walking shoes", "Pocket Mode on (phone away!)", "Optional field notebook"],
    steps: [
      "Select a walking loop in your neighborhood, local park, or backyard.",
      "Activate Pocket Mode to tuck your phone away.",
      "First 5 mins: Listen solely to sounds (wind through branches, distant birds, footsteps on earth).",
      "Next 5 mins: Notice natural colors and light patterns filtering through leaves.",
      "Next 5 mins: Notice scents (damp earth, pine needles, blossoming flowers).",
      "Final 5 mins: Stop and gently feel the texture of tree bark or stone without harming anything."
    ],
    checkpoints: [
      {
        title: "Sound Checkpoint",
        description: "Close your eyes for 30 seconds and count at least 3 distinct non-human sounds.",
        lookFor: "Rustling leaves, bird chirps, cricket song, flowing water"
      },
      {
        title: "Texture Checkpoint",
        description: "Touch the surface of a mature tree trunk.",
        lookFor: "Rough furrowed bark, soft patches of moss, or smooth papery bark"
      },
      {
        title: "Canopy Checkpoint",
        description: "Look straight up into tree crowns or sky.",
        lookFor: "Branch silhouettes, clouds moving, bird flight patterns"
      }
    ],
    educationalNugget: "Forest bathing (Shinrin-yoku) has been clinically proven to lower cortisol levels and heart rate within 15 minutes of immersive outdoor exposure.",
    safetyTip: "Stay on marked trails, be mindful of uneven ground and roots, and never touch unknown stinging plants.",
    completed: true,
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reflection: {
      observedSpecies: ["American Robin", "Common Dandelion", "White Oak"],
      sensoryNotes: "Heard two robins calling back and forth. Air smelled clean after rain. Felt grounded.",
      calmnessRating: 5,
      reflectionNotes: "Surprised how loud nature sounds once you intentionally tune out phone alerts."
    }
  },
  {
    id: "mission-avian-trio",
    title: "Avian Trio: Spot Three Neighborhood Birds",
    summary: "Slow your pace and spot three different bird species foraging, perching, or soaring.",
    category: "observe",
    durationMinutes: 30,
    difficulty: "Gentle Stroll",
    whatToBring: ["Binoculars if you have them", "Water bottle", "Eyes peeled for movement"],
    steps: [
      "Walk quietly toward trees, hedges, or edge habitats where birds feed.",
      "Watch for motion in the middle and upper canopy.",
      "Observe body shape, beak size, and flight silhouette before trying to name the bird.",
      "Listen for distinctive songs or contact calls."
    ],
    checkpoints: [
      {
        title: "Ground Forager",
        description: "Scan open lawn, leaf litter, or paths for hopping birds.",
        lookFor: "Robins, sparrows, starlings, or blackbirds hunting for worms and seeds"
      },
      {
        title: "Branch Percher",
        description: "Scan horizontal tree limbs for watchful songbirds.",
        lookFor: "Cardinals, chickadees, finches, or jays"
      },
      {
        title: "Sky Soarer",
        description: "Look up at open thermal sky.",
        lookFor: "Hawks, swifts, swallows, or gulls gliding overhead"
      }
    ],
    educationalNugget: "Birds vocalize differently for territorial proclamations (dawn chorus) versus sudden alarm calls (warning of cats or raptors).",
    safetyTip: "Maintain a respectful distance (minimum 5-10 meters); never approach active nests or fledglings.",
    completed: false
  },
  {
    id: "mission-leaf-architecture",
    title: "Leaf Morphology: Three Leaf Architectures",
    summary: "Discover the astonishing variety of botanical design right on your street or trail.",
    category: "walk",
    durationMinutes: 25,
    difficulty: "Gentle Stroll",
    whatToBring: ["Phone for photo capture only", "Curiosity"],
    steps: [
      "Examine three different plants or trees.",
      "Find one leaf with smooth margins (entire), one with saw-like edges (serrated), and one with deep lobes.",
      "Look at the underside to trace the leaf veins (parallel vs. netted branching)."
    ],
    checkpoints: [
      {
        title: "Lobed Leaf",
        description: "Find a leaf with deep indents creating finger-like lobes.",
        lookFor: "Oaks, maples, dandelions"
      },
      {
        title: "Serrated Leaf",
        description: "Find a leaf with fine teeth along the outer border.",
        lookFor: "Birch, cherry, nettle, blackberry"
      },
      {
        title: "Smooth Margin Leaf",
        description: "Find a leaf with unbroken, smooth edges.",
        lookFor: "Dogwood, lilac, magnolia"
      }
    ],
    educationalNugget: "Leaf margins are an evolutionary adaptation! Serrated leaves often begin photosynthesizing earlier in cold spring conditions.",
    safetyTip: "Remember 'Leaves of three, let it be' to steer clear of poison ivy.",
    completed: false
  },
  {
    id: "mission-micro-ecosystem",
    title: "Nurse Log & Micro-Wilderness",
    summary: "Kneel down beside a fallen log, mossy rock, or garden bed and discover a whole hidden universe.",
    category: "observe",
    durationMinutes: 15,
    difficulty: "Gentle Stroll",
    whatToBring: ["A magnifying glass or your eyes up close"],
    steps: [
      "Find a decomposing fallen branch or moss-covered boulder.",
      "Look closely at the tiny textures: lichens, moss sporangia, tiny fungi.",
      "Watch for small decomposers: woodlice, beetles, millipedes."
    ],
    checkpoints: [
      {
        title: "Moss Forest",
        description: "View moss as a miniature ancient rainforest.",
        lookFor: "Vibrant emerald green carpet and tiny spore capsules on hair-like stalks"
      },
      {
        title: "Lichen Symbiosis",
        description: "Find crusty or leafy patches growing on stone or bark.",
        lookFor: "Lichen (a partnership between fungi and algae/cyanobacteria)"
      }
    ],
    educationalNugget: "Lichens are exceptional bio-indicators of clean air; they cannot survive in heavily polluted atmospheres.",
    safetyTip: "Leave logs and stones gently in place; do not destroy wildlife habitats.",
    completed: false
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "chal-observe-birds",
    code: "OBSERVE_3_BIRDS",
    title: "Avian Trio",
    description: "Observe and identify 3 different bird species in the wild.",
    category: "fauna",
    xp: 60,
    badgeCode: "AVIAN_APPRENTICE",
    targetCount: 3,
    currentCount: 1,
    completed: false,
    iconName: "Feather"
  },
  {
    id: "chal-20-min-screenfree",
    code: "SCREENFREE_20MIN",
    title: "The Silent Stroll",
    description: "Spend 20 consecutive minutes outdoors without scrolling or checking notifications.",
    category: "mindfulness",
    xp: 50,
    badgeCode: "GRASS_TOUCHER",
    targetCount: 1,
    currentCount: 1,
    completed: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    iconName: "SmartphoneOff"
  },
  {
    id: "chal-identify-plants",
    code: "IDENTIFY_5_PLANTS",
    title: "Botanical Eye",
    description: "Identify 5 native or common plants and notice their distinctive leaf shapes.",
    category: "flora",
    xp: 75,
    badgeCode: "FLORA_DETECTIVE",
    targetCount: 5,
    currentCount: 2,
    completed: false,
    iconName: "Sprout"
  },
  {
    id: "chal-15min-walk",
    code: "WALK_15MIN_DETAILS",
    title: "Microscope Walk",
    description: "Take a 15-minute walk and observe 5 minute natural details (bark, moss, seed pods).",
    category: "observation",
    xp: 40,
    badgeCode: "NATURE_OBSERVER",
    targetCount: 5,
    currentCount: 5,
    completed: true,
    unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    iconName: "Compass"
  },
  {
    id: "chal-leaf-shapes",
    code: "LEAF_SHAPES_3",
    title: "Leaf Architect",
    description: "Find and document 3 different leaf structures: lobed, serrated, and smooth margin.",
    category: "flora",
    xp: 45,
    badgeCode: "LEAF_SCHOLAR",
    targetCount: 3,
    currentCount: 1,
    completed: false,
    iconName: "Leaf"
  },
  {
    id: "chal-water-growth",
    code: "WATER_AND_RECORD",
    title: "Tender Care",
    description: "Water a garden or house plant and record a note on its growth.",
    category: "gardening",
    xp: 30,
    badgeCode: "SOIL_TENDER",
    targetCount: 1,
    currentCount: 1,
    completed: true,
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
    iconName: "Droplets"
  },
  {
    id: "chal-neighborhood-walk",
    code: "NEIGHBORHOOD_TREK",
    title: "Neighborhood Wanderer",
    description: "Complete a mindful outdoor loop through your neighborhood nature.",
    category: "observation",
    xp: 35,
    badgeCode: "TRAIL_BLAZER",
    targetCount: 1,
    currentCount: 1,
    completed: true,
    unlockedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    iconName: "Footprints"
  },
  {
    id: "chal-pollinator-spot",
    code: "POLLINATOR_WATCH",
    title: "Bee & Butterfly Watch",
    description: "Sit quietly near blossoms and watch wild pollinators at work for 10 minutes.",
    category: "fauna",
    xp: 50,
    badgeCode: "POLLINATOR_ALLY",
    targetCount: 1,
    currentCount: 0,
    completed: false,
    iconName: "Sparkles"
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "badge-grass-toucher",
    code: "GRASS_TOUCHER",
    title: "First Steps in Grass",
    description: "Successfully put your screen away and spent time completely offline outdoors.",
    iconName: "Trees",
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    xpReward: 50,
  },
  {
    id: "badge-avian-apprentice",
    code: "AVIAN_APPRENTICE",
    title: "Avian Apprentice",
    description: "Spotted and listened to 3 different songbird species.",
    iconName: "Feather",
    unlocked: false,
    xpReward: 60,
  },
  {
    id: "badge-flora-detective",
    code: "FLORA_DETECTIVE",
    title: "Flora Detective",
    description: "Identified 5 wild or cultivated plants with distinguishing marks.",
    iconName: "Sprout",
    unlocked: false,
    xpReward: 75,
  },
  {
    id: "badge-nature-observer",
    code: "NATURE_OBSERVER",
    title: "Eagle Eye Naturalist",
    description: "Noticed 5 intricate natural details during a single outdoor journey.",
    iconName: "Eye",
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    xpReward: 40,
  },
  {
    id: "badge-soil-tender",
    code: "SOIL_TENDER",
    title: "Guardian of the Soil",
    description: "Created a garden plan and nurtured outdoor plants.",
    iconName: "Flower2",
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
    xpReward: 30,
  },
  {
    id: "badge-trail-blazer",
    code: "TRAIL_BLAZER",
    title: "Earth Wanderer",
    description: "Explored neighborhood trails and nature pockets on foot.",
    iconName: "MapPin",
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    xpReward: 35,
  },
  {
    id: "badge-pollinator-ally",
    code: "POLLINATOR_ALLY",
    title: "Pollinator Ally",
    description: "Spent quiet time observing and protecting wild insect pollinators.",
    iconName: "Sparkles",
    unlocked: false,
    xpReward: 50,
  }
];

export const INITIAL_OBSERVATIONS: Observation[] = [
  {
    id: "obs-robin",
    title: "American Robin Singing at Dawn",
    speciesName: "American Robin",
    scientificName: "Turdus migratorius",
    category: "bird",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    locationName: "Maple Grove Community Park",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    notes: "Perched high on an oak limb caroling vigorously. Brick-red breast clearly illuminated by morning sunrise. Hopped onto the damp lawn hunting for earthworms.",
    confidence: 96,
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    verified: true,
    tags: ["Dawn chorus", "Songbird", "Park", "Backyard"],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "obs-dandelion",
    title: "Common Dandelion in Seed Clock",
    speciesName: "Common Dandelion",
    scientificName: "Taraxacum officinale",
    category: "plant",
    date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    locationName: "Meadow Path Trailhead",
    coordinates: { lat: 40.7145, lng: -74.0082 },
    notes: "Perfect spherical pappus clock ready for wind dispersal. Lion-toothed basal leaves flat against soil. Noticed a solitary bee feeding on a nearby fresh flower head.",
    confidence: 99,
    verified: true,
    tags: ["Wildflower", "Pollinator food", "Seed clock"],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "obs-white-oak",
    title: "Mature White Oak Canopy",
    speciesName: "White Oak",
    scientificName: "Quercus alba",
    category: "tree",
    date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
    locationName: "Woodland Heritage Trail",
    coordinates: { lat: 40.7162, lng: -74.0041 },
    notes: "Magnificent ancient tree with rounded leaf lobes (no bristles). Bark had characteristic ash-gray scaly plates. Black-capped chickadees were inspecting the upper branches.",
    confidence: 94,
    verified: true,
    tags: ["Keystone tree", "Ancient canopy", "Deciduous"],
    createdAt: Date.now() - 86400000 * 4,
  }
];

export const INITIAL_GARDEN: GardenProfile = {
  id: "garden-default",
  name: "Balcony & Window Pollinator Haven",
  climateZone: "Temperate Zone 6-7",
  sunlight: "Partial Sun (3-6 hrs)",
  soilType: "Potting Mix / Raised Bed",
  spaceType: "Balcony Pots",
  focusGoal: "Pollinators & Wildlife",
  plants: [
    {
      id: "plant-lavender",
      name: "English Lavender",
      scientificName: "Lavandula angustifolia",
      category: "herb",
      waterFrequencyDays: 5,
      sunRequirement: "Full sun to partial",
      plantingSeason: "Spring",
      harvestOrBloomSeason: "Summer to early Autumn",
      companionPlants: ["Rosemary", "Thyme", "Coneflowers"],
      careTips: "Requires excellent drainage. Do not overwater. Prune lightly after blooming.",
      plantedDate: new Date(Date.now() - 86400000 * 14).toISOString().split("T")[0],
    },
    {
      id: "plant-echinacea",
      name: "Purple Coneflower",
      scientificName: "Echinacea purpurea",
      category: "native_wildflower",
      waterFrequencyDays: 4,
      sunRequirement: "Full sun preferred",
      plantingSeason: "Spring",
      harvestOrBloomSeason: "Midsummer through Frost",
      companionPlants: ["Black-eyed Susan", "Salvia", "Milkweed"],
      careTips: "Extremely hardy native. Leave seed heads in late autumn for feeding goldfinches.",
      plantedDate: new Date(Date.now() - 86400000 * 21).toISOString().split("T")[0],
    },
    {
      id: "plant-sweet-basil",
      name: "Sweet Genovese Basil",
      scientificName: "Ocimum basilicum",
      category: "herb",
      waterFrequencyDays: 2,
      sunRequirement: "Warm sunny windowsill or patio",
      plantingSeason: "Late Spring after frost",
      harvestOrBloomSeason: "Summer",
      companionPlants: ["Tomatoes", "Marigolds", "Peppers"],
      careTips: "Pinch flower buds to prolong leafy growth. Water at soil level, avoiding wet leaves.",
      plantedDate: new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
    }
  ],
  seasonalTasks: [
    {
      id: "task-spring-seed",
      season: "Spring",
      title: "Sow pollinator-friendly seeds",
      description: "Plant native wildflower seeds in potting containers after danger of hard frost passes.",
      done: true,
    },
    {
      id: "task-summer-water",
      season: "Summer",
      title: "Morning deep watering & mulch",
      description: "Water early in the morning before heat rises. Add light bark mulch to retain moisture.",
      done: false,
    },
    {
      id: "task-autumn-seeds",
      season: "Autumn",
      title: "Leave dried seedheads for birds",
      description: "Do not cut down coneflower or sunflower seed stalks; they serve as critical winter bird food.",
      done: false,
    },
    {
      id: "task-winter-shelter",
      season: "Winter",
      title: "Winter pot insulation",
      description: "Wrap ceramic balcony pots with burlap or move close to house wall to protect root systems from deep freeze.",
      done: false,
    }
  ]
};

// Database Initializer helper that seeds data if tables are empty
export async function initializeDatabase() {
  if (typeof window === "undefined") return;

  try {
    const prefsCount = await db.userPreferences.count();
    if (prefsCount === 0) {
      await db.userPreferences.add(INITIAL_USER_PREFERENCES);
    }

    const missionsCount = await db.missions.count();
    if (missionsCount === 0) {
      await db.missions.bulkAdd(INITIAL_MISSIONS);
    }

    const challengesCount = await db.challenges.count();
    if (challengesCount === 0) {
      await db.challenges.bulkAdd(INITIAL_CHALLENGES);
    }

    const badgesCount = await db.badges.count();
    if (badgesCount === 0) {
      await db.badges.bulkAdd(INITIAL_BADGES);
    }

    const obsCount = await db.observations.count();
    if (obsCount === 0) {
      await db.observations.bulkAdd(INITIAL_OBSERVATIONS);
    }

    const gardenCount = await db.gardens.count();
    if (gardenCount === 0) {
      await db.gardens.add(INITIAL_GARDEN);
    }
  } catch (err) {
    console.warn("IndexedDB initialization note:", err);
  }
}
