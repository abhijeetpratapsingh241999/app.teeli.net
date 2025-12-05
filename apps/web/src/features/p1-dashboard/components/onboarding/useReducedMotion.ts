"use client";

/**
 * Reduced Motion Hook
 * Detects user's prefers-reduced-motion preference
 * Use this to disable/reduce animations for accessibility
 * @created 2025-12-03
 */

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") return;

    // Get the media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation duration based on reduced motion preference
 * @param normalDuration - Duration in seconds for normal motion
 * @param reducedDuration - Duration in seconds for reduced motion (default: 0)
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  if (typeof window === "undefined") return normalDuration;
  
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return prefersReduced ? reducedDuration : normalDuration;
}

/**
 * Framer Motion variants with reduced motion support
 */
export const reducedMotionVariants = {
  // Fade only (no movement)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Instant (no animation)
  instant: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

/**
 * Get transition config based on reduced motion preference
 */
export function getTransition(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return { duration: 0.1, ease: "linear" };
  }
  return { duration: 0.3, ease: [0.4, 0, 0.2, 1] };
}
