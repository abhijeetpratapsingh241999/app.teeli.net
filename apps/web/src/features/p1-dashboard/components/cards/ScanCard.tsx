"use client";

import { motion } from "framer-motion";
import { Crosshair, Play } from "@phosphor-icons/react";
import type { ScanCardProps } from "../../types";

export function ScanCard({ progress, pipelineState, onScan }: ScanCardProps) {
  const isComplete = progress.scan >= 100;
  const isScanning = pipelineState === "scanning";
  const isDisabled = pipelineState !== "idle" || progress.scan > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-4 rounded-xl backdrop-blur-xl transition-all duration-300 relative"
      style={{
        background: isScanning
          ? "linear-gradient(145deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)"
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
          <Crosshair
            size={36}
            weight="duotone"
            className={`${
              isComplete
                ? "text-green-500"
                : isScanning
                ? "text-blue-500"
                : "text-blue-500"
            }`}
            style={{
              filter: isComplete
                ? "drop-shadow(0 0 8px rgba(34,197,94,0.6)) drop-shadow(0 0 16px rgba(34,197,94,0.4))"
                : "drop-shadow(0 0 8px rgba(59,130,246,0.6)) drop-shadow(0 0 16px rgba(59,130,246,0.4))",
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              Auto-Diagnostic
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-300">
              Mesh Analysis
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-300">
          ~5s
        </span>
      </div>

      {/* Mesh Health */}
      <div className="mb-2.5">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-300">Mesh Health</span>
          <span className="font-medium text-slate-700 dark:text-white">
            {isComplete ? "100%" : `${progress.scan.toFixed(0)}%`}
          </span>
        </div>
        <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
          <motion.div
            className={isComplete ? "h-full bg-green-500" : "h-full bg-blue-500"}
            initial={{ width: 0 }}
            animate={{ width: `${progress.scan}%` }}
          />
        </div>
      </div>

      {/* Issues Found/Fixed */}
      <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
        <div
          className={`rounded-lg py-1.5 bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-amber-200 dark:border-amber-500/30"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-amber-600"
            }`}
          >
            {isComplete ? "0" : "12"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Edges
          </span>
        </div>
        <div
          className={`rounded-lg py-1.5 bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-amber-200 dark:border-amber-500/30"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-amber-600"
            }`}
          >
            {isComplete ? "0" : "8"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Holes
          </span>
        </div>
        <div
          className={`rounded-lg py-1.5 bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-amber-200 dark:border-amber-500/30"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-amber-600"
            }`}
          >
            {isComplete ? "0" : "4"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Normals
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onScan}
        disabled={isDisabled}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md border shadow-lg shadow-black/30 antialiased ${
          isComplete
            ? "bg-green-500/20 border-green-400/40 text-white"
            : isScanning
            ? "bg-blue-500/20 border-blue-400/40 text-white"
            : isDisabled
            ? "bg-slate-800/40 border-slate-600/30 text-slate-400 cursor-not-allowed"
            : "bg-slate-900/60 border-white/20 text-white hover:bg-slate-800/70 hover:border-white/30"
        }`}
      >
        {isScanning ? (
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Play className="w-3.5 h-3.5 text-white" weight="fill" />
        )}
        <span className="tracking-wide">
          {isComplete
            ? "✓ Scanned"
            : isScanning
            ? "Scanning..."
            : "Run Scan"}
        </span>
      </button>
    </motion.div>
  );
}
