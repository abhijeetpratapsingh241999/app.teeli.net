/**
 * ViewCube - React Component
 * Navigation cube for camera orientation
 */

"use client";

import { motion } from "framer-motion";

export function ViewCube(): React.ReactElement {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="absolute top-20 right-80 pointer-events-auto"
    >
      <div className="w-16 h-16 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 flex items-center justify-center overflow-hidden">
        {/* Cube visualization */}
        <div className="relative w-10 h-10" style={{ perspective: "80px" }}>
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(-20deg) rotateY(-25deg)",
            }}
          >
            {/* Cube face */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 border border-cyan-400/40 rounded-sm" />
          </div>
        </div>
      </div>
      
      {/* Quick view buttons */}
      <div className="mt-2 grid grid-cols-3 gap-1">
        {["F", "T", "R"].map((label) => (
          <button
            key={label}
            className="w-5 h-5 rounded text-[10px] font-bold bg-black/40 text-white/50 hover:bg-cyan-500/30 hover:text-cyan-400 transition-colors border border-white/5"
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
