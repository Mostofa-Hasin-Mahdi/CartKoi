"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OwnerCTA() {
  return (
    <section id="owners" className="w-full max-w-5xl mx-auto py-24 px-4 mb-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        // A large glass panel to draw attention
        className="glass-panel p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden"
      >
        {/* Decorative background blur inside the card - Hidden on mobile to prevent lag */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 hidden md:block" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 hidden md:block" />

        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          Own a Food Cart?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Join CartKoi to showcase your menus, update your daily location, manage stock with your employees, and reach more hungry customers in your area.
        </p>

        <Link 
          href="/register-cart" 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full neumorph-flat bg-primary text-primary-foreground font-semibold text-lg hover:neumorph-pressed transition-shadow"
        >
          Partner With Us <ArrowRight size={20} />
        </Link>
      </motion.div>
    </section>
  );
}
