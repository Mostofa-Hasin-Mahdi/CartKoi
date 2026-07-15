"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationUpdaterProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onSave: (lat: number, lng: number) => void;
  isSaving?: boolean;
}

export default function LocationUpdater({ initialLat, initialLng, onSave, isSaving }: LocationUpdaterProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const defaultCenter: [number, number] = [23.8728, 90.3984]; // Uttara, Dhaka default
  const startLat = initialLat || defaultCenter[0];
  const startLng = initialLng || defaultCenter[1];

  const [currentLat, setCurrentLat] = useState(startLat);
  const [currentLng, setCurrentLng] = useState(startLng);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [startLat, startLng],
        zoom: 15,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(mapInstanceRef.current);
      
      // Add draggable marker
      markerRef.current = L.marker([startLat, startLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      markerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setCurrentLat(position.lat);
        setCurrentLng(position.lng);
      });
    }

    return () => {
      // Don't completely destroy if react strict mode remounts, 
      // but clean up is standard practice
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map when initial coordinates change from parent
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLat = initialLat || defaultCenter[0];
      const newLng = initialLng || defaultCenter[1];
      
      markerRef.current.setLatLng([newLat, newLng]);
      mapInstanceRef.current.setView([newLat, newLng]);
      
      setCurrentLat(newLat);
      setCurrentLng(newLng);
    }
  }, [initialLat, initialLng]);

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={mapRef} 
        className="w-full h-[300px] rounded-xl border border-slate-200 shadow-inner z-0" 
      />
      <div className="flex items-center justify-between bg-white/60 p-4 rounded-xl border border-white/80">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">New Coordinates</p>
          <p className="font-mono text-sm text-slate-700">
            {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </p>
        </div>
        <button
          onClick={() => onSave(currentLat, currentLng)}
          disabled={isSaving || (currentLat === initialLat && currentLng === initialLng)}
          className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Location"}
        </button>
      </div>
    </div>
  );
}
