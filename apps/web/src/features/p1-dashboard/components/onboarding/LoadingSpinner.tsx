"use client";

/**
 * Loading Spinner Component
 * Transparent overlay with floating spinner
 */

import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <motion.div 
        className="flex flex-col items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Spinner with glow effect */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
          {/* Glow */}
          <div className="absolute inset-0 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl" />
        </div>
        {/* Text with subtle shadow for readability */}
        <p className="mt-4 text-slate-600 font-mono text-sm tracking-wider drop-shadow-sm">
          Loading...
        </p>
      </motion.div>
    </motion.div>
  );
}
