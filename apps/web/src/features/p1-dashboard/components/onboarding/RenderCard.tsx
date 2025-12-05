"use client";

/**
 * Card 3: Cloud Render (Full Width)
 * GPU accelerated cloud rendering
 * @updated 2025-12-03 - CO2Card Style with Cyan Gradient (Light + Dark Mode)
 */

import { motion } from "framer-motion";
import { Cpu, Play } from "@phosphor-icons/react";
import { GradientBorder } from "./GradientBorder";
import type { RenderCardProps } from "./types";

export function RenderCard({ pipelineState, progress, repairComplete, onRender }: RenderCardProps) {
  const isRendering = pipelineState === "rendering";
  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="col-span-2 p-2.5 sm:p-2.5 xl:p-4 rounded-lg xl:rounded-xl backdrop-blur-xl relative bg-white dark:bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.12)] dark:shadow-none tablet-card-wide tablet-padding"
    >
      {/* Dark mode only: Cyan gradient background */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(145deg, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.08) 100%)",
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
            <Cpu 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 transition-all duration-300"
              weight="fill"
              color={isComplete ? "#06b6d4" : isRendering ? "#06b6d4" : "#94a3b8"}
              style={{
                filter: isRendering 
                  ? "drop-shadow(0 0 12px rgba(6,182,212,1)) drop-shadow(0 0 24px rgba(6,182,212,0.6))" 
                  : isComplete 
                  ? "drop-shadow(0 0 12px rgba(6,182,212,1)) drop-shadow(0 0 24px rgba(6,182,212,0.6))" 
                  : "none"
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-[11px] sm:text-xs md:text-[13px] lg:text-sm">Cloud Render</h3>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400">GPU Accelerated</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-cyan-100 rounded-full text-cyan-600">~8s</span>
      </div>

      {/* GPU Info Grid - Mobile: 2x2 grid, Desktop: 4 columns */}
      <div className="grid grid-cols-2 gap-1 mb-2 text-xs md:hidden">
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded px-2 py-1.5 text-center">
          <span className="text-slate-400 text-[8px] block">GPU</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 text-[10px]">A100</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded px-2 py-1.5 text-center">
          <span className="text-slate-400 text-[8px] block">Samples</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 text-[10px]">1024</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded px-2 py-1.5 text-center">
          <span className="text-slate-400 text-[8px] block">Resolution</span>
          <p className="font-medium text-slate-700 dark:text-slate-200 text-[10px]">4K</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded px-2 py-1.5 text-center">
          <span className="text-slate-400 text-[8px] block">Output</span>
          <p className={`font-medium text-[10px] ${isComplete ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`}>
            {isComplete ? "Ready" : "---"}
          </p>
        </div>
      </div>

      {/* GPU Info Grid - Desktop version */}
      <div className="hidden md:flex gap-2 mb-2 text-xs">
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 text-[10px]">GPU</span>
          <p className="font-medium text-slate-700 dark:text-slate-200">A100</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 text-[10px]">Samples</span>
          <p className="font-medium text-slate-700 dark:text-slate-200">1024</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 text-[10px]">Resolution</span>
          <p className="font-medium text-slate-700 dark:text-slate-200">4K</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 text-[10px]">Output</span>
          <p className={`font-medium ${isComplete ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`}>
            {isComplete ? "Ready" : "---"}
          </p>
        </div>
      </div>

      {/* Render Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-1.5 md:mb-2">
        <div className="rounded-lg py-1.5 text-center bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800">
          <p className={`text-sm font-bold ${isComplete ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`}>
            {isComplete ? "1024" : "0"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">Samples Done</span>
        </div>
        <div className="rounded-lg py-1.5 text-center bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800">
          <p className={`text-sm font-bold ${isComplete ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`}>
            {isComplete ? "3.2s" : "---"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">Render Time</span>
        </div>
        <div className="rounded-lg py-1.5 text-center bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800">
          <p className={`text-sm font-bold ${isComplete ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`}>
            {isComplete ? "12MB" : "---"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">File Size</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onRender}
        disabled={!repairComplete || isComplete}
        className={`w-full py-1.5 md:py-2 px-3 md:px-4 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-200 ${
          isComplete
            ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700"
            : isRendering
            ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700"
            : !repairComplete
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
            : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-md"
        }`}
      >
        {isRendering ? (
          <div className="w-3 h-3 border-2 border-cyan-700 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Play className="w-3 h-3" weight="fill" />
        )}
        {isComplete ? "✓ Complete" : isRendering ? "Rendering..." : "Cloud Render"}
      </button>
    </motion.div>
  );
}
