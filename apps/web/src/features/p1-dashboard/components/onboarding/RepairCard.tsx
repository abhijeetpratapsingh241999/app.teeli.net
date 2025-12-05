"use client";

/**
 * Card 2: AI Auto-Heal
 * Mesh repair with AI algorithms
 * @updated 2025-12-03 - CO2Card Style with Purple Gradient (Light + Dark Mode)
 */

import { motion } from "framer-motion";
import { Sparkle, Play } from "@phosphor-icons/react";
import { GradientBorder } from "./GradientBorder";
import type { RepairCardProps } from "./types";

export function RepairCard({ pipelineState, progress, scanComplete, onRepair }: RepairCardProps) {
  const isRepairing = pipelineState === "repairing";
  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-2.5 sm:p-2.5 xl:p-4 rounded-lg xl:rounded-xl backdrop-blur-xl relative bg-white dark:bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.12)] dark:shadow-none tablet-card tablet-padding"
    >
      {/* Dark mode only: Purple gradient background */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(145deg, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.08) 100%)",
        }}
      />
      
      <GradientBorder />
      
      {/* Light mode only: Smooth black shadow on right-bottom border */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none dark:hidden"
        style={{
          background: "linear-gradient(135deg, transparent 0%, transparent 60%, rgba(0,0,0,0.04) 85%, rgba(0,0,0,0.08) 100%)",
        }}
      />
      
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center">
            <Sparkle 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 transition-all duration-300"
              weight="fill"
              color={isComplete ? "#a855f7" : isRepairing ? "#a855f7" : "#94a3b8"}
              style={{
                filter: isRepairing 
                  ? "drop-shadow(0 0 12px rgba(168,85,247,1)) drop-shadow(0 0 24px rgba(168,85,247,0.6))" 
                  : isComplete 
                  ? "drop-shadow(0 0 12px rgba(168,85,247,1)) drop-shadow(0 0 24px rgba(168,85,247,0.6))" 
                  : "none"
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-[11px] sm:text-xs md:text-[13px] lg:text-sm">AI Auto-Heal</h3>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400">Mesh Repair</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-purple-100 rounded-full text-purple-600">~4s</span>
      </div>

      {/* Repair Stats */}
      <div className="grid grid-cols-2 gap-1 md:gap-2 mb-1.5 md:mb-2 text-[10px] md:text-xs">
        <div className="bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-2">
          <span className="text-slate-400 text-[10px]">Algorithm</span>
          <p className="font-medium text-slate-700 dark:text-slate-200">LibIGL</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-2">
          <span className="text-slate-400 text-[10px]">Precision</span>
          <p className="font-medium text-slate-700 dark:text-slate-200">High</p>
        </div>
      </div>

      {/* Issues Fixed */}
      <div className={`rounded-lg py-2 px-3 mb-2 bg-white dark:bg-slate-800 border ${isComplete ? "border-green-200 dark:border-green-800" : "border-purple-200 dark:border-purple-800"}`}>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Issues Fixed</span>
          <span className={`text-sm font-bold ${isComplete ? "text-green-600 dark:text-green-400" : "text-purple-600 dark:text-purple-400"}`}>
            {isComplete ? "24/24" : "0/24"}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
        <motion.div
          className={isComplete ? "h-full bg-green-500" : "h-full bg-purple-500"}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onRepair}
        disabled={!scanComplete || isComplete}
        className={`w-full py-1.5 md:py-2 px-3 md:px-4 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-200 ${
          isComplete
            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-700"
            : isRepairing
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-700"
            : !scanComplete
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
            : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-md"
        }`}
      >
        {isRepairing ? (
          <div className="w-3 h-3 border-2 border-purple-700 dark:border-purple-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Play className="w-3 h-3" weight="fill" />
        )}
        {isComplete ? "✓ Repaired" : isRepairing ? "Healing..." : "Auto-Heal"}
      </button>
    </motion.div>
  );
}
