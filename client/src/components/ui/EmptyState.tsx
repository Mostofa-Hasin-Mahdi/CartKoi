import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"
      >
        <Icon size={40} className="text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
