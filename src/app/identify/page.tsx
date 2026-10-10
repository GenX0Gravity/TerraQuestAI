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
} from "lucide-react";
import { getAIProvider } from "@/lib/ai/provider";

export default function IdentifyPage() {
  const [activeTab, setActiveTab] = useState<"photo" | "guided" | "audio">("photo");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);

  const handleImageSelected = (base64: string) => {
    setSelectedImage(base64);
    setCameraActive(false);
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const provider = await getAIProvider();
      const res = await provider.identify({
        imageBase64: selectedImage,
        userObservations: {
          category: "all",
          additionalNotes: "Photo specimen submitted via local identification workspace.",
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
              <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
                Visual Field Specimen Capture
              </h3>
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
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAnalyzePhoto}
                  disabled={isAnalyzing}
                  className="w-full bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-nature flex items-center justify-center gap-2"
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
