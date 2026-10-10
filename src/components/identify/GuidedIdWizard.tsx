"use client";

import React, { useState } from "react";
import { SpeciesCategory } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, Feather, Sprout, Trees, Bug, Compass, ArrowRight, RotateCcw } from "lucide-react";

interface GuidedIdWizardProps {
  onAnalyze: (observations: {
    category: SpeciesCategory;
    colors: string[];
    leafOrFeatherShape: string;
    habitat: string;
    additionalNotes: string;
  }) => void;
  isLoading: boolean;
}

export function GuidedIdWizard({ onAnalyze, isLoading }: GuidedIdWizardProps) {
  const [category, setCategory] = useState<SpeciesCategory>("plant");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [shape, setShape] = useState<string>("");
  const [habitat, setHabitat] = useState<string>("Urban Park / Garden");
  const [notes, setNotes] = useState<string>("");

  const categories = [
    { id: "plant", label: "Wildflower / Herb", icon: Sprout },
    { id: "bird", label: "Bird / Songbird", icon: Feather },
    { id: "tree", label: "Tree / Bark", icon: Trees },
    { id: "insect", label: "Insect / Pollinator", icon: Bug },
  ];

  const colorOptions = [
    { id: "yellow", label: "Yellow / Gold", colorClass: "bg-yellow-400" },
    { id: "red", label: "Red / Orange", colorClass: "bg-rose-500" },
    { id: "blue", label: "Blue / Lavender", colorClass: "bg-sky-500" },
    { id: "white", label: "White / Cream", colorClass: "bg-stone-100 text-stone-900 border" },
    { id: "green", label: "Emerald / Green", colorClass: "bg-emerald-600" },
    { id: "brown", label: "Brown / Earth", colorClass: "bg-amber-800" },
    { id: "black", label: "Charcoal / Black", colorClass: "bg-neutral-900" },
  ];

  const birdShapes = [
    "Cone beak (seed cracking, like Finch/Cardinal)",
    "Slender needle beak (insect eater, like Warbler)",
    "Hooked sharp bill (raptor/hawk)",
    "Chisel beak (tree trunk pecking)",
    "Yellow or red breast patch",
  ];

  const plantShapes = [
    "Lobed leaves with rounded fingers (like Oak)",
    "Serrated saw-blade margins (like Birch/Nettle)",
    "Leaves of three leaflets (Check for Poison Ivy!)",
    "Compound feather-like leaflets (Ash/Fern)",
    "Tubular drooping bell flower spire (Foxglove)",
    "Composite daisy ray flower head (Dandelion/Coneflower)",
  ];

  const habitats = [
    "Woodland & Forest Understory",
    "Urban Park / Lawn / Garden",
    "Pond / Creek / Wetland",
    "Meadow / Sunlit Prairie",
    "Backyard Balcony / Patio Container",
  ];

  const toggleColor = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  const handleReset = () => {
    setCategory("plant");
    setSelectedColors([]);
    setShape("");
    setHabitat("Urban Park / Garden");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      category,
      colors: selectedColors,
      leafOrFeatherShape: shape,
      habitat,
      additionalNotes: notes,
    });
  };

  return (
    <Card className="border-nature-200 dark:border-nature-800 p-6 space-y-6">
      <div className="border-b border-nature-100 dark:border-nature-900 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
            Naturalist Guided Identification
          </h3>
          <p className="text-xs text-nature-600 dark:text-nature-400">
            Field-tested morphological matching using local taxonomy heuristics.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
            1. Select Specimen Kingdom / Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id as SpeciesCategory);
                    setShape("");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                    isSelected
                      ? "border-forest-light bg-forest/5 dark:bg-nature-900 text-forest dark:text-white font-bold ring-2 ring-forest-light/30"
                      : "border-nature-200 dark:border-nature-800 hover:border-nature-300 text-nature-700 dark:text-nature-300"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-forest-light dark:text-emerald-400" : "text-nature-500"}`} />
                  <span className="text-xs">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Dominant Colors */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
            2. Noticeable Colors (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((c) => {
              const isSelected = selectedColors.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggleColor(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                    isSelected
                      ? "border-forest-light bg-nature-100 dark:bg-nature-800 text-forest dark:text-white ring-1 ring-forest-light font-bold"
                      : "border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.colorClass}`} />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Morphological Features */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
            3. Distinctive Shape or Anatomical Feature
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(category === "bird" ? birdShapes : plantShapes).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setShape(s)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  shape === s
                    ? "border-forest-light bg-forest/5 dark:bg-nature-900 font-semibold text-forest dark:text-white"
                    : "border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50 dark:hover:bg-nature-900/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Habitat & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              4. Immediate Habitat
            </label>
            <select
              value={habitat}
              onChange={(e) => setHabitat(e.target.value)}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            >
              {habitats.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              5. Field Notes & Behavior
            </label>
            <input
              type="text"
              placeholder="e.g. Hopping on damp grass, whistling cheerful carols..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-nature flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{isLoading ? "Running Local Taxonomy Analysis..." : "Identify Field Specimen"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
}
