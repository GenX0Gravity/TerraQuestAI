"use client";

import React, { useState, useEffect } from "react";
import { UserPreferences } from "@/types";
import { db, INITIAL_USER_PREFERENCES } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  Settings,
  Cpu,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  Sparkles,
  WifiOff,
  CheckCircle2,
  Trash2,
  Download,
  AlertTriangle,
  Info,
  Terminal,
  Server,
} from "lucide-react";
import { getAIProvider, resetProviderCache } from "@/lib/ai/provider";
import { AIProviderStatus } from "@/lib/ai/types";
import { exportToJson, playNatureChime } from "@/lib/utils";

export function SettingsView() {
  const prefs = useLiveQuery(async () => {
    return await db.userPreferences.get("default");
  }, []);

  const [aiProvider, setAiProvider] = useState<"ollama" | "fallback" | "custom">("ollama");
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState("http://localhost:11434");
  const [selectedModel, setSelectedModel] = useState("qwen2.5:3b");
  const [temperature, setTemperature] = useState(0.7);
  const [useProxy, setUseProxy] = useState(true);

  // Profile fields
  const [userName, setUserName] = useState("Nature Wanderer");
  const [experienceLevel, setExperienceLevel] = useState<UserPreferences["experienceLevel"]>("Curious Beginner");
  const [screenFreeGoal, setScreenFreeGoal] = useState(120);

  // Status check state
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<AIProviderStatus | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (prefs) {
      setAiProvider(prefs.aiProvider || "ollama");
      setOllamaBaseUrl(prefs.ollamaBaseUrl || "http://localhost:11434");
      setSelectedModel(prefs.selectedModel || "qwen2.5:3b");
      setTemperature(prefs.temperature ?? 0.7);
      setUseProxy(prefs.useProxy ?? true);
      setUserName(prefs.name || "Nature Wanderer");
      setExperienceLevel(prefs.experienceLevel || "Curious Beginner");
      setScreenFreeGoal(prefs.screenFreeGoalMinsPerWeek || 120);
    }
  }, [prefs]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      // Temporarily save to trigger provider refresh
      await db.userPreferences.update("default", {
        aiProvider,
        ollamaBaseUrl,
        selectedModel,
        useProxy,
      });
      resetProviderCache();

      const provider = await getAIProvider();
      const status = await provider.checkHealth();
      setTestStatus(status);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestStatus({
        status: "offline",
        providerName: "Ollama",
        activeModel: selectedModel,
        availableModels: [],
        message: `Connection failed: ${msg}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.userPreferences.update("default", {
      aiProvider,
      ollamaBaseUrl,
      selectedModel,
      temperature,
      useProxy,
      name: userName,
      experienceLevel,
      screenFreeGoalMinsPerWeek: screenFreeGoal,
    });
    resetProviderCache();
    playNatureChime("complete");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportFullBackup = async () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      userPreferences: await db.userPreferences.toArray(),
      missions: await db.missions.toArray(),
      challenges: await db.challenges.toArray(),
      badges: await db.badges.toArray(),
      observations: await db.observations.toArray(),
      gardens: await db.gardens.toArray(),
      chatHistory: await db.chatHistory.toArray(),
    };
    exportToJson(backup, `terraquest-complete-backup-${new Date().toISOString().split("T")[0]}.json`);
  };

  const handleResetToDefaults = async () => {
    if (confirm("Reset all settings and re-seed sample data? This will clear local changes.")) {
      await db.delete();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest to-forest-light p-6 sm:p-8 text-white shadow-nature-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <Settings className="w-4 h-4" />
            <span>Local AI & Privacy Controls</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Settings & Local Inference Architecture 🌿
          </h2>
          <p className="text-xs sm:text-sm text-nature-200/90 leading-relaxed">
            Configure your local open-source models, test Ollama connections, adjust your privacy profile, and manage offline data.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Local AI Engine Config */}
        <Card className="border-nature-200 dark:border-nature-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-nature-100 dark:border-nature-900 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-forest dark:text-emerald-400" />
              <div>
                <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
                  Open-Source AI Engine Configuration
                </h3>
                <p className="text-xs text-nature-600 dark:text-nature-400">
                  Select your local inference engine and open-weight model.
                </p>
              </div>
            </div>

            <Badge variant="forest">Local-First</Badge>
          </div>

          <div className="space-y-4">
            {/* Engine Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Inference Intelligence Provider
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAiProvider("ollama")}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    aiProvider === "ollama"
                      ? "border-forest-light bg-forest/5 dark:bg-nature-900/60 ring-2 ring-forest-light/40"
                      : "border-nature-200 dark:border-nature-800 text-nature-700 hover:bg-nature-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-forest dark:text-nature-100">
                      Ollama Local Engine
                    </span>
                    <Badge variant="forest">Recommended</Badge>
                  </div>
                  <p className="text-xs text-nature-600 dark:text-nature-400">
                    Runs Qwen 2.5, Gemma 2, LLaVA, or Llama 3.2 locally on your machine.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiProvider("fallback")}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    aiProvider === "fallback"
                      ? "border-forest-light bg-forest/5 dark:bg-nature-900/60 ring-2 ring-forest-light/40"
                      : "border-nature-200 dark:border-nature-800 text-nature-700 hover:bg-nature-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-forest dark:text-nature-100">
                      Offline Field Guide Engine
                    </span>
                    <Badge variant="amber">100% Offline</Badge>
                  </div>
                  <p className="text-xs text-nature-600 dark:text-nature-400">
                    Rule-based taxonomy heuristics. Zero RAM/server overhead, works completely disconnected in deep woods.
                  </p>
                </button>
              </div>
            </div>

            {/* Ollama Host and Model (if Ollama selected) */}
            {aiProvider === "ollama" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                      Ollama Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={ollamaBaseUrl}
                      onChange={(e) => setOllamaBaseUrl(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 font-mono text-nature-900 dark:text-nature-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                      Open-Weight Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
                    >
                      <option value="qwen2.5:3b">Qwen 2.5 (3B) — Fast & Balanced</option>
                      <option value="qwen2.5:1.5b">Qwen 2.5 (1.5B) — Ultra Lightweight</option>
                      <option value="gemma2:2b">Gemma 2 (2B) — Efficient & Creative</option>
                      <option value="llama3.2:3b">Llama 3.2 (3B) — Highly Capable</option>
                      <option value="llava:7b">LLaVA (7B) — Vision & Multimodal</option>
                      <option value="moondream">Moondream — Tiny Vision Model</option>
                    </select>
                  </div>
                </div>

                {/* Test Connection Button */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                    <span>{isTesting ? "Pinging Ollama..." : "Test Connection & Fetch Models"}</span>
                  </Button>

                  <label className="flex items-center gap-2 text-xs text-nature-600 dark:text-nature-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useProxy}
                      onChange={(e) => setUseProxy(e.target.checked)}
                      className="rounded text-forest focus:ring-forest"
                    />
                    <span>Use internal API proxy (recommended to bypass browser CORS)</span>
                  </label>
                </div>

                {/* Test Status Banner */}
                {testStatus && (
                  <Alert
                    variant={testStatus.status === "online" ? "success" : "warning"}
                    title={testStatus.status === "online" ? "Ollama Connected!" : "Connection Note"}
                  >
                    <div>{testStatus.message}</div>
                    {testStatus.latencyMs && (
                      <div className="text-[11px] opacity-80 mt-1">
                        Latency: {testStatus.latencyMs}ms • Active Model: {testStatus.activeModel}
                      </div>
                    )}
                  </Alert>
                )}

                {/* Setup Instructions Card */}
                <div className="p-4 rounded-2xl bg-nature-50 dark:bg-nature-900/40 border border-nature-200 dark:border-nature-800 space-y-2 text-xs text-nature-800 dark:text-nature-200">
                  <div className="font-semibold flex items-center gap-2 text-forest dark:text-nature-100">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <span>How to Run Ollama Locally (Zero API Fees, 100% Private)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-nature-600 dark:text-nature-400 font-mono text-[11px]">
                    <li>Install Ollama from <code className="bg-nature-200 dark:bg-nature-800 px-1 py-0.5 rounded text-nature-900 dark:text-nature-100">ollama.com</code></li>
                    <li>Open terminal and run: <code className="bg-nature-200 dark:bg-nature-800 px-1 py-0.5 rounded text-nature-900 dark:text-nature-100">ollama run qwen2.5:3b</code></li>
                    <li>Optional vision: <code className="bg-nature-200 dark:bg-nature-800 px-1 py-0.5 rounded text-nature-900 dark:text-nature-100">ollama pull moondream</code></li>
                    <li>If offline or Ollama is stopped, TerraQuest seamlessly switches to field guide heuristics!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* User Naturalist Profile */}
        <Card className="border-nature-200 dark:border-nature-800 p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-nature-100 dark:border-nature-900 pb-3">
            <ShieldCheck className="w-5 h-5 text-forest dark:text-emerald-400" />
            <div>
              <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
                Privacy-First Local Profile
              </h3>
              <p className="text-xs text-nature-600 dark:text-nature-400">
                Preferences used exclusively to tailor outdoor suggestions. Stored locally.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Explorer Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as typeof experienceLevel)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              >
                <option value="Curious Beginner">Curious Beginner</option>
                <option value="Amateur Naturalist">Amateur Naturalist</option>
                <option value="Experienced Explorer">Experienced Explorer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Screen-Free Goal (Mins / Week)
              </label>
              <input
                type="number"
                min={15}
                max={1000}
                step={15}
                value={screenFreeGoal}
                onChange={(e) => setScreenFreeGoal(Number(e.target.value))}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>
          </div>
        </Card>

        {/* Data & Storage Management */}
        <Card className="border-nature-200 dark:border-nature-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-nature-100 dark:border-nature-900 pb-3">
            <HardDrive className="w-5 h-5 text-forest dark:text-emerald-400" />
            <div>
              <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
                Offline Data & Backup
              </h3>
              <p className="text-xs text-nature-600 dark:text-nature-400">
                Full control over your device storage. Zero external telemetry.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-forest dark:text-nature-200">
                Export Full Field Notebook Backup
              </span>
              <p className="text-xs text-nature-600 dark:text-nature-400">
                Downloads observations, missions, garden calendars, and challenges as JSON.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleExportFullBackup}
              className="flex items-center gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full JSON Package</span>
            </Button>
          </div>

          <div className="pt-3 border-t border-nature-100 dark:border-nature-900 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Reset Application State
              </span>
              <p className="text-xs text-nature-600 dark:text-nature-400">
                Wipes IndexedDB and restores factory seed data.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleResetToDefaults}
              className="text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Reset All Local Data
            </Button>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved Locally
            </span>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-nature px-8"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
