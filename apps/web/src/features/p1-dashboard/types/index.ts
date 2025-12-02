// ============================================================================
// PIPELINE TYPES
// ============================================================================

export type PipelineState = "idle" | "scanning" | "repairing" | "rendering" | "complete";

export interface PipelineProgress {
  scan: number;
  repair: number;
  render: number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface OnboardingHeroProps {
  onComplete?: () => void;
  modelUrl?: string;
}

export interface AnimationControls {
  startScan: () => void;
  startRepair: () => void;
  startRender: () => void;
}

export interface ViewerProps {
  modelUrl: string;
  pipelineState: PipelineState;
  progress: PipelineProgress;
  onSceneReady?: () => void;
  onModelLoaded?: () => void;
  onProgressUpdate?: (progress: { scan?: number; repair?: number; render?: number }) => void;
  onStateChange?: (state: PipelineState) => void;
  animationControlsRef?: React.MutableRefObject<AnimationControls | null>;
}

export interface CardProps {
  progress: PipelineProgress;
  pipelineState: PipelineState;
}

export interface ScanCardProps extends CardProps {
  onScan: () => void;
}

export interface HealCardProps extends CardProps {
  onHeal: () => void;
}

export interface RenderCardProps extends CardProps {
  onRender: () => void;
}

// ============================================================================
// 3D SCENE TYPES
// ============================================================================

export interface SceneConfig {
  cameraAlpha: number;
  cameraBeta: number;
  cameraRadius: number;
  cameraTarget: [number, number, number];
}

export interface ModelAnimationState {
  clipPlaneY: number;
  isAnimating: boolean;
  meshOpacity: number;
}
