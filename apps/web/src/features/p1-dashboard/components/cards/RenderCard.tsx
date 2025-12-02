"use client";

import { motion } from "framer-motion";
import { Cpu } from "@phosphor-icons/react";
import type { RenderCardProps } from "../../types";

export function RenderCard({ progress, pipelineState, onRender }: RenderCardProps) {
  const isComplete = progress.render >= 100;
  const isRendering = pipelineState === "rendering";
  const isDisabled = progress.repair < 100 || progress.render >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="col-span-2 p-4 rounded-xl backdrop-blur-xl transition-all duration-300 relative"
      style={{
        background: isRendering
          ? "linear-gradient(145deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 100%)"
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
          <Cpu
            size={36}
            weight="duotone"
            className={`${
              isComplete
                ? "text-green-500"
                : isRendering
                ? "text-cyan-500"
                : "text-slate-400"
            }`}
            style={{
              filter: isComplete
                ? "drop-shadow(0 0 8px rgba(34,197,94,0.6)) drop-shadow(0 0 16px rgba(34,197,94,0.4))"
                : isRendering
                ? "drop-shadow(0 0 8px rgba(6,182,212,0.6)) drop-shadow(0 0 16px rgba(6,182,212,0.4))"
                : "none",
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              Cloud Render
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-300">
              GPU Accelerated
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-cyan-100 dark:bg-cyan-500/20 rounded-full text-cyan-600 dark:text-cyan-400">
          ~8s
        </span>
      </div>

      {/* GPU Info Grid */}
      <div className="flex gap-2 mb-2 text-xs">
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 dark:text-slate-400 text-[10px]">
            GPU
          </span>
          <p className="font-medium text-slate-700 dark:text-white">A100</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 dark:text-slate-400 text-[10px]">
            Samples
          </span>
          <p className="font-medium text-slate-700 dark:text-white">1024</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/30 rounded-lg px-3 py-2 flex-1">
          <span className="text-slate-400 dark:text-slate-400 text-[10px]">
            Resolution
          </span>
          <p className="font-medium text-slate-700 dark:text-white">4K</p>
        </div>
        <div
          className={`rounded-lg px-3 py-2 flex-1 bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-slate-200 dark:border-slate-600/30"
          }`}
        >
          <span className="text-slate-400 dark:text-slate-400 text-[10px]">
            Output
          </span>
          <p
            className={`font-medium ${
              isComplete ? "text-green-600" : "text-slate-400"
            }`}
          >
            {isComplete ? "Ready" : "---"}
          </p>
        </div>
      </div>

      {/* Render Stats */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div
          className={`rounded-lg py-1.5 text-center bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-slate-200 dark:border-slate-600/30"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-slate-400"
            }`}
          >
            {isComplete ? "1024" : "0"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Samples Done
          </span>
        </div>
        <div
          className={`rounded-lg py-1.5 text-center bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-slate-200 dark:border-slate-600/30"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-slate-400"
            }`}
          >
            {isComplete ? "3.2s" : "---"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Render Time
          </span>
        </div>
        <div
          className={`rounded-lg py-1.5 text-center bg-white dark:bg-slate-800/50 border ${
            isComplete
              ? "border-green-200 dark:border-green-500/30"
              : "border-slate-200 dark:border-slate-600/30"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isComplete ? "text-green-600" : "text-slate-400"
            }`}
          >
            {isComplete ? "12MB" : "---"}
          </p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            File Size
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden mb-3">
        <motion.div
          className={isComplete ? "h-full bg-green-500" : "h-full bg-cyan-500"}
          initial={{ width: 0 }}
          animate={{ width: `${progress.render}%` }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onRender}
        disabled={isDisabled}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md border shadow-lg shadow-black/30 antialiased ${
          isComplete
            ? "bg-green-500/20 border-green-400/40 text-white"
            : isRendering
            ? "bg-cyan-500/20 border-cyan-400/40 text-white"
            : isDisabled
            ? "bg-slate-800/40 border-slate-600/30 text-slate-400 cursor-not-allowed"
            : "bg-slate-900/60 border-white/20 text-white hover:bg-slate-800/70 hover:border-white/30"
        }`}
      >
        {isRendering ? (
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Cpu className="w-3.5 h-3.5 text-white" weight="fill" />
        )}
        <span className="tracking-wide">
          {isComplete
            ? "✓ Complete"
            : isRendering
            ? "Rendering..."
            : "Cloud Render"}
        </span>
      </button>
    </motion.div>
  );
}
