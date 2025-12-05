"use client";

/**
 * Pipeline Cards Container
 * 2-column grid layout for all 5 cards + Action Button after render complete
 * 
 * @updated 2025-12-03 - Added tablet responsive (portrait/landscape)
 * 
 * Responsive Strategy:
 * - Mobile (default): Cards at bottom, vertical scroll
 * - Tablet Portrait: Cards at bottom, HORIZONTAL scroll (like carousel)
 * - Tablet Landscape: Cards on right side panel, vertical scroll
 * - Desktop (xl+): Cards on right side panel, 2-column grid
 */

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { DiagnosticCard } from "./DiagnosticCard";
import { RepairCard } from "./RepairCard";
import { RenderCard } from "./RenderCard";
import { CO2Card } from "./CO2Card";
import { CostCard } from "./CostCard";
import { ActionButton } from "./ActionButton";
import { ScrollIndicator } from "./ScrollIndicator";
import { CardSkeletons } from "./CardSkeleton";
import { SwipeHint } from "./SwipeHint";
import type { PipelineState, ProgressState } from "./types";

interface PipelineCardsProps {
  pipelineState: PipelineState;
  progress: ProgressState;
  onScan: () => void;
  onRepair: () => void;
  onRender: () => void;
  onActionComplete?: () => void;
  isLoading?: boolean; // External loading control
}

export function PipelineCards({
  pipelineState,
  progress,
  onScan,
  onRepair,
  onRender,
  onActionComplete,
  isLoading: externalLoading = false,
}: PipelineCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLDivElement>(null);
  
  // Internal loading state with minimum display time
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  // Check if render is complete (100%)
  const isRenderComplete = progress.render >= 100;

  // Show skeleton for minimum 800ms for smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Combined loading state
  const isLoading = showSkeleton || externalLoading;

  // Auto-scroll to show action button when render completes
  useEffect(() => {
    if (isRenderComplete && containerRef.current) {
      // Smooth scroll to bottom to show the action button
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    }
  }, [isRenderComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="absolute right-0 left-0 bottom-0 w-full max-h-[45vh] sm:max-h-[40vh] overflow-y-auto [&::-webkit-scrollbar]:hidden px-2 sm:px-3 pb-4 xl:right-4 xl:left-auto xl:top-24 xl:w-[560px] xl:max-h-none xl:overflow-y-auto xl:px-0 xl:pb-0 tablet-cards-container tablet-scroll-horizontal"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* 
        Grid Layout:
        - Mobile: 2-column vertical grid with bottom padding for scroll
        - Tablet Portrait: Horizontal flex (cards scroll horizontally) via tablet.css
        - Tablet Landscape: 2-column grid via tablet.css
        - Desktop (xl+): 2-column grid
      */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2 pt-2 sm:pt-2 pb-[40vh] sm:pb-[35vh] xl:gap-3 xl:pt-0 xl:pb-6 tablet-cards-grid">
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Skeleton Loading State */
            <CardSkeletons key="skeletons" />
          ) : (
            /* Actual Cards */
            <>
              {/* Card 1: Auto-Diagnostic */}
        <DiagnosticCard 
          pipelineState={pipelineState}
          progress={progress.scan}
          onScan={onScan}
        />

        {/* Card 2: AI Auto-Heal */}
        <RepairCard 
          pipelineState={pipelineState}
          progress={progress.repair}
          scanComplete={progress.scan >= 100}
          onRepair={onRepair}
        />

        {/* Card 3: GPU Render - Spans full width */}
        <RenderCard 
          pipelineState={pipelineState}
          progress={progress.render}
          repairComplete={progress.repair >= 100}
          onRender={onRender}
        />

        {/* Card 4: CO₂ Estimate */}
        <CO2Card />

        {/* Card 5: Cost Estimate */}
        <CostCard />

        {/* Action Button - Appears after render is complete */}
        <ActionButton 
          isVisible={isRenderComplete} 
          onAction={onActionComplete}
        />
            </>
          )}
        </AnimatePresence>

      </div>
      
      {/* Scroll Indicator - Only visible in tablet portrait mode */}
      <ScrollIndicator 
        containerRef={containerRef}
        totalCards={6}
      />
      
      {/* Swipe Hint - Shows once for first-time users in portrait mode */}
      <SwipeHint containerRef={containerRef} />
    </motion.div>
  );
}
