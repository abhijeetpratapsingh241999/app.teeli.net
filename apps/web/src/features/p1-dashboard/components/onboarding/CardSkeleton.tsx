"use client";

/**
 * Card Skeleton Loader Component
 * Shows shimmer loading animation for pipeline cards
 * Works in both portrait and landscape tablet modes
 * @created 2025-12-03
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface CardSkeletonProps {
  variant?: "default" | "wide"; // wide for RenderCard
}

export function CardSkeleton({ variant = "default" }: CardSkeletonProps) {
  const isWide = variant === "wide";
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/60 dark:bg-slate-800/60
        backdrop-blur-sm border border-white/20 dark:border-slate-700/30
        ${isWide ? "tablet-card-wide" : "tablet-card"}
      `}
    >
      {/* Shimmer overlay - disabled for reduced motion */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-slate-600/40 to-transparent" />
      )}

      <div className={`p-3 space-y-3 ${isWide ? "p-4" : ""}`}>
        {/* Header row - Icon + Title */}
        <div className="flex items-center gap-2">
          {/* Icon skeleton */}
          <div className="w-8 h-8 rounded-lg bg-slate-200/70 dark:bg-slate-700/70" />
          {/* Title skeleton */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-20 rounded bg-slate-200/70 dark:bg-slate-700/70" />
            <div className="h-2 w-14 rounded bg-slate-200/50 dark:bg-slate-700/50" />
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="h-1.5 w-full rounded-full bg-slate-200/70 dark:bg-slate-700/70" />

        {/* Content area */}
        {isWide ? (
          // Wide card - 2x2 grid for GPU info
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-2 w-10 rounded bg-slate-200/50 dark:bg-slate-700/50" />
                <div className="h-3 w-14 rounded bg-slate-200/70 dark:bg-slate-700/70" />
              </div>
            ))}
          </div>
        ) : (
          // Default card - simple content
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded bg-slate-200/60 dark:bg-slate-700/60" />
            <div className="h-2.5 w-3/4 rounded bg-slate-200/50 dark:bg-slate-700/50" />
          </div>
        )}

        {/* Button skeleton */}
        <div className="h-7 w-full rounded-lg bg-slate-200/70 dark:bg-slate-700/70" />
      </div>
    </motion.div>
  );
}

/**
 * Multiple Card Skeletons for loading state
 */
export function CardSkeletons() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton variant="wide" />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}
