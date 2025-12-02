"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  Sparkle, 
  Lightning,
  CircleNotch,
  Check,
  Warning,
  Cpu,
  Leaf,
  CurrencyDollar,
} from "@phosphor-icons/react";

interface ControlPanelProps {
  step: number;
  onStepChange: (step: number) => void;
}

// Diagnostic Card Component
function DiagnosticCard({ 
  isEnabled, 
  isComplete, 
  isLoading, 
  onClick 
}: { 
  isEnabled: boolean; 
  isComplete: boolean; 
  isLoading: boolean; 
  onClick: () => void;
}) {
  const [animatedHealth, setAnimatedHealth] = useState(100);

  // Determine target health based on state
  const targetHealth = isComplete ? 45 : isLoading ? 45 : 100;

  useEffect(() => {
    if (isLoading) {
      // Animate health dropping during scan
      const interval = setInterval(() => {
        setAnimatedHealth(prev => Math.max(45, prev - 5));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Use target or animated value
  const healthPercent = isLoading ? animatedHealth : targetHealth;

  const errors = [
    { label: "Non-Manifold Edges", count: 12 },
    { label: "Holes Detected", count: 4 },
    { label: "Flipped Normals", count: 8 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-4 rounded-2xl
        bg-white/15 dark:bg-white/6
        backdrop-blur-3xl saturate-[1.8]
        border border-white/30 dark:border-white/20
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
        transition-all duration-300
        ${!isEnabled && !isComplete ? "opacity-40 grayscale-30" : ""}
        ${isEnabled && !isComplete ? "border-cyan-400/40 shadow-[0_0_30px_rgba(0,212,255,0.15)]" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${isComplete ? "bg-red-500/20" : "bg-cyan-500/20"}
        `}>
          {isComplete ? (
            <Warning size={20} weight="fill" className="text-red-400" />
          ) : (
            <Scan size={20} weight={isEnabled ? "fill" : "regular"} className="text-cyan-400" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
            Auto-Diagnostic
          </h3>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Mesh Analysis
          </p>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Mesh Health
          </span>
          <span className={`text-xs font-bold ${healthPercent > 70 ? "text-green-400" : healthPercent > 40 ? "text-amber-400" : "text-red-400"}`}>
            {healthPercent}%
          </span>
        </div>
        <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${healthPercent > 70 ? "bg-green-400" : healthPercent > 40 ? "bg-amber-400" : "bg-red-400"}`}
            initial={{ width: "100%" }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Error List - Only show when complete */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-2"
          >
            {errors.map((error, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Warning size={12} weight="fill" className="text-red-400" />
                  <span className="text-gray-600 dark:text-gray-300">{error.label}</span>
                </div>
                <span className="font-mono font-bold text-red-400">{error.count}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={onClick}
        disabled={!isEnabled || isLoading || isComplete}
        whileHover={isEnabled && !isLoading && !isComplete ? { scale: 1.02 } : {}}
        whileTap={isEnabled && !isLoading && !isComplete ? { scale: 0.98 } : {}}
        className={`
          w-full py-2 px-4 rounded-xl font-medium text-xs
          flex items-center justify-center gap-2
          transition-all duration-300
          ${isComplete 
            ? "bg-red-500/20 text-red-400 cursor-default"
            : isEnabled && !isLoading
              ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              : "bg-white/10 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <>
            <CircleNotch size={14} className="animate-spin" />
            Scanning...
          </>
        ) : isComplete ? (
          <>
            <Warning size={14} weight="fill" />
            24 Issues Found
          </>
        ) : (
          "Run Diagnostic"
        )}
      </motion.button>
    </motion.div>
  );
}

// Repair Card Component
function RepairCard({ 
  isEnabled, 
  isComplete, 
  isLoading, 
  onClick 
}: { 
  isEnabled: boolean; 
  isComplete: boolean; 
  isLoading: boolean; 
  onClick: () => void;
}) {
  const techSpecs = [
    { label: "Algorithm", value: "LibIGL" },
    { label: "Method", value: "Winding Number" },
    { label: "Precision", value: "Float64" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`
        relative p-4 rounded-2xl
        bg-white/15 dark:bg-white/6
        backdrop-blur-3xl saturate-[1.8]
        border border-white/30 dark:border-white/20
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
        transition-all duration-300
        ${!isEnabled && !isComplete ? "opacity-40 grayscale-30" : ""}
        ${isEnabled && !isComplete ? "border-violet-400/40 shadow-[0_0_30px_rgba(139,92,246,0.15)]" : ""}
        ${isComplete ? "border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.15)]" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${isComplete ? "bg-green-500/20" : "bg-violet-500/20"}
        `}>
          {isComplete ? (
            <Check size={20} weight="bold" className="text-green-400" />
          ) : (
            <Sparkle size={20} weight={isEnabled ? "fill" : "regular"} className="text-violet-400" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
            AI Repair
          </h3>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Mesh Reconstruction
          </p>
        </div>
      </div>

      {/* Tech Specs */}
      <div className="mb-4 space-y-2">
        {techSpecs.map((spec, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">{spec.label}</span>
            <span className="font-mono text-gray-700 dark:text-gray-200 bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Success State */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-400/30 flex items-center gap-3"
          >
            <Check size={24} weight="bold" className="text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-400">Mesh Watertight</p>
              <p className="text-[10px] text-green-400/70">All 24 issues resolved</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={onClick}
        disabled={!isEnabled || isLoading || isComplete}
        whileHover={isEnabled && !isLoading && !isComplete ? { scale: 1.02 } : {}}
        whileTap={isEnabled && !isLoading && !isComplete ? { scale: 0.98 } : {}}
        className={`
          w-full py-2 px-4 rounded-xl font-medium text-xs
          flex items-center justify-center gap-2
          transition-all duration-300
          ${isComplete 
            ? "bg-green-500/20 text-green-400 cursor-default"
            : isEnabled && !isLoading
              ? "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
              : "bg-white/10 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <>
            <CircleNotch size={14} className="animate-spin" />
            Repairing...
          </>
        ) : isComplete ? (
          <>
            <Check size={14} weight="bold" />
            Repairs Complete
          </>
        ) : (
          "Apply AI Fixes"
        )}
      </motion.button>
    </motion.div>
  );
}

// Render Card Component
function RenderCard({ 
  isEnabled, 
  isComplete, 
  isLoading, 
  onClick 
}: { 
  isEnabled: boolean; 
  isComplete: boolean; 
  isLoading: boolean; 
  onClick: () => void;
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const loadingStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Mark start time if not already set
      if (!loadingStartTimeRef.current) {
        loadingStartTimeRef.current = Date.now();
      }
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - (loadingStartTimeRef.current || Date.now());
        const progress = Math.min(100, Math.floor((elapsed / 2500) * 100));
        setAnimatedProgress(progress);
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      // Reset when not loading
      loadingStartTimeRef.current = null;
    }
  }, [isLoading]);

  // Use 100 when complete, animated value when loading, 0 otherwise
  const renderProgress = isComplete ? 100 : isLoading ? animatedProgress : 0;

  const hardwareSpecs = [
    { label: "Node", value: "NVIDIA A100" },
    { label: "Samples", value: "1024" },
    { label: "Resolution", value: "4K" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`
        relative p-4 rounded-2xl
        bg-white/15 dark:bg-white/6
        backdrop-blur-3xl saturate-[1.8]
        border border-white/30 dark:border-white/20
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
        transition-all duration-300
        ${!isEnabled && !isComplete ? "opacity-40 grayscale-30" : ""}
        ${isEnabled && !isComplete ? "border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : ""}
        ${isComplete ? "border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20">
          <Lightning size={20} weight={isEnabled || isComplete ? "fill" : "regular"} className="text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
            Cloud Render
          </h3>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            GPU Accelerated
          </p>
        </div>
      </div>

      {/* Hardware Specs */}
      <div className="mb-4 space-y-2">
        {hardwareSpecs.map((spec, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Cpu size={10} className="text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">{spec.label}</span>
            </div>
            <span className="font-mono text-gray-700 dark:text-gray-200 bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Render Progress */}
      {(isLoading || isComplete) && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Render Progress
            </span>
            <span className="text-xs font-bold text-amber-400">{renderProgress}%</span>
          </div>
          <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${renderProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Button */}
      <motion.button
        onClick={onClick}
        disabled={!isEnabled || isLoading || isComplete}
        whileHover={isEnabled && !isLoading && !isComplete ? { scale: 1.02 } : {}}
        whileTap={isEnabled && !isLoading && !isComplete ? { scale: 0.98 } : {}}
        className={`
          w-full py-2 px-4 rounded-xl font-medium text-xs
          flex items-center justify-center gap-2
          transition-all duration-300
          ${isComplete 
            ? "bg-amber-500/20 text-amber-400 cursor-default"
            : isEnabled && !isLoading
              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
              : "bg-white/10 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <>
            <CircleNotch size={14} className="animate-spin" />
            Rendering...
          </>
        ) : isComplete ? (
          <>
            <Check size={14} weight="bold" />
            Render Complete
          </>
        ) : (
          "Start Render"
        )}
      </motion.button>
    </motion.div>
  );
}

// Summary Card Component - Always visible
function SummaryCard({ step }: { step: number }) {
  // Calculate estimated values based on step progress
  const costValue = step === 0 ? "—" : step === 1 ? "$0.01" : step === 2 ? "$0.03" : "$0.05";
  const ecoValue = step === 0 ? "—" : step === 1 ? "0.05g" : step === 2 ? "0.1g" : "0.2g";
  const isActive = step > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`
        relative p-4 rounded-2xl
        bg-white/15 dark:bg-white/6
        backdrop-blur-3xl saturate-[1.8]
        border border-white/30 dark:border-white/20
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
        transition-all duration-300
        ${!isActive ? "opacity-50" : ""}
      `}
    >
      {/* Header */}
      <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        Session Estimate
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cost */}
        <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${
          isActive 
            ? "bg-amber-500/10 border-amber-400/20" 
            : "bg-white/5 border-white/10"
        }`}>
          <CurrencyDollar size={14} className={isActive ? "text-amber-400 mx-auto mb-1" : "text-gray-400 mx-auto mb-1"} />
          <p className={`text-xl font-bold ${isActive ? "text-amber-400" : "text-gray-400"}`}>
            {costValue}
          </p>
          <p className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Est. Cost
          </p>
        </div>

        {/* Eco */}
        <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${
          isActive 
            ? "bg-green-500/10 border-green-400/20" 
            : "bg-white/5 border-white/10"
        }`}>
          <Leaf size={14} className={isActive ? "text-green-400 mx-auto mb-1" : "text-gray-400 mx-auto mb-1"} />
          <p className={`text-xl font-bold ${isActive ? "text-green-400" : "text-gray-400"}`}>
            {ecoValue}
          </p>
          <p className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            CO₂ Emitted
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ControlPanel({ step, onStepChange }: ControlPanelProps) {
  const [loadingCard, setLoadingCard] = useState<number | null>(null);

  const handleAction = async (cardStep: number, nextStep: number, delay: number = 2000) => {
    setLoadingCard(cardStep);
    await new Promise(resolve => setTimeout(resolve, delay));
    setLoadingCard(null);
    onStepChange(nextStep);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* 2-Column Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Diagnostic Card */}
        <DiagnosticCard
          isEnabled={step === 0}
          isComplete={step >= 1}
          isLoading={loadingCard === 0}
          onClick={() => handleAction(0, 1, 2000)}
        />

        {/* Repair Card */}
        <RepairCard
          isEnabled={step === 1}
          isComplete={step >= 2}
          isLoading={loadingCard === 1}
          onClick={() => handleAction(1, 2, 2500)}
        />

        {/* Render Card */}
        <RenderCard
          isEnabled={step === 2}
          isComplete={step >= 3}
          isLoading={loadingCard === 2}
          onClick={() => handleAction(2, 3, 2500)}
        />

        {/* Summary Card - Always visible with estimates */}
        <SummaryCard step={step} />
      </div>

      {/* Reset button when complete */}
      {step === 3 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onStepChange(0)}
          className="
            py-2.5 px-4 rounded-xl font-medium text-xs
            bg-white/20 dark:bg-white/10
            text-gray-600 dark:text-gray-300
            hover:bg-white/30 dark:hover:bg-white/15
            border border-white/30 dark:border-white/15
            transition-all duration-300
          "
        >
          Reset Pipeline
        </motion.button>
      )}
    </div>
  );
}
