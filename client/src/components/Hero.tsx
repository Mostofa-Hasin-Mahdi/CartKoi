"use client";

import { motion } from "framer-motion";
import { Search, Map, MapPin } from "lucide-react";

import Image from "next/image";
import cartImage from "@/assets/cart.png";

export default function Hero() {
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

      {/* Cart Listings (Uttara Locations) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 w-full max-w-5xl z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart 1 */}
          <div className="glass-panel p-5 rounded-3xl animate-float border-white/60 shadow-lg hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="w-full h-32 bg-primary/20 rounded-2xl mb-4 overflow-hidden relative shadow-inner">
              <Image src={cartImage} alt="Cart Logo" fill className="object-contain p-4" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Uttara Burger Cart</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin size={14} /> Sector 11, Uttara
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-tertiary/20 text-tertiary-foreground text-xs rounded-full font-medium">Open</span>
              <span className="px-3 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-full font-medium">Burgers</span>
              <span className="px-3 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-full font-medium">Pizza</span>
            </div>
          </div>

          {/* Cart 2 */}
          <div className="glass-panel p-5 rounded-3xl animate-float border-white/60 shadow-lg hover:-translate-y-2 transition-transform cursor-pointer" style={{ animationDelay: '1s' }}>
            <div className="w-full h-32 bg-secondary/20 rounded-2xl mb-4 overflow-hidden relative shadow-inner flex items-center justify-center">
              <Image src={cartImage} alt="Cart Logo" fill className="object-contain p-4" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Chui Jhal Mama Stand</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin size={14} /> Rabindra Sarani, Uttara
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-tertiary/20 text-tertiary-foreground text-xs rounded-full font-medium">Open</span>
              <span className="px-3 py-1 bg-primary/20 text-primary-foreground text-xs rounded-full font-medium">Beef</span>
              <span className="px-3 py-1 bg-primary/20 text-primary-foreground text-xs rounded-full font-medium">Chui Gosto</span>
            </div>
          </div>

          {/* Cart 3 */}
          <div className="glass-panel p-5 rounded-3xl animate-float border-white/60 shadow-lg hover:-translate-y-2 transition-transform cursor-pointer" style={{ animationDelay: '2s' }}>
            <div className="w-full h-32 bg-tertiary/20 rounded-2xl mb-4 overflow-hidden relative shadow-inner flex items-center justify-center">
              <Image src={cartImage} alt="Cart Logo" fill className="object-contain p-4" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Talukdar Chotpoti & Fuchka House</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin size={14} /> Sector 13 Lake, Uttara
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-tertiary/20 text-tertiary-foreground text-xs rounded-full font-medium">Open</span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">Fuchka</span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">Chotpoti</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
