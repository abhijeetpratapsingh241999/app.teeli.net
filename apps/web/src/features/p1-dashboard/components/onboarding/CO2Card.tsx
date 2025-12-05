"use client";

/**
 * Card 4: CO₂ Estimate
 * Sustainability and carbon footprint tracking
 */

import { motion } from "framer-motion";
import { Leaf } from "@phosphor-icons/react";
import { GradientBorder } from "./GradientBorder";

export function CO2Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="p-2.5 sm:p-2.5 xl:p-4 rounded-lg xl:rounded-xl backdrop-blur-xl relative bg-white dark:bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.12)] dark:shadow-none tablet-card tablet-padding"
    >
      {/* Dark mode only: Green gradient background */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(145deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.08) 100%)",
        }}
      />
      
      <GradientBorder />
      
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center">
            <Leaf 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 transition-all duration-300"
              weight="fill"
              color="#10b981"
              style={{
                filter: "drop-shadow(0 0 12px rgba(16,185,129,1)) drop-shadow(0 0 24px rgba(16,185,129,0.6))"
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-[11px] sm:text-xs md:text-[13px] lg:text-sm">CO₂ Estimate</h3>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400">Sustainability</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 rounded-full text-emerald-600">Eco</span>
      </div>

      {/* CO2 Value */}
      <div className="text-center py-1.5 md:py-2 bg-white border border-emerald-200 rounded-md md:rounded-lg mb-1.5 md:mb-2">
        <span className="text-lg md:text-2xl font-bold text-emerald-600">0.2g</span>
        <p className="text-[8px] md:text-[10px] text-slate-500">CO₂ Emitted</p>
      </div>

      {/* Eco Stats */}
      <div className="grid grid-cols-2 gap-1 md:gap-1.5 mb-1.5 md:mb-2">
        <div className="bg-white border border-emerald-200 rounded-lg py-1.5 text-center">
          <p className="text-xs font-bold text-emerald-600">92%</p>
          <span className="text-[8px] text-slate-500">Efficiency</span>
        </div>
        <div className="bg-white border border-emerald-200 rounded-lg py-1.5 text-center">
          <p className="text-xs font-bold text-emerald-600">Green</p>
          <span className="text-[8px] text-slate-500">Node Type</span>
        </div>
      </div>

      <p className="text-[9px] text-slate-400 text-center">Powered by renewable energy</p>
    </motion.div>
  );
}
