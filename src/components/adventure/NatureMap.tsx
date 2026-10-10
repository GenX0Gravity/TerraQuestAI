"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapPin, Navigation, Compass, Layers, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Waypoint {
  title: string;
  lat: number;
  lng: number;
  description?: string;
}

interface NatureMapProps {
  waypoints?: Waypoint[];
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  className?: string;
}

export function NatureMap({
  waypoints = [],
  center = [40.7128, -74.006],
  zoom = 14,
  onLocationSelect,
  className = "h-[380px]",
}: NatureMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import("leaflet")).default;

        if (!isMounted) return;

        // Clean up previous map instance if re-initializing
        if (mapInstanceRef.current) {
          (mapInstanceRef.current as { remove: () => void }).remove();
        }

        const map = L.map(mapContainerRef.current).setView(center, zoom);
        mapInstanceRef.current = map;

        // OpenStreetMap free tile server
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Custom nature green pin icon
        const greenIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `<div style="background-color: #2d543e; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        });

        // Add markers for waypoints
        waypoints.forEach((wp) => {
          const marker = L.marker([wp.lat, wp.lng], { icon: greenIcon }).addTo(map);
          marker.bindPopup(`<strong>${wp.title}</strong><br/>${wp.description || ""}`);
        });

        // Click on map to select location
        if (onLocationSelect) {
          map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            L.marker([e.latlng.lat, e.latlng.lng], { icon: greenIcon })
              .addTo(map)
              .bindPopup("Selected Exploration Point")
              .openPopup();
          });
        }

        setMapLoaded(true);
      } catch (err) {
        console.warn("Leaflet map initialization warning:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          (mapInstanceRef.current as { remove: () => void }).remove();
        } catch {}
      }
    };
  }, [center[0], center[1], zoom, waypoints.length]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCoords(coords);
        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current as { setView: (coords: [number, number], zoom: number) => void };
          map.setView(coords, 15);
        }
        if (onLocationSelect) {
          onLocationSelect(coords[0], coords[1]);
        }
      },
      (err) => {
        setGeoError(`Location access denied or unavailable: ${err.message}`);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-nature-200 dark:border-nature-800 shadow-nature ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-nature-100 dark:bg-nature-950 z-0" />

      {/* Offline Banner if no network */}
      {isOffline && (
        <div className="absolute top-3 left-3 right-3 z-10 p-2.5 rounded-xl bg-amber-950/90 text-amber-200 border border-amber-500/40 text-xs flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Offline Mode: Cached OpenStreetMap tiles active. Manual coordinates supported.</span>
          </div>
        </div>
      )}

      {/* Top right controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLocateMe}
          className="bg-white/95 dark:bg-nature-900/95 shadow-md border border-nature-200 text-forest dark:text-nature-100 flex items-center gap-1.5 backdrop-blur-sm text-xs py-1.5 px-3"
          title="Center on my GPS coordinates"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>My GPS</span>
        </Button>
      </div>

      {/* Geo Error Toast if any */}
      {geoError && (
        <div className="absolute bottom-3 left-3 right-3 z-10 p-2 rounded-xl bg-rose-950/90 text-rose-200 border border-rose-500/30 text-xs text-center backdrop-blur-sm">
          {geoError}
        </div>
      )}
    </div>
  );
}
