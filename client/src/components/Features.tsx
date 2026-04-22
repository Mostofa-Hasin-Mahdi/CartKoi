"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Menu as MenuIcon } from "lucide-react";

const features = [
  {
    title: "No Account Needed",
    description: "Leave anonymous reviews for your favorite carts instantly.",
    icon: <Star size={24} className="text-secondary" />,
  },
  {
    title: "Real-Time Tracking",
    description: "Know exactly where your favorite food cart is operating today.",
    icon: <MapPin size={24} className="text-primary" />,
  },
  {
    title: "Live Menus & Prices",
    description: "Check what's in stock and see current prices before you visit.",
    icon: <MenuIcon size={24} className="text-tertiary" />,
  },
];

export default function Features() {
  return (
    <section id="explore" className="w-full max-w-6xl mx-auto py-24 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Why CartKoi?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          The ultimate platform built specifically for the vibrant street food culture of Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            // Using neumorph-flat for a soft, tactile card
            className="neumorph-flat p-8 rounded-3xl flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-background shadow-[inset_2px_2px_5px_rgba(180,195,215,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
