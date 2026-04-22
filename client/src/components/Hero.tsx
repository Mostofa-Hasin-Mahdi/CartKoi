"use client";

import { motion } from "framer-motion";
import { Search, Map } from "lucide-react";

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
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />

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

      {/* Floating 3D Widget Cart (Visual hook) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 relative w-full max-w-4xl"
      >
        {/* We use our animate-float class from globals.css for continuous motion */}
        <div className="glass-panel p-6 rounded-3xl mx-auto w-full md:w-2/3 animate-float relative z-10 border-white/60 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shadow-inner">
               <span className="text-3xl">🍔</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 bg-muted rounded-md" />
              <div className="h-3 w-1/2 bg-muted/60 rounded-md" />
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-16 bg-tertiary/30 rounded-full" />
                <div className="h-6 w-16 bg-secondary/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative backdrop for the widget */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-b from-primary/10 to-transparent rounded-[3rem] -z-10 blur-xl" />
      </motion.div>
    </section>
  );
}
