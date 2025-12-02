"use client";

import { motion } from "framer-motion";

function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-700/50 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse mb-1" />
          <div className="h-3 w-16 bg-slate-700/30 rounded animate-pulse" />
        </div>
        <div className="h-5 w-12 bg-slate-700/30 rounded-full animate-pulse" />
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-slate-700/30 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-slate-700/30 rounded animate-pulse" />
      </div>

      {/* Button */}
      <div className="h-10 w-full bg-slate-700/50 rounded-xl animate-pulse" />
    </motion.div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Card 1 - Scan */}
      <CardSkeleton delay={0.1} />
      
      {/* Card 2 - Heal */}
      <CardSkeleton delay={0.2} />
      
      {/* Card 3 - Render (full width) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="col-span-2 p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-700/50 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-28 bg-slate-700/50 rounded animate-pulse mb-1" />
            <div className="h-3 w-20 bg-slate-700/30 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-16 bg-slate-700/30 rounded-lg animate-pulse" />
          ))}
        </div>
        
        <div className="h-10 w-full bg-slate-700/50 rounded-xl animate-pulse" />
      </motion.div>
      
      {/* Card 4 - CO2 */}
      <CardSkeleton delay={0.4} />
      
      {/* Card 5 - Cost */}
      <CardSkeleton delay={0.5} />
    </div>
  );
}
