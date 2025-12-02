"use client";

import { motion } from "framer-motion";
import { Wallet } from "@phosphor-icons/react";
import type { CardProps } from "../../types";

export function CostCard({ progress, pipelineState }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="p-4 rounded-xl backdrop-blur-xl relative"
      style={{
        background:
          "linear-gradient(145deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)",
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
          <Wallet
            size={36}
            weight="duotone"
            className="text-amber-500"
            style={{
              filter:
                "drop-shadow(0 0 8px rgba(245,158,11,0.6)) drop-shadow(0 0 16px rgba(245,158,11,0.4))",
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              Cost Estimate
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-300">
              Billing
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">
          USD
        </span>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-1.5 mb-2 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Diagnostic</span>
          <span className="font-medium text-slate-700 dark:text-white">
            $0.005
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">AI-Repair</span>
          <span className="font-medium text-slate-700 dark:text-white">
            $0.020
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">GPU Render</span>
          <span className="font-medium text-slate-700 dark:text-white">
            $0.015
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-white dark:bg-slate-800/50 border border-amber-200 dark:border-amber-500/30 rounded-lg p-2 mb-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-700 dark:text-white">
            Total
          </span>
          <span className="text-lg font-bold text-amber-600">$0.040</span>
        </div>
        <div className="flex justify-between text-[9px] mt-1">
          <span className="text-slate-400 dark:text-slate-500">Credits</span>
          <span className="font-medium text-amber-600">40 CR</span>
        </div>
      </div>

      <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center">
        ⚡ Pay-per-use pricing
      </p>
    </motion.div>
  );
}
