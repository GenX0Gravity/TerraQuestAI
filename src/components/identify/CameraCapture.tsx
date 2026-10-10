"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`Camera permission denied or camera unavailable: ${msg}`);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.85);

    // Stop camera
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    onCapture(base64);
  };

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-3">
        <p className="text-sm text-rose-800 dark:text-rose-200 font-medium">{error}</p>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Use File Upload Instead
        </Button>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden bg-black flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-h-[380px] object-cover"
      />

      <div className="absolute top-3 right-3">
        <button
          onClick={onCancel}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={takeSnapshot}
          className="rounded-full px-6 bg-white text-forest hover:bg-nature-100 font-bold shadow-2xl flex items-center gap-2"
        >
          <Camera className="w-5 h-5" />
          <span>Capture Specimen</span>
        </Button>
      </div>
    </div>
  );
}
