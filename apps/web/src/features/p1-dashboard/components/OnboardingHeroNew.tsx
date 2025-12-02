"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, MagicWand } from "@phosphor-icons/react";

// Modular imports
import { Viewer3D } from "./viewer";
import { PipelineCards } from "./cards";
import { ViewerSkeleton, CardsSkeleton } from "./skeleton";
import { usePipelineProgress } from "../hooks";
import { fadeInUp, cardVariants, springTransition } from "./animations";
import { MODEL_CONFIG, SCENE_CONFIG } from "../constants/pipeline";
import type { PipelineState, ViewerProps } from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingHeroProps {
  onComplete?: () => void;
  modelUrl?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OnboardingHeroNew({
  onComplete,
  modelUrl = MODEL_CONFIG.defaultUrl,
}: OnboardingHeroProps) {
  // Pipeline state management via custom hook
  const { progress, pipelineState, setPipelineState, setProgress, resetProgress } = usePipelineProgress();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Animation controls (passed to viewer)
  const animationControlsRef = useRef<{
    startScan: () => void;
    startRepair: () => void;
    startRender: () => void;
  } | null>(null);

  // ========================================================================
  // ANIMATION TRIGGERS
  // ========================================================================
  
  const handleStartPipeline = useCallback(() => {
    if (pipelineState !== "idle" || progress.scan > 0) return;
    animationControlsRef.current?.startScan();
  }, [pipelineState, progress.scan]);

  const handleStartRepair = useCallback(() => {
    if (progress.scan < 100 || pipelineState !== "idle") return;
    animationControlsRef.current?.startRepair();
  }, [progress.scan, pipelineState]);

  const handleStartRender = useCallback(() => {
    if (progress.repair < 100 || pipelineState !== "idle") return;
    animationControlsRef.current?.startRender();
  }, [progress.repair, pipelineState]);

  const handleComplete = useCallback(() => {
    setShowUpload(true);
    onComplete?.();
  }, [onComplete]);

  // ========================================================================
  // VIEWER CALLBACKS
  // ========================================================================
  
  const handleSceneReady = useCallback(() => {
    setIsLoading(false);
    setIsSceneReady(true);
  }, []);

  const handleProgressUpdate = useCallback((newProgress: { scan?: number; repair?: number; render?: number }) => {
    setProgress((prev) => ({ ...prev, ...newProgress }));
  }, [setProgress]);

  const handleStateChange = useCallback((state: PipelineState) => {
    setPipelineState(state);
    if (state === "complete") {
      handleComplete();
    }
  }, [setPipelineState, handleComplete]);

  // ========================================================================
  // VIEWER PROPS
  // ========================================================================
  
  const viewerProps: ViewerProps = {
    modelUrl,
    pipelineState,
    progress,
    onSceneReady: handleSceneReady,
    onProgressUpdate: handleProgressUpdate,
    onStateChange: handleStateChange,
    animationControlsRef,
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 flex flex-col lg:flex-row h-full min-h-screen p-4 lg:p-8 gap-6">
        
        {/* Left Section: 3D Viewer */}
        <motion.div
          className="flex-1 min-h-[400px] lg:min-h-0 relative"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10">
            {/* Lazy-loaded 3D Viewer */}
            {isLoading && <ViewerSkeleton />}
            <Viewer3D {...viewerProps} />
            
            {/* Start Button Overlay */}
            <AnimatePresence>
              {isSceneReady && pipelineState === "idle" && progress.scan === 0 && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    onClick={handleStartPipeline}
                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-semibold text-white text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-3">
                      <Play weight="fill" className="w-6 h-6" />
                      Start Pipeline
                    </span>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Section: Pipeline Cards */}
        <motion.div
          className="lg:w-[420px] flex flex-col gap-4"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="text-center lg:text-left mb-2">
            <h2 className="text-2xl font-bold text-white">
              AI Processing Pipeline
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Automated 3D model optimization
            </p>
          </div>

          {/* Pipeline Cards (Lazy skeleton until ready) */}
          {!isSceneReady ? (
            <CardsSkeleton />
          ) : (
            <PipelineCards
              progress={progress}
              pipelineState={pipelineState}
              onStartRepair={handleStartRepair}
              onStartRender={handleStartRender}
            />
          )}

          {/* Upload New Model Button (After Complete) */}
          <AnimatePresence>
            {showUpload && (
              <motion.button
                className="mt-4 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MagicWand weight="bold" className="w-5 h-5" />
                Upload New Model
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Pipeline State Indicator */}
      <AnimatePresence>
        {pipelineState !== "idle" && pipelineState !== "complete" && (
          <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 text-white text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {pipelineState === "scanning" && "Analyzing geometry..."}
              {pipelineState === "repairing" && "Optimizing mesh..."}
              {pipelineState === "rendering" && "Generating preview..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OnboardingHeroNew;
