/**
 * TopBar - React Component
 * Floating Glass Capsule Header
 */

"use client";

import { motion } from "framer-motion";

export function TopBar(): React.ReactElement {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-4 left-4 right-4 h-12 pointer-events-auto"
    >
      <div className="h-full px-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-between shadow-2xl shadow-black/50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-white/90 font-semibold tracking-tight">
            Teeli Studio
          </span>
        </div>
        
        {/* Center - File Name */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-white/50 text-sm font-medium">
            Untitled Scene
          </span>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors">
            Export
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium transition-colors border border-cyan-500/30">
            Save
          </button>
        </div>
      </div>
    </motion.header>
  );
}
