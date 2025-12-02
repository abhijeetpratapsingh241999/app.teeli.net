import type { PipelineProgress } from "../types";

// ============================================================================
// PIPELINE CONFIGURATION
// ============================================================================

export const INITIAL_PROGRESS: PipelineProgress = {
  scan: 0,
  repair: 0,
  render: 0,
};

export const PIPELINE_DURATIONS = {
  scan: 5000,    // 5 seconds
  repair: 4000,  // 4 seconds
  render: 8000,  // 8 seconds
} as const;

export const PIPELINE_STEPS = {
  scan: { increment: 2, interval: 100 },
  repair: { increment: 2.5, interval: 100 },
  render: { increment: 1.25, interval: 100 },
} as const;

// ============================================================================
// 3D SCENE CONFIGURATION
// ============================================================================

export const SCENE_CONFIG = {
  camera: {
    alpha: Math.PI / 2.2,
    beta: Math.PI / 2.3,
    radius: 3.2,
    target: [0, 0.4, 0] as [number, number, number],
    lowerRadiusLimit: 2,
    upperRadiusLimit: 6,
    lowerBetaLimit: 0.3,
    upperBetaLimit: Math.PI / 2,
    wheelPrecision: 50,
    panningSensibility: 0,
    inertia: 0.85,
  },
  lighting: {
    ambient: {
      intensity: 0.6,
      direction: [0, 1, 0] as [number, number, number],
    },
    key: {
      intensity: 1.5,
      position: [3, 5, 3] as [number, number, number],
      shadowDarkness: 0.5,
    },
    fill: {
      intensity: 0.8,
      position: [-3, 3, -2] as [number, number, number],
    },
  },
  background: {
    color: [0.06, 0.06, 0.08, 1] as [number, number, number, number],
  },
} as const;

// ============================================================================
// CARD CONFIGURATION
// ============================================================================

export const CARD_COLORS = {
  scan: {
    primary: "blue",
    gradient: "from-blue-400 to-blue-600",
    shadow: "shadow-blue-500/40",
    rgb: "59,130,246",
  },
  repair: {
    primary: "purple",
    gradient: "from-purple-400 to-purple-600",
    shadow: "shadow-purple-500/40",
    rgb: "168,85,247",
  },
  render: {
    primary: "cyan",
    gradient: "from-cyan-400 to-cyan-600",
    shadow: "shadow-cyan-500/40",
    rgb: "6,182,212",
  },
  co2: {
    primary: "emerald",
    gradient: "from-emerald-400 to-emerald-600",
    shadow: "shadow-emerald-500/40",
    rgb: "16,185,129",
  },
  cost: {
    primary: "amber",
    gradient: "from-amber-400 to-amber-600",
    shadow: "shadow-amber-500/40",
    rgb: "245,158,11",
  },
  success: {
    primary: "green",
    gradient: "from-green-400 to-green-600",
    shadow: "shadow-green-500/40",
    rgb: "34,197,94",
  },
} as const;

// ============================================================================
// MODEL CONFIGURATION
// ============================================================================

export const MODEL_CONFIG = {
  defaultUrl: "/models/drone.glb",
  clipPlane: {
    startY: 2,
    endY: -2,
    animationDuration: 3000,
  },
  scale: 1,
} as const;
