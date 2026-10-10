import { SpeciesCategory } from "@/types";

export interface ImageAnalysisFeatures {
  dominantColors: string[];
  suggestedCategory: SpeciesCategory | "unknown";
  confidenceHints: string[];
  colorSummary: string;
}

/**
 * Analyzes an image base64 on client side using an offscreen canvas
 * to extract dominant color hues and botanical vs avian signatures.
 */
export async function extractImageFeatures(
  imageBase64: string,
  fileName?: string
): Promise<ImageAnalysisFeatures> {
  const result: ImageAnalysisFeatures = {
    dominantColors: [],
    suggestedCategory: "unknown",
    confidenceHints: [],
    colorSummary: "",
  };

  // Check filename first for obvious clues
  const lowerName = (fileName || "").toLowerCase();
  if (
    lowerName.includes("rose") ||
    lowerName.includes("flower") ||
    lowerName.includes("plant") ||
    lowerName.includes("petal") ||
    lowerName.includes("leaf") ||
    lowerName.includes("blossom")
  ) {
    result.suggestedCategory = "plant";
    result.confidenceHints.push(`Image filename references botanical keywords (${fileName})`);
    if (lowerName.includes("rose")) {
      result.dominantColors.push("red", "pink");
    }
  } else if (
    lowerName.includes("bird") ||
    lowerName.includes("robin") ||
    lowerName.includes("feather") ||
    lowerName.includes("avian")
  ) {
    result.suggestedCategory = "bird";
    result.confidenceHints.push(`Image filename references avian keywords (${fileName})`);
  } else if (lowerName.includes("tree") || lowerName.includes("bark")) {
    result.suggestedCategory = "tree";
  }

  // If in browser, do canvas pixel sampling
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    try {
      const colors = await sampleImagePixels(imageBase64);
      colors.dominantColors.forEach((c) => {
        if (!result.dominantColors.includes(c)) {
          result.dominantColors.push(c);
        }
      });

      if (result.suggestedCategory === "unknown") {
        result.suggestedCategory = colors.suggestedCategory;
      }
      result.colorSummary = colors.summary;
    } catch (err) {
      console.warn("Canvas pixel sampling note:", err);
    }
  }

  return result;
}

function sampleImagePixels(
  base64: string
): Promise<{
  dominantColors: string[];
  suggestedCategory: SpeciesCategory | "unknown";
  summary: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 64; // Sample on a 64x64 grid
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({ dominantColors: [], suggestedCategory: "unknown", summary: "" });
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size).data;

        let redCount = 0;
        let pinkCount = 0;
        let yellowCount = 0;
        let greenCount = 0;
        let blueCount = 0;
        let whiteCount = 0;
        let brownCount = 0;
        let totalSampled = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 50) continue; // Ignore transparent pixels
          totalSampled++;

          // Red (Vibrant red petals, berries, plumage)
          if (r > 130 && r > g * 1.3 && r > b * 1.3) {
            redCount++;
          }
          // Pink / Magenta (Rose petals, coneflower)
          else if (r > 140 && b > 100 && r > g * 1.15) {
            pinkCount++;
          }
          // Yellow / Gold (Dandelion, sunflower)
          else if (r > 140 && g > 130 && b < 100) {
            yellowCount++;
          }
          // Green (Foliage, leaves, stems)
          else if (g > 80 && g > r * 1.05 && g > b * 1.05) {
            greenCount++;
          }
          // Blue (Sky, blue jay, petals)
          else if (b > 130 && b > r * 1.2 && b > g) {
            blueCount++;
          }
          // White
          else if (r > 205 && g > 205 && b > 205) {
            whiteCount++;
          }
          // Brown / Earth
          else if (r > 80 && r < 160 && g > 50 && g < 120 && b < 80) {
            brownCount++;
          }
        }

        const dominantColors: string[] = [];
        const redRatio = (redCount + pinkCount) / totalSampled;
        const greenRatio = greenCount / totalSampled;
        const yellowRatio = yellowCount / totalSampled;
        const blueRatio = blueCount / totalSampled;

        if (redCount / totalSampled > 0.04) dominantColors.push("red");
        if (pinkCount / totalSampled > 0.04) dominantColors.push("pink");
        if (greenRatio > 0.1) dominantColors.push("green");
        if (yellowRatio > 0.05) dominantColors.push("yellow");
        if (blueRatio > 0.05) dominantColors.push("blue");
        if (whiteCount / totalSampled > 0.1) dominantColors.push("white");
        if (brownCount / totalSampled > 0.1) dominantColors.push("brown");

        // Category heuristic:
        // Floral pattern: Presence of green leaves + vibrant petal color (red, pink, yellow)
        let suggestedCategory: SpeciesCategory | "unknown" = "unknown";
        if (greenRatio > 0.08 && (redRatio > 0.04 || yellowRatio > 0.05)) {
          suggestedCategory = "plant";
        } else if (redRatio > 0.12 && greenRatio > 0.04) {
          suggestedCategory = "plant";
        } else if (greenRatio > 0.45) {
          suggestedCategory = "plant";
        } else if (blueRatio > 0.15 && greenRatio < 0.1) {
          suggestedCategory = "bird";
        }

        const summary = `Detected colors: ${dominantColors.join(", ") || "neutral hues"}${
          suggestedCategory !== "unknown" ? ` (Likely ${suggestedCategory})` : ""
        }`;

        resolve({ dominantColors, suggestedCategory, summary });
      } catch {
        resolve({ dominantColors: [], suggestedCategory: "unknown", summary: "" });
      }
    };

    img.onerror = () => {
      resolve({ dominantColors: [], suggestedCategory: "unknown", summary: "" });
    };

    img.src = base64;
  });
}
