"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Map, MapPin } from "lucide-react";

import Image from "next/image";
import cartImage from "@/assets/cart.png";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [carts, setCarts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCarts = async () => {
      const supabase = createClient();
      
      // Fetch the latest 3 open carts
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!cartError && cartData) {
        setCarts(cartData);
      } else {
        // Fallback to any 3 carts if none are open
        const { data: fallbackData } = await supabase
          .from('carts')
          .select(`*, menu_items (*)`)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (fallbackData) setCarts(fallbackData);
      }
    };
    
    fetchCarts();
  }, []);

  return (
    // min-h-screen to cover the viewport. flex-col and justify-center for vertical centering.
    // pt-24 provides padding at the top so the floating navbar doesn't cover the content.
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-4 overflow-hidden">
      
      {/* 
        BACKGROUND BLOBS
        We use soft colored circular divs with heavy blur to create a dreamy background.
        This enhances the glassmorphism aesthetic.
      */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float hidden md:block" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float hidden md:block" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground"
        >
          Find the Best <br />
          <span className="text-primary">Food Carts</span> Near You
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Discover hidden culinary gems, check out live locations, and explore menus of street food carts in your area.
        </motion.p>

        {/* Search Bar - Glassmorphism style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex items-center justify-center"
        >
          <div className="relative w-full max-w-md">
            <div className="glass-panel rounded-full flex items-center overflow-hidden p-1 shadow-md">
              <span className="pl-4 text-muted-foreground"><Map size={20} /></span>
              <input 
                type="text" 
                placeholder="Select your area..." 
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground"
              />
              <button className="neumorph-flat bg-primary text-primary-foreground p-3 rounded-full hover:neumorph-pressed transition-shadow flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Cart Listings from LocalStorage */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 w-full max-w-5xl z-10"
      >
        {carts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carts.slice(0, 3).map((cart, idx) => (
              <div 
                key={cart.id} 
                onClick={() => router.push(`/cart/${cart.id}`)}
                className="glass-panel p-5 rounded-3xl md:animate-float border-white/60 shadow-lg hover:-translate-y-2 transition-transform cursor-pointer"
                style={{ animationDelay: `${idx * 0.5}s` }}
              >
                <div className={`w-full h-32 rounded-2xl mb-4 overflow-hidden relative shadow-inner flex items-center justify-center ${idx % 3 === 0 ? 'bg-primary/20' : idx % 3 === 1 ? 'bg-secondary/20' : 'bg-tertiary/20'}`}>
                  {cart.image_url ? (
                    <Image src={cart.image_url} alt="Cart Photo" fill className="object-cover" />
                  ) : (
                    <Image src={cartImage} alt="Cart Logo" fill className="object-contain p-4 opacity-50" />
                  )}
                </div>
                <h3 className="font-bold text-foreground text-lg line-clamp-1">{cart.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {cart.location || "Location not set"}
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${cart.is_open ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {cart.is_open ? 'Open' : 'Closed'}
                  </span>
                  {cart.menu_items?.slice(0, 2).map((item: any) => (
                    <span key={item.id} className="px-3 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-full font-medium truncate max-w-[100px]">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 glass-panel rounded-3xl border-white/60 shadow-md">
            <h3 className="text-xl font-semibold text-foreground mb-2">No food carts found</h3>
            <p className="text-muted-foreground">Sign in as an owner to create the first cart in this area!</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
