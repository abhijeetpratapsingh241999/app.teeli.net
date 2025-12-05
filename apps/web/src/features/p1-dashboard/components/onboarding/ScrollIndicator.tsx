"use client";

/**
 * Scroll Indicator Component
 * Shows dots and arrows for horizontal scroll in tablet portrait mode
 * - Max 4 dots visible at a time
 * - Dots window shifts with active card
 * - Auto-adjusts for any number of cards
 * @created 2025-12-03
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalCards: number;
}

const MAX_VISIBLE_DOTS = 4; // Maximum dots visible at once

export function ScrollIndicator({ containerRef, totalCards }: ScrollIndicatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Calculate which dots to show (sliding window)
  const visibleDots = useMemo(() => {
    if (totalCards <= MAX_VISIBLE_DOTS) {
      // Show all dots if total is less than max
      return Array.from({ length: totalCards }, (_, i) => i);
    }

    // Calculate window start based on active index
    let windowStart = Math.max(0, activeIndex - Math.floor(MAX_VISIBLE_DOTS / 2));
    
    // Adjust if window goes beyond total cards
    if (windowStart + MAX_VISIBLE_DOTS > totalCards) {
      windowStart = totalCards - MAX_VISIBLE_DOTS;
    }

    return Array.from({ length: MAX_VISIBLE_DOTS }, (_, i) => windowStart + i);
  }, [activeIndex, totalCards]);

  // Check if there are more dots before/after visible window
  const hasMoreBefore = visibleDots[0] > 0;
  const hasMoreAfter = visibleDots[visibleDots.length - 1] < totalCards - 1;

  // Check if we're in tablet portrait mode
  useEffect(() => {
    const checkTabletPortrait = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsVisible(isTablet && isPortrait);
    };

    checkTabletPortrait();
    window.addEventListener("resize", checkTabletPortrait);
    window.addEventListener("orientationchange", checkTabletPortrait);

    return () => {
      window.removeEventListener("resize", checkTabletPortrait);
      window.removeEventListener("orientationchange", checkTabletPortrait);
    };
  }, []);

  // Update scroll state
  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Calculate which card is most visible
    const cardWidth = 180; // Approximate card width in portrait
    const gap = 12; // Gap between cards
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, totalCards - 1));

    // Check if can scroll
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, [containerRef, totalCards]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
    };
  }, [containerRef, updateScrollState]);

  // Scroll to specific card
  const scrollToCard = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = 180;
    const gap = 12;
    const scrollPosition = index * (cardWidth + gap);

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  // Scroll left/right
  const scrollLeft = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  const scrollRight = () => {
    if (activeIndex < totalCards - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-slate-700/50"
      >
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`p-1 rounded-full transition-all duration-200 ${
            canScrollLeft
              ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
          }`}
          aria-label="Scroll left"
        >
          <CaretLeft weight="bold" className="w-4 h-4" />
        </button>

        {/* Dots Container with overflow indicator */}
        <div className="flex items-center gap-1">
          {/* Left overflow indicator */}
          {hasMoreBefore && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
              className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-0.5"
            />
          )}

          {/* Visible Dots */}
          <div className="flex items-center gap-1.5">
            {visibleDots.map((index) => (
              <motion.button
                key={index}
                onClick={() => scrollToCard(index)}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                className={`transition-all ${prefersReducedMotion ? "duration-100" : "duration-300"} rounded-full ${
                  index === activeIndex
                    ? "w-4 h-1.5 bg-purple-500 dark:bg-purple-400"
                    : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>

          {/* Right overflow indicator */}
          {hasMoreAfter && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
              className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 ml-0.5"
            />
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`p-1 rounded-full transition-all duration-200 ${
            canScrollRight
              ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
          }`}
          aria-label="Scroll right"
        >
          <CaretRight weight="bold" className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
