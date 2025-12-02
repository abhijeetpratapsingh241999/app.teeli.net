"use client";

import { motion } from "framer-motion";
import { Sparkle, MagicWand } from "@phosphor-icons/react";
import type { HealCardProps } from "../../types";

export function HealCard({ progress, pipelineState, onHeal }: HealCardProps) {
  const isComplete = progress.repair >= 100;
  const isRepairing = pipelineState === "repairing";
  const isDisabled = progress.scan < 100 || progress.repair >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-4 rounded-xl backdrop-blur-xl transition-all duration-300 relative"
      style={{
        background: isRepairing
          ? "linear-gradient(145deg, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.04) 100%)"
          : isComplete
          ? "linear-gradient(145deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.75) 100%)",
        boxShadow: "0 4px 24px -2px rgba(0,0,0,0.08)",
      }}
    >
      {/* Gradient Border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          padding: "1.5px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0.15) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Sparkle
            size={36}
            weight="duotone"
            className={`${
              isComplete
                ? "text-green-500"
                : isRepairing
                ? "text-purple-500"
                : "text-purple-500"
            }`}
            style={{
              filter: isComplete
                ? "drop-shadow(0 0 8px rgba(34,197,94,0.6)) drop-shadow(0 0 16px rgba(34,197,94,0.4))"
                : "drop-shadow(0 0 8px rgba(168,85,247,0.6)) drop-shadow(0 0 16px rgba(168,85,247,0.4))",
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              AI Auto-Heal
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-300">
              Mesh Repair
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 rounded-full text-purple-600 dark:text-purple-400">
          ~4s
        </span>
      </div>

      {/* Repair Stats */}
      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2">
          <span className="text-slate-400 dark:text-slate-400 text-[10px]">
            Algorithm
          </span>
          <p className="font-medium text-slate-700 dark:text-white">LibIGL</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2">
          <span className="text-slate-400 dark:text-slate-400 text-[10px]">
            Precision
          </span>
          <p className="font-medium text-slate-700 dark:text-white">High</p>
        </div>
      </div>

      {/* Issues Fixed */}
      <div
        className={`rounded-lg py-2 px-3 mb-2 bg-white dark:bg-slate-800/50 border ${
          isComplete
            ? "border-green-200 dark:border-green-500/30"
            : "border-slate-200 dark:border-slate-600/30"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Issues Fixed
          </span>
          <span
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-slate-400"
            }`}
          >
            {isComplete ? "24/24" : "0/24"}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden mb-3">
        <motion.div
          className={isComplete ? "h-full bg-green-500" : "h-full bg-purple-500"}
          initial={{ width: 0 }}
          animate={{ width: `${progress.repair}%` }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onHeal}
        disabled={isDisabled}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md border shadow-lg shadow-black/30 antialiased ${
          isComplete
            ? "bg-green-500/20 border-green-400/40 text-white"
            : isRepairing
            ? "bg-purple-500/20 border-purple-400/40 text-white"
            : isDisabled
            ? "bg-slate-800/40 border-slate-600/30 text-slate-400 cursor-not-allowed"
            : "bg-slate-900/60 border-white/20 text-white hover:bg-slate-800/70 hover:border-white/30"
        }`}
      >
        {isRepairing ? (
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <MagicWand className="w-3.5 h-3.5 text-white" weight="fill" />
        )}
        <span className="tracking-wide">
          {isComplete
            ? "✓ Repaired"
            : isRepairing
            ? "Healing..."
            : "Auto-Heal"}
        </span>
      </button>
    </motion.div>
  );
}
