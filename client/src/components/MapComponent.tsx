"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatHoursForDisplay } from "@/utils/hours";
import { Crosshair, Loader2 } from "lucide-react";

// Fix missing marker icons in leaflet with next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const openIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent({ carts }: { carts: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default center around Uttara, Dhaka
  const defaultCenter: [number, number] = [23.8728, 90.3984];

  const getCartLocation = (cart: any, index: number): [number, number] => {
    if (cart.lat && cart.lng) return [cart.lat, cart.lng];
    // Randomize slightly around the center for carts without coordinates
    const offsetLat = (index % 3 - 1) * 0.005;
    const offsetLng = (index % 2 === 0 ? 1 : -1) * 0.005 * index;
    return [defaultCenter[0] + offsetLat, defaultCenter[1] + offsetLng];
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers when carts change
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    carts.forEach((cart, idx) => {
      const position = getCartLocation(cart, idx);
      
      const popupContent = `
        <div class="p-1 min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-xs">
          <h3 class="font-bold text-base m-0 p-0 leading-tight text-slate-900 break-words">${cart.name}</h3>
          <p class="text-xs text-gray-500 mt-1 mb-2">CartKoi Partner</p>
          <div class="px-2 py-0.5 rounded text-[10px] inline-block font-bold mb-2 ${cart.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
            ${cart.is_open ? 'Open Now' : 'Closed'}
          </div>
          ${cart.operating_hours ? `<p class="text-[10px] text-gray-500 mb-2 font-medium break-words">${formatHoursForDisplay(cart.operating_hours)}</p>` : ''}
          <a href="/cart/${cart.id}" class="block text-center w-full mt-3 bg-blue-600 hover:bg-blue-700 !text-white text-xs py-2 rounded font-bold transition-colors">
            View Menu
          </a>
        </div>
      `;

      L.marker(position, {
        icon: cart.is_open ? openIcon : customIcon
      })
      .bindPopup(popupContent)
      .addTo(map);
    });

    return () => {
      // Cleanup on unmount to prevent 'Map container is being reused' errors
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [carts]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });
          
          // Remove old marker if exists
          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
          }
          
          // Add "You are here" marker
          const userIcon = L.divIcon({
            className: "bg-transparent",
            html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] relative"><div class="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-75"></div></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          
          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon, zIndexOffset: 1000 })
            .bindPopup("<div class='font-bold text-sm'>You are here</div>")
            .addTo(map);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error locating:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
      
      {/* Locate Me Button */}
      <button 
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute bottom-36 right-4 z-[400] bg-white p-3 rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-primary hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 flex items-center justify-center"
        aria-label="Locate me"
      >
        {isLocating ? <Loader2 size={24} className="animate-spin text-primary" /> : <Crosshair size={24} />}
      </button>
    </div>
  );
}
