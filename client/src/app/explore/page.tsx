"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Store, Search, Filter, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/Skeleton";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full relative bg-slate-900/50 overflow-hidden">
      <Skeleton className="absolute top-20 md:top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md h-16 rounded-2xl bg-white/20" />
      <Skeleton className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-white/20" />
      <Skeleton className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-white/20" />
      <Skeleton className="absolute bottom-1/3 left-1/2 w-12 h-12 rounded-full bg-white/20" />
    </div>
  )
});

export default function ExplorePage() {
  const [carts, setCarts] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

  const filteredCarts = carts.filter((cart) => {
    const matchesSearch = cart.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOpen = showOnlyOpen ? cart.is_open : true;
    return matchesSearch && matchesOpen;
  });

  return (
    <main className="flex h-screen w-full flex-col relative bg-slate-950 overflow-hidden">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-20 md:top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-md bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-4 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <MapPin className="text-primary" size={20} />
            <h1 className="font-bold text-lg tracking-tight">CartKoi Discovery</h1>
          </div>
          <button 
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className={`p-2 rounded-full transition-colors ${isSearchExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Search size={16} />
          </button>
        </div>

        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative mb-3">
                <input 
                  type="text"
                  placeholder="Search carts by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            onClick={() => setShowOnlyOpen(!showOnlyOpen)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${showOnlyOpen ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-slate-100 border border-slate-200 text-slate-600'}`}
          >
            <div className={`w-2 h-2 rounded-full ${showOnlyOpen ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
            Open Now
          </button>
          
          <div className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap ml-auto">
            <Store size={12} />
            {filteredCarts.length} {filteredCarts.length === 1 ? 'Cart' : 'Carts'}
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="w-full h-full z-0">
        <MapComponent carts={filteredCarts} />
      </div>

      {/* Bottom overlay gradient so the navbar is readable */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
    </main>
  );
}
