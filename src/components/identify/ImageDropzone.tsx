"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImageDropzoneProps {
  onImageSelected: (base64: string, filename: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export function ImageDropzone({
  onImageSelected,
  selectedImage,
  onClear,
}: ImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-forest-light/40 group max-h-[380px] flex items-center justify-center bg-black/5 dark:bg-black/40">
        <img
          src={selectedImage}
          alt="Selected field specimen"
          className="max-h-[380px] w-full object-contain"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={onClear}
            className="rounded-full shadow-lg p-2 aspect-square"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
        isDragging
          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]"
          : "border-nature-300 dark:border-nature-800 hover:border-forest-light bg-nature-50/40 dark:bg-nature-900/20"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-forest/10 dark:bg-nature-800 text-forest-light dark:text-emerald-300 flex items-center justify-center">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-sm sm:text-base text-forest dark:text-nature-100">
            Drop plant, bird, or tree photograph here
          </p>
          <p className="text-xs text-nature-600 dark:text-nature-400">
            Supports JPG, PNG, or WebP. Analyzed locally without cloud tracking.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-xl text-xs pointer-events-none mt-2"
        >
          <ImageIcon className="w-3.5 h-3.5 mr-1" />
          Choose Photo
        </Button>
      </div>
    </div>
  );
}
