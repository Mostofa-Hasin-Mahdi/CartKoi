"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, User, LogIn, Store } from "lucide-react";

export default function NavBar() {
  return (
    <motion.header
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // Completely solid dark background (bg-slate-950). 
      // Always floating: bottom-4 on mobile, bottom-6 on desktop.
      className="fixed z-50 flex items-center bg-slate-950 text-white border border-slate-800 shadow-2xl transition-all duration-300 bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:w-max rounded-full px-4 py-3 md:px-8 md:py-3 justify-around"
    >
      <nav className="flex items-center w-full justify-around md:justify-center md:gap-8 flex-1">
        
        {/* Explore Tab */}
        <Link href="#explore" className="flex flex-col md:flex-row items-center gap-1 text-slate-400 hover:text-white transition-colors">
          <MapPin size={22} className="md:w-4 md:h-4" /> 
          <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Explore</span>
        </Link>
        
        {/* Carts Tab */}
        <Link href="#carts" className="flex flex-col md:flex-row items-center gap-1 text-slate-400 hover:text-white transition-colors">
          <Store size={22} className="md:w-4 md:h-4" /> 
          <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">Cart</span>
        </Link>
        
        {/* For Owners Tab */}
        <Link href="#owners" className="flex flex-col md:flex-row items-center gap-1 text-slate-400 hover:text-white transition-colors">
          <User size={22} className="md:w-4 md:h-4" /> 
          <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">For Owners</span>
        </Link>
        
        {/* Login Tab (Mobile Only) */}
        <Link href="/login" className="flex md:hidden flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
          <LogIn size={22} /> 
          <span className="text-[10px] font-medium mt-1">Login</span>
        </Link>
      </nav>

      {/* Desktop Login Button */}
      <div className="hidden md:block md:pl-8 md:border-l md:border-slate-800 md:ml-6">
        <Link 
          href="/login" 
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <LogIn size={16} /> Login
        </Link>
      </div>
    </motion.header>
  );
}
