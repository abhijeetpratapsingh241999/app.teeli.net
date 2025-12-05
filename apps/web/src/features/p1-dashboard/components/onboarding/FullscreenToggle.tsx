"use client";

/**
 * Fullscreen Toggle Button
 * Shows in tablet landscape mode to toggle 3D viewer fullscreen
 * Hides cards panel when fullscreen is active
 * @created 2025-12-03
 */

import { useState, useEffect, useCallback } from "react";
import { ArrowsOut, ArrowsIn } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface FullscreenToggleProps {
  onToggle?: (isFullscreen: boolean) => void;
}

export function FullscreenToggle({ onToggle }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if we're in tablet landscape mode
  useEffect(() => {
    const checkTabletLandscape = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsVisible(isTablet && isLandscape);
      
      // Reset fullscreen when switching to portrait
      if (!isLandscape && isFullscreen) {
        setIsFullscreen(false);
        onToggle?.(false);
      }
    };

    checkTabletLandscape();
    window.addEventListener("resize", checkTabletLandscape);
    window.addEventListener("orientationchange", checkTabletLandscape);

    return () => {
      window.removeEventListener("resize", checkTabletLandscape);
      window.removeEventListener("orientationchange", checkTabletLandscape);
    };
  }, [isFullscreen, onToggle]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    onToggle?.(newState);

    // Add/remove class to body for CSS targeting
    if (newState) {
      document.body.classList.add("viewer-fullscreen");
    } else {
      document.body.classList.remove("viewer-fullscreen");
    }
  }, [isFullscreen, onToggle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("viewer-fullscreen");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleFullscreen}
        className={`
          fixed z-40 p-2.5 rounded-xl
          transition-all duration-300
          backdrop-blur-md shadow-lg
          border border-white/20
          ${isFullscreen 
            ? "bottom-4 right-4 bg-purple-500/90 text-white" 
            : "top-20 right-4 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200"
          }
        `}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <ArrowsIn weight="bold" className="w-5 h-5" />
        ) : (
          <ArrowsOut weight="bold" className="w-5 h-5" />
        )}
      </motion.button>
    </AnimatePresence>
  );
}
