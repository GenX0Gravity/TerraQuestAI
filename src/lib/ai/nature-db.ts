import { SpeciesRecord } from "@/types";

export const NATURE_DATABASE: SpeciesRecord[] = [
  // --- BIRDS ---
  {
    id: "bird-robin-american",
    commonName: "American Robin",
    scientificName: "Turdus migratorius",
    category: "bird",
    family: "Turdidae (Thrushes)",
    habitat: "Lawns, woodlands, suburban parks, open forests",
    distinguishingFeatures: [
      "Brick-red to warm orange breast",
      "Dark gray to charcoal upperparts",
      "White eye arcs broken into two segments",
      "Yellow beak with slight dark tip"
    ],
    callDescription: "Rich, liquid caroling song: 'cheerily, cheer up, cheer up, cheerily'",
    nativeRegions: ["North America"],
    seasonalAvailability: ["Year-round", "Spring", "Summer"],
    safetyNotes: "Harmless backyard songbird. Essential seed disperser and worm forager.",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bird-robin-european",
    commonName: "European Robin",
    scientificName: "Erithacus rubecula",
    category: "bird",
    family: "Muscicapidae (Old World Flycatchers)",
    habitat: "Gardens, hedgerows, deciduous woodlands, parks",
    distinguishingFeatures: [
      "Bright orange-red breast and forehead edged with light gray",
      "Olive-brown back and wings",
      "Large dark soulful eyes adapted for low light",
      "Plump, rounded posture with jaunty cocked tail"
    ],
    callDescription: "Melodious, rippling warble; sharp 'tic-tic-tic' alarm call",
    nativeRegions: ["Europe", "Western Asia", "North Africa"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Friendly and territorial garden companion. Often follows gardeners turning soil.",
    conservationStatus: "Least Concern",
    imageUrl: "https://images.unsplash.com/photo-1551085254-e96b210df58a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bird-black-capped-chickadee",
    commonName: "Black-capped Chickadee",
    scientificName: "Poecile atricapillus",
    category: "bird",
    family: "Paridae (Tits/Chickadees)",
    habitat: "Deciduous and mixed forests, backyards, parks",
    distinguishingFeatures: [
      "Distinctive jet-black cap and bib",
      "Contrasting crisp white cheeks",
      "Soft buffy-tan flanks and light gray back",
      "Short stout black beak for cracking seeds"
    ],
    callDescription: "Celebrated 'chick-a-dee-dee-dee' alarm and whistled 'fee-bee' spring song",
    nativeRegions: ["North America"],
    seasonalAvailability: ["Year-round", "Winter resilient"],
    safetyNotes: "Curious and fearless; will often visit bird feeders right near human observers.",
    conservationStatus: "Least Concern"
  },
  {
    id: "bird-blue-jay",
    commonName: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    category: "bird",
    family: "Corvidae (Crows & Jays)",
    habitat: "Oak and pine woodlands, suburban edges, city parks",
    distinguishingFeatures: [
      "Prominent blue crest that raises or flattens with mood",
      "Brilliant blue, black, and white checkered wing patterns",
      "Black necklace around throat and back of neck",
      "Stout bill capable of hammering acorns open"
    ],
    callDescription: "Loud, harsh 'jay! jay!' scream; uncanny mimicry of Red-tailed Hawk whistles",
    nativeRegions: ["Eastern & Central North America"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Highly intelligent forest sentinel; sounds alerts that warn other animals of predators.",
    conservationStatus: "Least Concern"
  },
  {
    id: "bird-cardinal-northern",
    commonName: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    category: "bird",
    family: "Cardinalidae",
    habitat: "Forest edges, shrubby gardens, overgrown brush",
    distinguishingFeatures: [
      "Males brilliant scarlet red; females warm fawn-brown with reddish highlights",
      "Prominent tall crest on crown",
      "Black mask surrounding the thick coral-red cone bill",
      "Long tail with rounded end"
    ],
    callDescription: "Loud, clear whistled 'what-cheer, what-cheer, whoit-whoit-whoit'",
    nativeRegions: ["North America"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Pairs often mate for life and defend garden territories together.",
    conservationStatus: "Least Concern"
  },
  {
    id: "bird-barn-owl",
    commonName: "Barn Owl",
    scientificName: "Tyto alba",
    category: "bird",
    family: "Tytonidae",
    habitat: "Old barns, hollow trees, meadows, agricultural valleys",
    distinguishingFeatures: [
      "Ghostly heart-shaped white facial disc",
      "Golden-buff upperparts speckled with silvery gray",
      "Silent flight feathers with serrated edges",
      "Dark obsidian eyes"
    ],
    callDescription: "Eerie raspy shriek or hiss rather than a typical hoot",
    nativeRegions: ["Worldwide except polar and desert regions"],
    seasonalAvailability: ["Year-round nocturnal"],
    safetyNotes: "Vital natural rodent predator. Please avoid using rodenticides that cause secondary poisoning.",
    conservationStatus: "Least Concern"
  },
  {
    id: "bird-red-tailed-hawk",
    commonName: "Red-tailed Hawk",
    scientificName: "Buteo jamaicensis",
    category: "bird",
    family: "Accipitridae (Hawks)",
    habitat: "Open country, highway verges, field margins, telephone poles",
    distinguishingFeatures: [
      "Broad, rounded wings and short wide tail",
      "Rich cinnamon-red upper tail surface in adults",
      "Dark 'belly band' streaks across creamy white breast",
      "Sharp hooked yellow cere bill"
    ],
    callDescription: "Piercing, raspy descending scream: 'kreeeee-aaaarh'",
    nativeRegions: ["North & Central America"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Top raptor. Observe from distance with binoculars; do not disturb nesting trees.",
    conservationStatus: "Least Concern"
  },

  // --- PLANTS & WILDFLOWERS ---
  {
    id: "plant-common-dandelion",
    commonName: "Common Dandelion",
    scientificName: "Taraxacum officinale",
    category: "plant",
    family: "Asteraceae (Daisy Family)",
    habitat: "Lawns, meadows, disturbed soil, trailsides",
    distinguishingFeatures: [
      "Bright golden-yellow composite flower head composed entirely of ray florets",
      "Deeply toothed, lion-tooth basal leaves forming a rosette",
      "Hollow milky-sapped flowering stem",
      "Matures into a delicate spherical seed clock dispersed by wind"
    ],
    nativeRegions: ["Cosmopolitan / Worldwide"],
    seasonalAvailability: ["Spring", "Summer", "Autumn"],
    edibleWarning: "Common edible herb, BUT never harvest from roadsides, golf courses, or lawns treated with synthetic pesticides or herbicides.",
    safetyNotes: "Crucial early-spring nectar source for waking bumblebees and solitary bees.",
    conservationStatus: "Least Concern"
  },
  {
    id: "plant-broadleaf-plantain",
    commonName: "Broadleaf Plantain",
    scientificName: "Plantago major",
    category: "plant",
    family: "Plantaginaceae",
    habitat: "Compacted trail soil, footpaths, lawn edges",
    distinguishingFeatures: [
      "Broad, oval, ribbed leaves with 5-9 parallel veins running from base to tip",
      "Elastic, string-like fibers inside leaf petioles",
      "Upright central spike covered in tiny greenish-brown flowers and seeds",
      "Low flat rosette hugging the ground"
    ],
    nativeRegions: ["Eurasia / Naturalized globally"],
    seasonalAvailability: ["Spring", "Summer", "Autumn"],
    safetyNotes: "Historic 'footprint plant' resilient to foot traffic. Traditionally used as a soothing poultice for insect stings.",
    conservationStatus: "Least Concern"
  },
  {
    id: "plant-poison-ivy",
    commonName: "Poison Ivy",
    scientificName: "Toxicodendron radicans",
    category: "plant",
    family: "Anacardiaceae",
    habitat: "Forest borders, trail fringes, riverbanks, climbing on trees",
    distinguishingFeatures: [
      "LEAVES OF THREE: Compound leaf with three leaflets (middle leaflet has longer stalk)",
      "Leaflet margins can be smooth, toothed, or lobed; often glossy or reddish in spring",
      "Hairy aerial rootlets when climbing tree trunks",
      "Dull white to greenish berries in late summer and autumn"
    ],
    nativeRegions: ["North America"],
    seasonalAvailability: ["Spring", "Summer", "Autumn"],
    safetyNotes: "⚠️ CRITICAL CONTACT HAZARD: Contains urushiol oil causing severe blistering allergic contact dermatitis. DO NOT TOUCH. Remember: 'Leaves of three, let it be; hairy vine, no friend of mine.' Never burn poison ivy as inhaled smoke causes lung trauma.",
    conservationStatus: "Least Concern"
  },
  {
    id: "plant-giant-hogweed",
    commonName: "Giant Hogweed",
    scientificName: "Heracleum mantegazzianum",
    category: "plant",
    family: "Apiaceae (Carrot Family)",
    habitat: "Riverbanks, roadside ditches, moist woods",
    distinguishingFeatures: [
      "Colossal size reaching 2 to 5 meters tall",
      "Massive deeply incised, sharply jagged leaves up to 1-1.5 meters wide",
      "Hollow stems with dark purple blotches and stiff bristles",
      "Giant umbrella-shaped white flower clusters up to 80cm across"
    ],
    nativeRegions: ["Caucasus / Invasive in Europe & North America"],
    seasonalAvailability: ["Summer"],
    safetyNotes: "⚠️ EXTREME HEALTH HAZARD: Sap contains furocoumarins causing severe phytophotodermatitis (third-degree blistering burns when exposed to sunlight) and permanent blindness if in eyes. Report immediately to local authorities; DO NOT approach.",
    conservationStatus: "Least Concern"
  },
  {
    id: "plant-foxglove",
    commonName: "Common Foxglove",
    scientificName: "Digitalis purpurea",
    category: "plant",
    family: "Plantaginaceae",
    habitat: "Woodland clearings, heaths, garden borders",
    distinguishingFeatures: [
      "Tall, stately spire of tubular, downward-drooping bell flowers",
      "Colors range from purple-pink to cream with spotted dark interiors",
      "Softly hairy, wrinkled downy leaves in first-year rosette",
      "Spire blooms sequentially from bottom to top"
    ],
    nativeRegions: ["Europe"],
    seasonalAvailability: ["Summer"],
    safetyNotes: "⚠️ LETHALLY TOXIC: All parts of the plant contain cardiac glycosides (digitoxin and digoxin). Ingestion causes fatal cardiac arrhythmias. Never taste, chew, or allow pets to ingest.",
    conservationStatus: "Least Concern"
  },
  {
    id: "plant-wild-blackberry",
    commonName: "Wild Bramble / Blackberry",
    scientificName: "Rubus fruticosus agg.",
    category: "plant",
    family: "Rosaceae (Rose Family)",
    habitat: "Hedgerows, scrubland, woodland edges, trail borders",
    distinguishingFeatures: [
      "Arching canes armed with sharp recurved prickles",
      "Palmate leaves with 3 to 5 serrated leaflets",
      "White to blush-pink 5-petaled flowers in early summer",
      "Aggregate black fleshy drupelets ripening from red to glossy black"
    ],
    nativeRegions: ["Europe, North America, Temperate Asia"],
    seasonalAvailability: ["Late Summer", "Early Autumn"],
    edibleWarning: "Edible fruit when ripe. Avoid low fruit near dog walking paths or busy exhaust roads. Wear thorn-proof gloves.",
    safetyNotes: "Important wildlife habitat providing thorny shelter for hedgehogs, warblers, and butterflies.",
    conservationStatus: "Least Concern"
  },
  {
    id: "plant-purple-coneflower",
    commonName: "Purple Coneflower",
    scientificName: "Echinacea purpurea",
    category: "plant",
    family: "Asteraceae",
    habitat: "Prairies, open woods, sunny pollinator gardens",
    distinguishingFeatures: [
      "Prominent spiky orange-brown central cone (resembling a hedgehog)",
      "Drooping magenta-pink to lavender ray petals",
      "Rough, sandpapery lance-shaped leaves",
      "Stout, bristly upright stems"
    ],
    nativeRegions: ["North America"],
    seasonalAvailability: ["Summer", "Autumn"],
    safetyNotes: "Superb native garden pollinator plant. Goldfinches flock to the dried seed cones in autumn and winter.",
    conservationStatus: "Least Concern"
  },

  // --- TREES ---
  {
    id: "tree-white-oak",
    commonName: "White Oak",
    scientificName: "Quercus alba",
    category: "tree",
    family: "Fagaceae (Beech/Oak Family)",
    habitat: "Deciduous upland forests, ridge tops, river valleys",
    distinguishingFeatures: [
      "Leaves have 7 to 9 rounded finger-like lobes with NO bristled tips",
      "Light ash-gray bark with shallow fissures and overlapping scaly plates",
      "Acorns have shallow bumpy caps; mature in a single season",
      "Magnificent spreading canopy that can live for over 300 years"
    ],
    nativeRegions: ["Eastern North America"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Keystone species! Supports hundreds of species of caterpillars, birds, squirrels, and mycorrhizal fungi.",
    conservationStatus: "Least Concern"
  },
  {
    id: "tree-sugar-maple",
    commonName: "Sugar Maple",
    scientificName: "Acer saccharum",
    category: "tree",
    family: "Sapindaceae",
    habitat: "Hardwood forests, cool moist soils, northern slopes",
    distinguishingFeatures: [
      "Palmate 5-lobed leaves with U-shaped sinuses between lobes",
      "Leaf teeth are smooth and blunt compared to Red Maple",
      "Brilliant fiery autumn foliage transitioning from yellow to vivid orange and scarlet",
      "Winged paired seeds (samaras / 'helicopters') that twirl when falling"
    ],
    nativeRegions: ["Northeastern North America"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Source of true maple syrup tapped in early spring thaw.",
    conservationStatus: "Least Concern"
  },
  {
    id: "tree-silver-birch",
    commonName: "Silver Birch",
    scientificName: "Betula pendula",
    category: "tree",
    family: "Betulaceae",
    habitat: "Heaths, woodlands, gravelly soils, urban parks",
    distinguishingFeatures: [
      "Striking papery white bark that peels horizontally with age, showing dark rough fissures at base",
      "Graceful pendulous, drooping twigs",
      "Small triangular to diamond-shaped leaves with doubly serrated margins",
      "Yellow autumn foliage and drooping catkins"
    ],
    nativeRegions: ["Europe, Northern Asia"],
    seasonalAvailability: ["Year-round"],
    safetyNotes: "Pioneer tree that enriches soil with leaf litter and supports over 300 insect species.",
    conservationStatus: "Least Concern"
  },

  // --- INSECTS & POLLINATORS ---
  {
    id: "insect-monarch-butterfly",
    commonName: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    category: "insect",
    family: "Nymphalidae",
    habitat: "Milkweed meadows, sunny gardens, coastal migration paths",
    distinguishingFeatures: [
      "Deep orange wings crisscrossed with bold black veins",
      "Double row of crisp white dots along the black wing margins",
      "Males have a black scent patch (androconium) on each hindwing",
      "Caterpillars have vivid white, black, and yellow horizontal rings"
    ],
    nativeRegions: ["Americas / Oceanic dispersal"],
    seasonalAvailability: ["Summer", "Early Autumn"],
    safetyNotes: "Caterpillars feed exclusively on milkweed (Asclepias), sequestering cardenolides that make them toxic to avian predators. Plant native milkweed to support their epic multi-generational migration.",
    conservationStatus: "Vulnerable"
  },
  {
    id: "insect-bumblebee-buff-tailed",
    commonName: "Buff-tailed Bumblebee",
    scientificName: "Bombus terrestris",
    category: "insect",
    family: "Apidae",
    habitat: "Gardens, hedgerows, meadows, woodland edges",
    distinguishingFeatures: [
      "Large, fuzzy body with dense black and dirty-yellow bands",
      "Distinctive buff or dirty-white tail tip in queens",
      "Vigorous 'buzz pollination' shaking pollen free from tomato and heather flowers",
      "Gentle temperament when foraging"
    ],
    callDescription: "Low, resonant harmonic buzzing when flying or vibrating pollen anthers",
    nativeRegions: ["Europe, Mediterranean"],
    seasonalAvailability: ["Early Spring to Autumn"],
    safetyNotes: "Peaceful wild pollinator. Will only sting if stepped on or nest is directly attacked. Essential for outdoor ecosystem health.",
    conservationStatus: "Least Concern"
  },

  // --- FUNGI ---
  {
    id: "fungi-turkey-tail",
    commonName: "Turkey Tail",
    scientificName: "Trametes versicolor",
    category: "fungi",
    family: "Polyporaceae",
    habitat: "Fallen logs, dead hardwood stumps, rotting branches",
    distinguishingFeatures: [
      "Thin, flexible fan-shaped brackets growing in overlapping tiers",
      "Concentric bands of variable colors: browns, blues, grays, creams, tans",
      "Velvety fine hairs on upper surface",
      "Underside is pure white to cream with tiny pores (1-3 pores per mm), NEVER gills!"
    ],
    nativeRegions: ["Worldwide in temperate forests"],
    seasonalAvailability: ["Year-round on dead wood"],
    safetyNotes: "⚠️ Foraging Safety: Never consume wild fungi. Look out for the 'False Turkey Tail' (Stereum ostrea) which has a smooth poreless underside.",
    conservationStatus: "Least Concern"
  }
];

export const NATURE_ECOSYSTEMS = [
  {
    id: "urban-park",
    name: "Urban Park & Green Belt",
    description: "City parks, gardens, and canals provide vital migratory stepping stones.",
    keySpecies: ["American Robin", "Common Dandelion", "Buff-tailed Bumblebee", "Broadleaf Plantain"],
    recommendedGear: ["Walking shoes", "Magnifying glass / phone camera", "Water bottle"]
  },
  {
    id: "temperate-woodland",
    name: "Deciduous Woodland",
    description: "Canopy forests rich in oaks, maples, leaf litter, songbirds, and decomposers.",
    keySpecies: ["White Oak", "Sugar Maple", "Black-capped Chickadee", "Turkey Tail", "Poison Ivy (Watch out!)"],
    recommendedGear: ["Long pants & socks", "Binoculars", "Field notebook", "Sturdy boots"]
  },
  {
    id: "meadow-grassland",
    name: "Wildflower Meadow & Prairie",
    description: "Sun-drenched open terrain alive with native nectar plants, butterflies, and raptors.",
    keySpecies: ["Monarch Butterfly", "Purple Coneflower", "Red-tailed Hawk", "Broadleaf Plantain"],
    recommendedGear: ["Sun hat", "Sunscreen", "Binoculars", "Camera"]
  },
  {
    id: "backyard-balcony",
    name: "Micro Garden & Balcony",
    description: "Small human-tended spaces that can become extraordinary biodiversity havens.",
    keySpecies: ["European Robin", "Buff-tailed Bumblebee", "Wild Bramble", "Common Dandelion"],
    recommendedGear: ["Hand trowel", "Gardening gloves", "Watering can"]
  }
];
