import { AIProvider } from "./types";
import { OllamaProvider } from "./ollama";
import { LocalFallbackProvider } from "./fallback";
import { db, INITIAL_USER_PREFERENCES } from "@/lib/db";
import { UserPreferences } from "@/types";

let cachedProvider: AIProvider | null = null;
let lastProviderType: string = "";
let lastBaseUrl: string = "";
let lastModel: string = "";

export async function getAIProvider(): Promise<AIProvider> {
  let prefs: UserPreferences = INITIAL_USER_PREFERENCES;

  if (typeof window !== "undefined") {
    try {
      const stored = await db.userPreferences.get("default");
      if (stored) {
        prefs = stored;
      }
    } catch {
      // IndexedDB might not be available or initialized yet
    }
  }

  // Check if cache is still valid
  if (
    cachedProvider &&
    lastProviderType === prefs.aiProvider &&
    lastBaseUrl === prefs.ollamaBaseUrl &&
    lastModel === prefs.selectedModel
  ) {
    return cachedProvider;
  }

  lastProviderType = prefs.aiProvider;
  lastBaseUrl = prefs.ollamaBaseUrl;
  lastModel = prefs.selectedModel;

  if (prefs.aiProvider === "fallback") {
    cachedProvider = new LocalFallbackProvider();
  } else {
    // Default to Ollama with fallback
    cachedProvider = new OllamaProvider(
      prefs.ollamaBaseUrl || "http://localhost:11434",
      prefs.selectedModel || "qwen2.5:3b",
      prefs.useProxy ?? true
    );
  }

  return cachedProvider;
}

export function resetProviderCache() {
  cachedProvider = null;
}
