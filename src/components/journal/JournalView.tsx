"use client";

import React, { useState, useMemo } from "react";
import { Observation, SpeciesCategory } from "@/types";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  FileSpreadsheet,
  FileJson,
  Eye,
  Shield,
  Feather,
  Sprout,
  Trees,
  Bug,
} from "lucide-react";
import { exportObservationsToCsv, exportToJson, formatDate, playNatureChime } from "@/lib/utils";

export function JournalView() {
  const observations = useLiveQuery(async () => {
    return await db.observations.orderBy("createdAt").reverse().toArray();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailModalObs, setDetailModalObs] = useState<Observation | null>(null);

  // New Observation Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSpeciesName, setNewSpeciesName] = useState("");
  const [newScientificName, setNewScientificName] = useState("");
  const [newCategory, setNewCategory] = useState<SpeciesCategory>("plant");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newLocation, setNewLocation] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newTags, setNewTags] = useState("");

  const filteredObservations = useMemo(() => {
    if (!observations) return [];
    return observations.filter((obs) => {
      const matchesCategory = selectedCategory === "all" || obs.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        obs.title.toLowerCase().includes(q) ||
        obs.speciesName.toLowerCase().includes(q) ||
        (obs.scientificName && obs.scientificName.toLowerCase().includes(q)) ||
        obs.notes.toLowerCase().includes(q) ||
        obs.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [observations, selectedCategory, searchQuery]);

  const handleCreateObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpeciesName.trim()) return;

    const parsedTags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newObs: Observation = {
      id: `obs-${Date.now()}`,
      title: newTitle.trim() || `Observation of ${newSpeciesName.trim()}`,
      speciesName: newSpeciesName.trim(),
      scientificName: newScientificName.trim() || undefined,
      category: newCategory,
      date: newDate,
      locationName: newLocation.trim() || undefined,
      notes: newNotes.trim() || "Recorded in field journal.",
      verified: true,
      tags: parsedTags.length > 0 ? parsedTags : [newCategory],
      createdAt: Date.now(),
    };

    await db.observations.add(newObs);

    // Reset form
    setNewTitle("");
    setNewSpeciesName("");
    setNewScientificName("");
    setNewLocation("");
    setNewNotes("");
    setNewTags("");
    setIsAddModalOpen(false);
    playNatureChime("complete");
  };

  const handleDeleteObservation = async (id: string) => {
    if (confirm("Delete this field observation?")) {
      await db.observations.delete(id);
      if (detailModalObs?.id === id) {
        setDetailModalObs(null);
      }
    }
  };

  const handleExportCsv = () => {
    if (!observations || observations.length === 0) return;
    exportObservationsToCsv(observations);
  };

  const handleExportJson = () => {
    if (!observations || observations.length === 0) return;
    exportToJson(observations, `terraquest-journal-backup-${new Date().toISOString().split("T")[0]}.json`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          await db.observations.bulkPut(parsed);
          alert(`Successfully restored ${parsed.length} observations!`);
          playNatureChime("complete");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Category counts
  const birdCount = (observations || []).filter((o) => o.category === "bird").length;
  const plantCount = (observations || []).filter((o) => o.category === "plant").length;
  const treeCount = (observations || []).filter((o) => o.category === "tree").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest to-forest-dark p-6 sm:p-8 text-white shadow-nature-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Private Offline Field Journal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Your Nature Journal 📖
          </h2>
          <p className="text-xs sm:text-sm text-nature-200/90 leading-relaxed">
            Record outdoor sightings, leaf prints, bird songs, and personal reflections. 100% private and stored on your device.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Observation</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl flex items-center gap-1.5"
            title="Export observations to CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">CSV Export</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJson}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl flex items-center gap-1.5"
            title="Backup full journal data as JSON"
          >
            <FileJson className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">JSON Backup</span>
          </Button>

          <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-3 py-2 text-xs flex items-center gap-1.5 font-medium transition-colors">
            <Upload className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-nature-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search species, tags, locations, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-nature-200 dark:border-nature-800 pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100 focus:outline-none focus:ring-2 focus:ring-forest-light"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "bird", label: `Birds (${birdCount})` },
            { id: "plant", label: `Plants (${plantCount})` },
            { id: "tree", label: `Trees (${treeCount})` },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? "bg-forest-light text-white border-forest-light shadow-nature"
                  : "bg-white dark:bg-nature-900 border-nature-200 dark:border-nature-800 text-nature-700 dark:text-nature-300 hover:bg-nature-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Observations Grid */}
      {filteredObservations.length === 0 ? (
        <Card className="py-16 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-nature-400 mx-auto" />
          <h4 className="font-serif font-bold text-base text-forest dark:text-nature-100">
            No observations matching your query
          </h4>
          <p className="text-xs text-nature-600 dark:text-nature-400 max-w-sm mx-auto">
            Step outside into your garden or neighborhood, spot a bird or leaf, and log your first observation!
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2"
          >
            Add Field Entry
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredObservations.map((obs) => (
            <Card
              key={obs.id}
              onClick={() => setDetailModalObs(obs)}
              className="p-5 border-nature-200 dark:border-nature-800 hover:border-forest-light cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {obs.category}
                    </span>
                    <h4 className="font-serif font-bold text-base text-forest dark:text-nature-100 line-clamp-1">
                      {obs.speciesName}
                    </h4>
                    {obs.scientificName && (
                      <p className="text-xs italic text-nature-600 dark:text-nature-400 line-clamp-1">
                        {obs.scientificName}
                      </p>
                    )}
                  </div>

                  <Badge variant={obs.verified ? "forest" : "amber"}>
                    {obs.confidence ? `${obs.confidence}%` : "Observed"}
                  </Badge>
                </div>

                {obs.imageUrl && (
                  <div className="rounded-xl overflow-hidden h-36 bg-nature-100 dark:bg-nature-900">
                    <img
                      src={obs.imageUrl}
                      alt={obs.speciesName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-xs text-nature-700 dark:text-nature-300 line-clamp-3 leading-relaxed">
                  {obs.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-nature-100 dark:border-nature-900 flex items-center justify-between text-[11px] text-nature-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(obs.date)}
                </span>
                {obs.locationName && (
                  <span className="flex items-center gap-1 truncate max-w-[130px]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {obs.locationName}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Observation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Field Observation 🌿"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateObservation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Species Common Name *
              </label>
              <input
                type="text"
                placeholder="e.g. American Robin, White Oak"
                required
                value={newSpeciesName}
                onChange={(e) => setNewSpeciesName(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Scientific Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Turdus migratorius"
                value={newScientificName}
                onChange={(e) => setNewScientificName(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100 italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as SpeciesCategory)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              >
                <option value="bird">Bird / Avian</option>
                <option value="plant">Wildflower / Plant</option>
                <option value="tree">Tree / Woody Specimen</option>
                <option value="insect">Insect / Pollinator</option>
                <option value="fungi">Fungi / Lichen</option>
                <option value="other">Other Nature Specimen</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
                Location Name
              </label>
              <input
                type="text"
                placeholder="e.g. Maple Grove Park"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Field Notes & Sensory Observations
            </label>
            <textarea
              rows={3}
              placeholder="Describe distinguishing marks, surroundings, weather, behaviors observed..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-3 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-nature-800 dark:text-nature-200">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Dawn chorus, Songbird, Wetland, Spring bloom"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full rounded-xl border border-nature-200 dark:border-nature-800 p-2.5 text-xs bg-white dark:bg-nature-950 text-nature-900 dark:text-nature-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-nature-100 dark:border-nature-900">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="bg-forest hover:bg-forest-dark">
              Save Observation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Observation Detail View Modal */}
      {detailModalObs && (
        <Modal
          isOpen={Boolean(detailModalObs)}
          onClose={() => setDetailModalObs(null)}
          title={detailModalObs.speciesName}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-nature-100 dark:border-nature-900 pb-2">
              <span className="text-xs italic text-nature-600 dark:text-nature-400">
                {detailModalObs.scientificName || "Scientific name not recorded"}
              </span>
              <Badge variant="forest" className="capitalize">
                {detailModalObs.category}
              </Badge>
            </div>

            {detailModalObs.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-60 bg-black/5">
                <img
                  src={detailModalObs.imageUrl}
                  alt={detailModalObs.speciesName}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <h5 className="font-semibold text-xs uppercase tracking-wider text-nature-700">
                Field Notes
              </h5>
              <p className="text-xs sm:text-sm text-nature-800 dark:text-nature-200 leading-relaxed whitespace-pre-line bg-nature-50 dark:bg-nature-900/40 p-3 rounded-xl border border-nature-200/60 dark:border-nature-800">
                {detailModalObs.notes}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-nature-600 dark:text-nature-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(detailModalObs.date)}
              </span>
              {detailModalObs.locationName && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {detailModalObs.locationName}
                </span>
              )}
            </div>

            {detailModalObs.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {detailModalObs.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-nature-100 dark:bg-nature-800 text-nature-800 dark:text-nature-200 text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-nature-100 dark:border-nature-900">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteObservation(detailModalObs.id)}
                className="text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setDetailModalObs(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
