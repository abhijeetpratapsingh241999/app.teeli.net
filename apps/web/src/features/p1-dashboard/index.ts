// ============================================================================
// P1 DASHBOARD FEATURE MODULE
// 
// This is the main export file for the dashboard feature.
// Import from here for the cleanest API.
// ============================================================================

// Components
export {
  OnboardingHeroNew,
  OnboardingHero,
  Viewer3D,
  PipelineCards,
  ViewerSkeleton,
  CardsSkeleton,
} from "./components";

// Hooks
export { usePipelineProgress, useBabylonScene } from "./hooks";

// Types
export type {
  PipelineState,
  PipelineProgress,
  OnboardingHeroProps,
  ViewerProps,
  CardProps,
  AnimationControls,
} from "./types";

// Constants
export {
  INITIAL_PROGRESS,
  PIPELINE_STEPS,
  SCENE_CONFIG,
  CARD_COLORS,
  MODEL_CONFIG,
} from "./constants/pipeline";
