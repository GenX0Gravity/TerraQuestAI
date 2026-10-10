"use client";

import React, { useState } from "react";
import { IdentificationResult, SpeciesCategory } from "@/types";
import { ImageDropzone } from "@/components/identify/ImageDropzone";
import { CameraCapture } from "@/components/identify/CameraCapture";
import { GuidedIdWizard } from "@/components/identify/GuidedIdWizard";
import { AudioClassifierStub } from "@/components/identify/AudioClassifierStub";
import { SpeciesCard } from "@/components/identify/SpeciesCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Camera,
  UploadCloud,
  HelpCircle,
  Volume2,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Sprout,
  Feather,
  Trees,
  Bug,
  Palette,
  Tag,
} from "lucide-react";
import { getAIProvider } from "@/lib/ai/provider";
import { extractImageFeatures, ImageAnalysisFeatures } from "@/lib/image-analysis";

export default function IdentifyPage() {
  const [activeTab, setActiveTab] = useState<"photo" | "guided" | "audio">("photo");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [photoCategory, setPhotoCategory] = useState<SpeciesCategory | "all">("all");
  const [detectedFeatures, setDetectedFeatures] = useState<ImageAnalysisFeatures | null>(null);
  const [userNotes, setUserNotes] = useState<string>("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [engineStatus, setEngineStatus] = useState<string>("Offline Field Guide Heuristics");

  React.useEffect(() => {
    let isMounted = true;
    getAIProvider()
      .then((p) => p.checkHealth())
      .then((h) => {
        if (!isMounted) return;
        if (h.status === "online" && h.isVisionCapable) {
          setEngineStatus(`Ollama Vision (${h.activeModel})`);
        } else if (h.status === "online") {
          setEngineStatus(`Ollama Text (${h.activeModel}) + Field Guide`);
        } else {
          setEngineStatus("Offline Heuristics Engine");
        }
      })
      .catch(() => {
        if (isMounted) setEngineStatus("Offline Heuristics Engine");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageSelected = async (base64: string, filename?: string) => {
    setSelectedImage(base64);
    setSelectedFileName(filename || "captured_specimen.jpg");
    setCameraActive(false);

    try {
      const features = await extractImageFeatures(base64, filename);
      setDetectedFeatures(features);
      if (features.suggestedCategory !== "unknown") {
        setPhotoCategory(features.suggestedCategory);
      } else {
        setPhotoCategory("all");
      }
    } catch (err) {
      console.warn("Client feature extraction note:", err);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const provider = await getAIProvider();
      const res = await provider.identify({
        imageBase64: selectedImage,
        imageFileName: selectedFileName,
        userObservations: {
          category: photoCategory,
          colors: detectedFeatures?.dominantColors || [],
          additionalNotes: userNotes.trim()
            ? userNotes
            : detectedFeatures?.confidenceHints.join("; ") || "Photo specimen submitted via local identification workspace.",
        },
      });
      setResult(res);
    } catch (err) {
      console.error("Identification error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGuidedAnalyze = async (observations: {
    category: SpeciesCategory;
    colors: string[];
    leafOrFeatherShape: string;
    habitat: string;
    additionalNotes: string;
  }) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const provider = await getAIProvider();
      const res = await provider.identify({
        userObservations: {
          category: observations.category,
          colors: observations.colors,
          leafOrFeatherShape: observations.leafOrFeatherShape,
          habitat: observations.habitat,
          additionalNotes: observations.additionalNotes,
        },
      });
      setResult(res);
    } catch (err) {
      console.error("Guided identification error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFileName("");
    setDetectedFeatures(null);
    setPhotoCategory("all");
    setUserNotes("");
    setResult(null);
    setCameraActive(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest to-forest-light p-6 sm:p-8 text-white shadow-nature-lg">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <Search className="w-4 h-4" />
            <span>Field Specimen Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Bird & Plant Identification 🌿
          </h2>
          <p className="text-xs sm:text-sm text-nature-200/90 leading-relaxed">
            Examine wild species using local image classifiers, guided morphological questions, or acoustic bird calls. Zero cloud telemetry.
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-nature-200 dark:border-nature-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("photo");
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "photo"
                ? "bg-forest-light text-white shadow-nature"
                : "bg-white dark:bg-nature-900 border border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photo / Camera</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("guided");
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "guided"
                ? "bg-forest-light text-white shadow-nature"
                : "bg-white dark:bg-nature-900 border border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Guided Morphology</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("audio");
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "audio"
                ? "bg-forest-light text-white shadow-nature"
                : "bg-white dark:bg-nature-900 border border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Bird-Call Audio</span>
          </button>
        </div>

        {result && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            New Specimen
          </Button>
        )}
      </div>

      {/* Tab 1: Photo / Camera Workspace */}
      {activeTab === "photo" && (
        <div className="space-y-6">
          <Card className="border-nature-200 dark:border-nature-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-nature-100 dark:border-nature-900 pb-3">
              <div className="flex items-center gap-2.5">
                <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
                  Visual Field Specimen Capture
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>{engineStatus}</span>
                </span>
              </div>
              <div className="flex gap-2">
                {!cameraActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCameraActive(true)}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-forest" />
                    <span>Use Camera</span>
                  </Button>
                )}
              </div>
            </div>

            {cameraActive ? (
              <CameraCapture
                onCapture={handleImageSelected}
                onCancel={() => setCameraActive(false)}
              />
            ) : (
              <ImageDropzone
                selectedImage={selectedImage}
                onImageSelected={handleImageSelected}
                onClear={() => setSelectedImage(null)}
              />
            )}

            {selectedImage && (
              <div className="space-y-4 pt-2">
                {/* Visual Analysis Detection Card */}
                {detectedFeatures && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pre-Analysis Specimen Heuristics</span>
                      </div>
                      {detectedFeatures.suggestedCategory !== "unknown" && (
                        <Badge variant="forest" className="text-[10px] uppercase font-bold tracking-wider">
                          Suspected: {detectedFeatures.suggestedCategory}
                        </Badge>
                      )}
                    </div>
                    {detectedFeatures.dominantColors.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap text-nature-700 dark:text-nature-300">
                        <span className="text-[11px] font-medium text-nature-500">Detected Hue Palette:</span>
                        {detectedFeatures.dominantColors.map((color) => (
                          <span
                            key={color}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white dark:bg-nature-800 border border-nature-200 dark:border-nature-700 capitalize"
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-1.5 ${
                                color === "red"
                                  ? "bg-rose-500"
                                  : color === "pink"
                                  ? "bg-pink-400"
                                  : color === "green"
                                  ? "bg-emerald-500"
                                  : color === "yellow"
                                  ? "bg-amber-400"
                                  : color === "blue"
                                  ? "bg-sky-500"
                                  : color === "white"
                                  ? "bg-white border"
                                  : "bg-amber-800"
                              }`}
                            />
                            {color}
                          </span>
                        ))}
                      </div>
                    )}
                    {detectedFeatures.confidenceHints.length > 0 && (
                      <p className="text-[11px] text-nature-600 dark:text-nature-400 italic">
                        {detectedFeatures.confidenceHints.join(" • ")}
                      </p>
                    )}
                  </div>
                )}

                {/* Kingdom / Category Selection Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-nature-700 dark:text-nature-300 flex items-center justify-between">
                    <span>Taxonomic Focus / Kingdom:</span>
                    <span className="text-[11px] font-normal text-nature-500">
                      Select specific type or leave as Auto-Detect
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: "all", label: "Auto-Detect", icon: Sparkles },
                      { id: "plant", label: "Plant / Flower", icon: Sprout },
                      { id: "bird", label: "Bird", icon: Feather },
                      { id: "tree", label: "Tree", icon: Trees },
                      { id: "insect", label: "Insect", icon: Bug },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = photoCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setPhotoCategory(cat.id as SpeciesCategory | "all")}
                          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border ${
                            isSelected
                              ? "bg-forest-light text-white border-forest-light shadow-nature font-semibold"
                              : "bg-white dark:bg-nature-900 border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Field Notes / Clues */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-nature-700 dark:text-nature-300">
                    Additional Field Notes & Botanical Clues (Optional):
                  </label>
                  <input
                    type="text"
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="e.g. Thorny bush in garden, crimson petals, fragrant bloom, beach rose shrub"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-nature-300 dark:border-nature-700 bg-white dark:bg-nature-900 text-nature-900 dark:text-nature-100 placeholder:text-nature-400 focus:outline-none focus:ring-2 focus:ring-forest-light"
                  />
                </div>

                {/* Analyze Button */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAnalyzePhoto}
                  disabled={isAnalyzing}
                  className="w-full bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-nature flex items-center justify-center gap-2 py-3"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>
                    {isAnalyzing
                      ? "Evaluating Specimen with Local AI..."
                      : "Classify Species (Local Vision / Heuristics)"}
                  </span>
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 2: Guided Morphology Questions */}
      {activeTab === "guided" && (
        <GuidedIdWizard onAnalyze={handleGuidedAnalyze} isLoading={isAnalyzing} />
      )}

      {/* Tab 3: Audio Classifier Stub */}
      {activeTab === "audio" && <AudioClassifierStub />}

      {/* Results Display */}
      {result && (
        <SpeciesCard
          result={result}
          capturedImageUrl={selectedImage}
          onSavedToJournal={() => {}}
        />
      )}
    </div>
  );
}
