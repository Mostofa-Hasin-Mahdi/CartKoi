"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, User, LogIn } from "lucide-react";

export default function NavBar() {
  return (
    // framer-motion helps us animate the navbar sliding up when the page loads
    <motion.header
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // 'fixed' keeps it floating at the bottom like a dock.
      // 'glass-panel' is our custom class from globals.css that adds the blur, translucent bg, and border.
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl z-50 rounded-full glass-panel px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {/* CartKoi logo placeholder */}
        <Link href="/" className="text-xl font-bold text-foreground">
          Cart<span className="text-primary">Koi</span>
        </Link>
      </div>

      <nav className="flex items-center gap-3 md:gap-6">
        <Link href="#explore" className="text-xs md:text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
          <MapPin size={16} /> <span className="hidden sm:inline">Explore</span>
        </Link>
        <Link href="#owners" className="text-xs md:text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
          <User size={16} /> <span className="hidden sm:inline">For Owners</span>
        </Link>
      </nav>

      <div>
        {/* Using our neumorph-flat class for a soft 3D button effect */}
        <Link 
          href="/login" 
          className="flex items-center gap-2 px-4 py-2 rounded-full neumorph-flat text-sm font-medium text-primary-foreground hover:neumorph-pressed transition-shadow bg-primary"
        >
          <LogIn size={16} /> Login
        </Link>
      </div>
    </motion.header>
  );
}
