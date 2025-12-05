"use client";

/**
 * Zoom Controls Component
 * +/- buttons for 3D model zoom in tablet landscape mode
 * Controls Babylon.js camera radius
 * @created 2025-12-03
 */

import { useState, useEffect, useCallback } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomChange?: (zoomLevel: number) => void;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onZoomChange,
  minZoom = 3,
  maxZoom = 12,
  initialZoom = 6,
}: ZoomControlsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const prefersReducedMotion = useReducedMotion();

  // Check if we're in tablet landscape mode
  useEffect(() => {
    const checkTabletLandscape = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsVisible(isTablet && isLandscape);
    };

    checkTabletLandscape();
    window.addEventListener("resize", checkTabletLandscape);
    window.addEventListener("orientationchange", checkTabletLandscape);

    return () => {
      window.removeEventListener("resize", checkTabletLandscape);
      window.removeEventListener("orientationchange", checkTabletLandscape);
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    if (zoomLevel > minZoom) {
      const newZoom = Math.max(minZoom, zoomLevel - 1);
      setZoomLevel(newZoom);
      onZoomIn?.();
      onZoomChange?.(newZoom);
    }
  }, [zoomLevel, minZoom, onZoomIn, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel < maxZoom) {
      const newZoom = Math.min(maxZoom, zoomLevel + 1);
      setZoomLevel(newZoom);
      onZoomOut?.();
      onZoomChange?.(newZoom);
    }
  }, [zoomLevel, maxZoom, onZoomOut, onZoomChange]);

  const canZoomIn = zoomLevel > minZoom;
  const canZoomOut = zoomLevel < maxZoom;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2"
      >
        {/* Zoom In (+) */}
        <motion.button
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          onClick={handleZoomIn}
          disabled={!canZoomIn}
          className={`
            p-2.5 rounded-xl backdrop-blur-md shadow-lg
            border border-white/20 dark:border-slate-700/30
            transition-all duration-200
            ${canZoomIn
              ? "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
              : "bg-white/50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 cursor-not-allowed"
            }
          `}
          aria-label="Zoom in"
        >
          <Plus weight="bold" className="w-5 h-5" />
        </motion.button>

        {/* Zoom indicator */}
        <div className="px-2 py-1 rounded-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm text-center">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {Math.round(((maxZoom - zoomLevel) / (maxZoom - minZoom)) * 100)}%
          </span>
        </div>

        {/* Zoom Out (-) */}
        <motion.button
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          onClick={handleZoomOut}
          disabled={!canZoomOut}
          className={`
            p-2.5 rounded-xl backdrop-blur-md shadow-lg
            border border-white/20 dark:border-slate-700/30
            transition-all duration-200
            ${canZoomOut
              ? "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
              : "bg-white/50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 cursor-not-allowed"
            }
          `}
          aria-label="Zoom out"
        >
          <Minus weight="bold" className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
