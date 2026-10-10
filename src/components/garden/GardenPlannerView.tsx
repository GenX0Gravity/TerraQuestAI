"use client";

import React, { useState } from "react";
import { GardenProfile, GardenPlant, GardenTask } from "@/types";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Flower2,
  Sun,
  Droplets,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { getAIProvider } from "@/lib/ai/provider";
import { playNatureChime } from "@/lib/utils";

export function GardenPlannerView() {
  const garden = useLiveQuery(async () => {
    return await db.gardens.get("garden-default");
  }, []);

  const [climateZone, setClimateZone] = useState("Temperate Zone 6-7 (First frost ~Oct, Last frost ~May)");
  const [sunlight, setSunlight] = useState<GardenProfile["sunlight"]>("Partial Sun (3-6 hrs)");
  const [soilType, setSoilType] = useState<GardenProfile["soilType"]>("Potting Mix / Raised Bed");
  const [spaceType, setSpaceType] = useState<GardenProfile["spaceType"]>("Balcony Pots");
  const [focusGoal, setFocusGoal] = useState<GardenProfile["focusGoal"]>("Pollinators & Wildlife");
  const [isGenerating, setIsGenerating] = useState(false);

  // New plant form modal or quick adder
  const [newPlantName, setNewPlantName] = useState("");

  const handleGenerateAdvice = async () => {
    setIsGenerating(true);
    try {
      const provider = await getAIProvider();
      const updated = await provider.adviseGarden({
        climateZone,
        sunlight,
        soilType,
        spaceType,
        focusGoal,
      });

      if (garden) {
        await db.gardens.update("garden-default", {
          ...garden,
          climateZone,
          sunlight,
          soilType,
          spaceType,
          focusGoal,
          plants: updated.plants || garden.plants,
          seasonalTasks: updated.seasonalTasks || garden.seasonalTasks,
        });
      }

      playNatureChime("complete");
    } catch (err) {
      console.error("Garden planning error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentDone: boolean) => {
    if (!garden) return;
    const updatedTasks = garden.seasonalTasks.map((t) =>
      t.id === taskId ? { ...t, done: !currentDone } : t
    );

    await db.gardens.update("garden-default", {
      seasonalTasks: updatedTasks,
    });
    playNatureChime("click");
  };

  const handleAddCustomPlant = async () => {
    if (!newPlantName.trim() || !garden) return;
    const newPlant: GardenPlant = {
      id: `plant-${Date.now()}`,
      name: newPlantName.trim(),
      category: "native_wildflower",
      waterFrequencyDays: 3,
      sunRequirement: sunlight,
      plantingSeason: "Spring",
      harvestOrBloomSeason: "Summer",
      companionPlants: ["Lavender", "Basil"],
      careTips: "Ensure good drainage and check top 2 inches of soil before watering.",
      plantedDate: new Date().toISOString().split("T")[0],
    };

    await db.gardens.update("garden-default", {
      plants: [...garden.plants, newPlant],
    });
    setNewPlantName("");
    playNatureChime("complete");
  };

  const currentGarden = garden || {
    id: "garden-default",
    name: "Balcony & Window Pollinator Haven",
    climateZone,
    sunlight,
    soilType,
    spaceType,
    focusGoal,
    plants: [],
    seasonalTasks: [],
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-light to-forest p-6 sm:p-8 text-white shadow-nature-lg">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <Flower2 className="w-4 h-4" />
            <span>Sustainable Ecological Cultivation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            AI Nature Garden Planner 🌿
          </h2>
          <p className="text-xs sm:text-sm text-nature-200/90 leading-relaxed">
            Tailor seasonal planting calendars for balconies, window containers, or backyards. Support native pollinators and avoid synthetic pesticides.
          </p>
        </div>
      </div>

      {/* Configuration Grid */}
      <Card className="border-nature-200 dark:border-nature-800 p-6 space-y-6">
        <div className="border-b border-nature-100 dark:border-nature-900 pb-3 flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
            Garden Profile & Microclimate Parameters
          </h3>
          <Badge variant="forest">Local Offline Planning</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Climate Zone & Frost Dates
            </label>
            <input
              type="text"
              value={climateZone}
              onChange={(e) => setClimateZone(e.target.value)}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Daily Sun Exposure
            </label>
            <select
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value as GardenProfile["sunlight"])}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            >
              <option value="Full Sun (6+ hrs)">Full Sun (6+ hours direct)</option>
              <option value="Partial Sun (3-6 hrs)">Partial Sun (3-6 hours)</option>
              <option value="Shady (<3 hrs)">Shady (Under 3 hours)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Soil & Medium
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as GardenProfile["soilType"])}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            >
              <option value="Potting Mix / Raised Bed">Organic Potting Mix (Containers/Raised)</option>
              <option value="Loamy (Balanced)">Loamy Ground (Rich and well-draining)</option>
              <option value="Sandy (Fast draining)">Sandy Ground (Fast draining)</option>
              <option value="Clay (Moisture retentive)">Heavy Clay (Moisture retentive)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Physical Space Type
            </label>
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value as GardenProfile["spaceType"])}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            >
              <option value="Balcony Pots">Balcony Planters & Pots</option>
              <option value="Window Box">Sunny Window Box</option>
              <option value="Patio Container">Patio Container Oasis</option>
              <option value="Raised Garden Bed">Raised Garden Bed</option>
              <option value="Backyard Plot">Backyard Plot / Lawn Conversion</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Ecological Objective
            </label>
            <select
              value={focusGoal}
              onChange={(e) => setFocusGoal(e.target.value as GardenProfile["focusGoal"])}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            >
              <option value="Pollinators & Wildlife">Pollinators & Wildlife Haven</option>
              <option value="Herbs & Kitchen Greens">Fresh Culinary Herbs & Greens</option>
              <option value="Native Wildflowers">Drought-Tolerant Native Flora</option>
              <option value="Low Maintenance Oasis">Low Maintenance Resilient Greenery</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleGenerateAdvice}
              disabled={isGenerating}
              className="w-full bg-forest hover:bg-forest-dark text-white rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-nature text-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isGenerating ? "Synthesizing..." : "Update Planting Calendar"}</span>
            </Button>
          </div>
        </div>

        {/* Note on climate data honesty */}
        <div className="text-[11px] text-nature-600 dark:text-nature-400 bg-nature-50 dark:bg-nature-900/40 p-3 rounded-xl border border-nature-200 dark:border-nature-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Frost dates and microclimates vary by street topography and elevation. Adjust your zone dates manually to match your regional agricultural extension.
          </span>
        </div>
      </Card>

      {/* Plants In Garden */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100 flex items-center gap-2">
            <span>Recommended Companion Plants</span>
            <Badge variant="sage">{currentGarden.plants.length} Cultivars</Badge>
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add plant name..."
              value={newPlantName}
              onChange={(e) => setNewPlantName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomPlant()}
              className="rounded-xl border border-nature-200 dark:border-nature-800 px-3 py-1.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            />
            <Button variant="secondary" size="sm" onClick={handleAddCustomPlant} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentGarden.plants.map((plant) => (
            <Card key={plant.id} className="p-5 border-nature-200 dark:border-nature-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-base text-forest dark:text-nature-100">
                    {plant.name}
                  </h4>
                  {plant.scientificName && (
                    <p className="text-xs italic text-nature-600 dark:text-nature-400">
                      {plant.scientificName}
                    </p>
                  )}
                </div>
                <Badge variant="forest" className="capitalize">
                  {plant.category.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-nature-700 dark:text-nature-300">
                <div className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Water every {plant.waterFrequencyDays} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{plant.sunRequirement}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sow: {plant.plantingSeason} • Bloom: {plant.harvestOrBloomSeason}</span>
                </div>
              </div>

              <p className="text-xs text-nature-600 dark:text-nature-400 bg-nature-50/80 dark:bg-nature-900/40 p-2.5 rounded-xl border border-nature-200/60 dark:border-nature-800 leading-snug">
                {plant.careTips}
              </p>

              {plant.companionPlants && (
                <div className="text-[11px] text-nature-500">
                  <span className="font-semibold text-forest dark:text-nature-300">Companions:</span>{" "}
                  {plant.companionPlants.join(", ")}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Seasonal Care Calendar */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-forest dark:text-nature-100">
          Four-Season Ecological Task Calendar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["Spring", "Summer", "Autumn", "Winter"] as const).map((season) => {
            const seasonTasks = currentGarden.seasonalTasks.filter((t) => t.season === season);
            return (
              <Card key={season} className="p-4 border-nature-200 dark:border-nature-800 space-y-3">
                <div className="flex items-center justify-between border-b border-nature-100 dark:border-nature-900 pb-2">
                  <h4 className="font-bold text-sm text-forest dark:text-emerald-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{season}</span>
                  </h4>
                  <span className="text-[10px] text-nature-500 font-medium">
                    {seasonTasks.filter((t) => t.done).length} / {seasonTasks.length} done
                  </span>
                </div>

                <div className="space-y-2">
                  {seasonTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.done)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        task.done
                          ? "bg-nature-50 dark:bg-nature-900/20 border-nature-200/60 text-nature-400 line-through"
                          : "bg-white dark:bg-nature-950 border-nature-200 dark:border-nature-800 hover:border-forest-light text-nature-900 dark:text-nature-100"
                      }`}
                    >
                      {task.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-nature-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold">{task.title}</div>
                        <p className="text-[11px] text-nature-600 dark:text-nature-400 mt-0.5 leading-snug">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
