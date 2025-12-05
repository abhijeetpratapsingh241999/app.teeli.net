"use client";

/**
 * Card 5: Cost Estimate
 * Billing and pricing breakdown
 */

import { motion } from "framer-motion";
import { Coins } from "@phosphor-icons/react";
import { GradientBorder } from "./GradientBorder";

export function CostCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="p-2.5 sm:p-2.5 xl:p-4 rounded-lg xl:rounded-xl backdrop-blur-xl relative bg-white dark:bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.12)] dark:shadow-none tablet-card tablet-padding"
    >
      {/* Dark mode only: Amber gradient background */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(145deg, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.08) 100%)",
        }}
      />
      
      <GradientBorder />
      
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center">
            <Coins 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 transition-all duration-300"
              weight="fill"
              color="#f59e0b"
              style={{
                filter: "drop-shadow(0 0 12px rgba(245,158,11,1)) drop-shadow(0 0 24px rgba(245,158,11,0.6))"
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-[11px] sm:text-xs md:text-[13px] lg:text-sm">Cost Estimate</h3>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400">Billing</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-amber-100 rounded-full text-amber-600">USD</span>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-1 md:space-y-1.5 mb-1.5 md:mb-2 text-[9px] md:text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Diagnostic</span>
          <span className="font-medium text-slate-700">$0.005</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">AI-Repair</span>
          <span className="font-medium text-slate-700">$0.020</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">GPU Render</span>
          <span className="font-medium text-slate-700">$0.015</span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-white border border-amber-200 rounded-md md:rounded-lg p-1.5 md:p-2 mb-1.5 md:mb-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] md:text-xs font-semibold text-slate-700">Total</span>
          <span className="text-sm md:text-lg font-bold text-amber-600">$0.040</span>
        </div>
        <div className="flex justify-between text-[9px] mt-1">
          <span className="text-slate-400">Credits</span>
          <span className="font-medium text-amber-600">40 CR</span>
        </div>
      </div>

      <p className="text-[9px] text-slate-400 text-center">⚡ Pay-per-use pricing</p>
    </motion.div>
  );
}
