"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

  // Default center around Uttara, Dhaka
  const defaultCenter: [number, number] = [23.8728, 90.3984];

  // Helper to generate a fake location near Uttara for carts without lat/lng
  const getCartLocation = (cart: any, index: number): [number, number] => {
    if (cart.lat && cart.lng) return [cart.lat, cart.lng];
    // Randomize slightly around the center
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
        <div class="p-1 min-w-[150px]">
          <h3 class="font-bold text-base m-0 p-0 leading-tight text-slate-900">${cart.name}</h3>
          <p class="text-xs text-gray-500 mt-1 mb-2">${cart.location || "Sector 11, Uttara"}</p>
          <div class="px-2 py-0.5 rounded text-[10px] inline-block font-bold mb-2 ${cart.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
            ${cart.isOpen ? 'Open Now' : 'Closed'}
          </div>
          ${cart.menuItems && cart.menuItems.length > 0 ? `
            <div class="mt-1 border-t pt-2">
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Top Items</p>
              ${cart.menuItems.slice(0, 2).map((item: any) => `
                <div class="flex justify-between text-xs text-slate-800">
                  <span class="truncate max-w-[100px]">${item.name}</span>
                  <span class="font-semibold text-gray-700">৳${item.price}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <button class="w-full mt-3 bg-blue-600 text-white text-xs py-1.5 rounded font-bold">
            View Full Cart
          </button>
        </div>
      `;

      L.marker(position, {
        icon: cart.isOpen ? openIcon : customIcon
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

  return <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
}
