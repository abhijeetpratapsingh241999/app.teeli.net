"use client";

/**
 * Swipe Hint Component
 * Shows "Swipe to explore" hint for first-time users in tablet portrait mode
 * Auto-dismisses after user scrolls or after 4 seconds
 * @created 2025-12-03
 */

import { useState, useEffect, useCallback } from "react";
import { HandSwipeLeft } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface SwipeHintProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const STORAGE_KEY = "teeli-swipe-hint-seen";

export function SwipeHint({ containerRef }: SwipeHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Check if we're in tablet portrait mode and hint not seen before
  useEffect(() => {
    const checkVisibility = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
      const isPortrait = window.innerHeight > window.innerWidth;
      const hasSeenHint = localStorage.getItem(STORAGE_KEY) === "true";
      
      setIsVisible(isTablet && isPortrait && !hasSeenHint && !hasScrolled);
    };

    // Delay showing hint for better UX (after cards load)
    const timer = setTimeout(checkVisibility, 1200);

    window.addEventListener("resize", checkVisibility);
    window.addEventListener("orientationchange", checkVisibility);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkVisibility);
      window.removeEventListener("orientationchange", checkVisibility);
    };
  }, [hasScrolled]);

  // Listen for scroll to dismiss hint
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollLeft > 30) {
        setHasScrolled(true);
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, "true");
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(STORAGE_KEY, "true");
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Manual dismiss
  const dismissHint = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          onClick={dismissHint}
          className="fixed bottom-[36vh] left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/90 dark:bg-purple-600/90 backdrop-blur-md shadow-lg cursor-pointer"
        >
          {/* Animated hand icon */}
          <motion.div
            animate={prefersReducedMotion ? {} : { x: [0, -8, 0] }}
            transition={prefersReducedMotion ? {} : { 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <HandSwipeLeft weight="fill" className="w-5 h-5 text-white" />
          </motion.div>
          
          <span className="text-sm font-medium text-white whitespace-nowrap">
            Swipe to explore
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
