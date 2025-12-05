/**
 * StudioCanvas - React Component
 * Renders the Babylon.js canvas with window-level drag & drop
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneManager } from "./SceneManager";

export function StudioCanvas(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initialize SceneManager (which also initializes SelectionManager)
    const sceneManager = SceneManager.getInstance();
    sceneManager.initialize(canvas);
    
    // Window-level drag & drop handlers (bulletproof - bypasses all UI layers)
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Required: Set dropEffect to enable drop
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };
    
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
          await SceneManager.getInstance().loadModel(file);
        }
      }
    };
    
    // Attach to window for guaranteed event capture (bypasses UI overlays)
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    
    // Also attach to document as fallback
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      sceneManager.dispose();
    };
  }, []);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full outline-none block"
        style={{ pointerEvents: 'auto', touchAction: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          console.log("[Canvas HTML] Pointer Down at", e.clientX, e.clientY, "button:", e.button);
        }}
        onClick={(e) => {
          console.log("[Canvas HTML] Click at", e.clientX, e.clientY);
        }}
      />
      
      {/* Drop Zone Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center bg-cyan-500/5 border-2 border-dashed border-cyan-500/40 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                >
                  <span className="text-4xl">📦</span>
                </motion.div>
                <p className="text-cyan-400 font-semibold text-lg">Drop to import</p>
                <p className="text-cyan-400/50 text-sm mt-1">.glb, .gltf files</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
