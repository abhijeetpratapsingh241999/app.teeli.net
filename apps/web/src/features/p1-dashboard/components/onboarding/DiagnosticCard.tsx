"use client";

/**
 * Card 1: Auto-Diagnostic
 * Mesh analysis and scanning card
 * @updated 2025-12-03 - CO2Card Style (Light + Dark Mode)
 */

import { motion } from "framer-motion";
import { Crosshair, Play } from "@phosphor-icons/react";
import { GradientBorder } from "./GradientBorder";
import type { DiagnosticCardProps } from "./types";

export function DiagnosticCard({ pipelineState, progress, onScan }: DiagnosticCardProps) {
  const isScanning = pipelineState === "scanning";
  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-2.5 sm:p-2.5 xl:p-4 rounded-lg xl:rounded-xl backdrop-blur-xl relative bg-white dark:bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.12)] dark:shadow-none tablet-card tablet-padding"
    >
      {/* Dark mode only: Blue gradient background */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(145deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.08) 100%)",
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
            <Crosshair 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 transition-all duration-300"
              weight="fill"
              color={isComplete ? "#3b82f6" : isScanning ? "#3b82f6" : "#94a3b8"}
              style={{
                filter: isScanning 
                  ? "drop-shadow(0 0 12px rgba(59,130,246,1)) drop-shadow(0 0 24px rgba(59,130,246,0.6))" 
                  : isComplete 
                  ? "drop-shadow(0 0 12px rgba(59,130,246,1)) drop-shadow(0 0 24px rgba(59,130,246,0.6))" 
                  : "none"
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-[11px] sm:text-xs md:text-[13px] lg:text-sm">Auto-Diagnostic</h3>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400">Mesh Analysis</span>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          isComplete ? "bg-green-100 text-green-600" 
          : isScanning ? "bg-blue-100 text-blue-600" 
          : "bg-slate-100 text-slate-500"
        }`}>~5s</span>
      </div>
      
      {/* Mesh Health */}
      <div className="mb-2">
        <div className="flex justify-between text-[10px] md:text-xs mb-1">
          <span className="text-slate-600 dark:text-slate-300 font-medium">Mesh Health</span>
          <span className="font-bold text-slate-800 dark:text-white">{isComplete ? "100%" : `${progress.toFixed(0)}%`}</span>
        </div>
        <div className="h-1 md:h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className={isComplete ? "h-full bg-green-500" : "h-full bg-blue-500"}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Issues Found/Fixed */}
      <div className="grid grid-cols-3 gap-1 md:gap-1.5 mb-2 md:mb-3 text-center">
        <div className={`rounded-lg py-1.5 bg-white dark:bg-slate-800 border ${isComplete ? "border-green-200 dark:border-green-800" : "border-amber-200 dark:border-amber-800"}`}>
          <p className={`text-sm font-bold ${isComplete ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {isComplete ? "0" : "12"}
          </p>
          <span className="text-[8px] text-slate-600 dark:text-slate-400 font-semibold">Edges</span>
        </div>
        <div className={`rounded-lg py-1.5 bg-white dark:bg-slate-800 border ${isComplete ? "border-green-200 dark:border-green-800" : "border-amber-200 dark:border-amber-800"}`}>
          <p className={`text-sm font-bold ${isComplete ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {isComplete ? "0" : "8"}
          </p>
          <span className="text-[8px] text-slate-600 dark:text-slate-400 font-semibold">Holes</span>
        </div>
        <div className={`rounded-lg py-1.5 bg-white dark:bg-slate-800 border ${isComplete ? "border-green-200 dark:border-green-800" : "border-amber-200 dark:border-amber-800"}`}>
          <p className={`text-sm font-bold ${isComplete ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {isComplete ? "0" : "4"}
          </p>
          <span className="text-[8px] text-slate-600 dark:text-slate-400 font-semibold">Normals</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onScan}
        disabled={pipelineState !== "idle" || progress > 0}
        className={`w-full py-1.5 md:py-2 px-3 md:px-4 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-200 ${
          isComplete
            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-700"
            : isScanning
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
            : pipelineState !== "idle" || progress > 0
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
            : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-md"
        }`}
      >
        {isScanning ? (
          <div className="w-3 h-3 border-2 border-blue-700 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Play className="w-3 h-3" weight="fill" />
        )}
        {isComplete ? "✓ Scanned" : isScanning ? "Scanning..." : "Run Scan"}
      </button>
    </motion.div>
  );
}
