/**
 * Onboarding Module - Barrel Exports
 * @updated 2025-12-03
 * 
 * This module contains all the modular components for the OnboardingHero.
 * Use these for code splitting and lazy loading.
 */

// Types
export * from "./types";

// UI Components
export { LoadingSpinner } from "./LoadingSpinner";
export { GradientBorder } from "./GradientBorder";

// Card Components
export { DiagnosticCard } from "./DiagnosticCard";
export { RepairCard } from "./RepairCard";
export { RenderCard } from "./RenderCard";
export { CO2Card } from "./CO2Card";
export { CostCard } from "./CostCard";
export { ActionButton } from "./ActionButton";
export { ProjectDashboard } from "./ProjectDashboard";

// Composite Components
export { PipelineCards } from "./PipelineCards";

// Tablet UI Components
export { ScrollIndicator } from "./ScrollIndicator";
export { CardSkeleton, CardSkeletons } from "./CardSkeleton";
export { SwipeHint } from "./SwipeHint";
export { ZoomControls } from "./ZoomControls";

// Accessibility Hooks
export { useReducedMotion, getAnimationDuration, getTransition, reducedMotionVariants } from "./useReducedMotion";

// Performance Optimization
export { useLOD, applyLODToEngine, getEngineOptions } from "./useLOD";
export type { LODConfig, LODLevel, DeviceCapability } from "./useLOD";
