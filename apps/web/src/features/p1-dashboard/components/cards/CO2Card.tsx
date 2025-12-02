"use client";

import { motion } from "framer-motion";
import { Leaf } from "@phosphor-icons/react";
import type { CardProps } from "../../types";

export function CO2Card({ progress, pipelineState }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="p-4 rounded-xl backdrop-blur-xl relative"
      style={{
        background:
          "linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)",
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
          <Leaf
            size={36}
            weight="duotone"
            className="text-emerald-500"
            style={{
              filter:
                "drop-shadow(0 0 8px rgba(16,185,129,0.6)) drop-shadow(0 0 16px rgba(16,185,129,0.4))",
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              CO₂ Estimate
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-300">
              Sustainability
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400">
          Eco
        </span>
      </div>

      {/* CO2 Value */}
      <div className="text-center py-2 bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-lg mb-2">
        <span className="text-2xl font-bold text-emerald-600">0.2g</span>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          CO₂ Emitted
        </p>
      </div>

      {/* Eco Stats */}
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        <div className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-1.5 text-center">
          <p className="text-xs font-bold text-emerald-600">92%</p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Efficiency
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-1.5 text-center">
          <p className="text-xs font-bold text-emerald-600">Green</p>
          <span className="text-[8px] text-slate-500 dark:text-slate-400">
            Node Type
          </span>
        </div>
      </div>

      <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center">
        Powered by renewable energy
      </p>
    </motion.div>
  );
}
