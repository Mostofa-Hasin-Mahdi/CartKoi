"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Loader2, Store } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50">
      <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
      <p className="text-white font-medium">Loading Interactive Map...</p>
    </div>
  )
});

export default function ExplorePage() {
  const [carts, setCarts] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchCarts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .not('lat', 'is', null)
        .not('lng', 'is', null);

      if (error) {
        console.error("Error fetching carts:", error);
      } else if (data) {
        setCarts(data);
      }
    };

    fetchCarts();
  }, []);

  if (!isMounted) return null;

  return (
    <main className="flex h-screen w-full flex-col relative bg-slate-950 overflow-hidden">
      {/* Top Floating Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-20 md:top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-slate-900">
          <MapPin className="text-primary" size={20} />
          <h1 className="font-bold text-lg tracking-tight">CartKoi Discovery</h1>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {carts.filter(c => c.is_open).length} Open
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Store size={12} />
            {carts.length} Total
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="w-full h-full z-0">
        <MapComponent carts={carts} />
      </div>

      {/* Bottom overlay gradient so the navbar is readable */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
    </main>
  );
}
