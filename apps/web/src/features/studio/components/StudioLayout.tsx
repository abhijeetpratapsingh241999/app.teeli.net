/**
 * StudioLayout - React Component
 * Main fullscreen container with cinematic loading
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StudioCanvas } from "../core/StudioCanvas";
import { useEngineStore } from "../core/EngineStore";
import { TopBar } from "./Header/TopBar";
import { LeftToolbar } from "./Panels/LeftToolbar";
import { RightProperties } from "./Panels/RightProperties";
import { ViewCube } from "./Viewport/ViewCube";

export function StudioLayout(): React.ReactElement {
  const isLoading = useEngineStore((s) => s.isLoading);
  const loadingProgress = useEngineStore((s) => s.loadingProgress);
  const loadingMessage = useEngineStore((s) => s.loadingMessage);
  
  return (
    <div className="relative w-screen h-screen bg-[#050505] overflow-hidden">
      {/* Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <StudioCanvas />
      </div>
      
      {/* UI Overlays Layer - pointer-events-none on container */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <TopBar />
        <LeftToolbar />
        <RightProperties />
        <ViewCube />
      </div>
      
      {/* Cinematic Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center"
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full scale-150" />
              
              {/* Logo */}
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <span className="text-white font-bold text-3xl">T</span>
              </div>
            </motion.div>
            
            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-white/60 text-sm font-medium"
            >
              {loadingMessage}
            </motion.p>
            
            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.4 }}
              className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            {/* Spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
