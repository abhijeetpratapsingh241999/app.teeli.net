/**
 * Types for OnboardingHero Modular Components
 */

// Props
export interface OnboardingHeroProps {
  onComplete?: () => void;
  modelUrl?: string;
}

// Pipeline state machine
export type PipelineState = "idle" | "scanning" | "repairing" | "rendering" | "complete";

// Progress tracking
export interface ProgressState {
  scan: number;
  repair: number;
  render: number;
}

// Card props
export interface DiagnosticCardProps {
  pipelineState: PipelineState;
  progress: number;
  onScan: () => void;
}

export interface RepairCardProps {
  pipelineState: PipelineState;
  progress: number;
  scanComplete: boolean;
  onRepair: () => void;
}

export interface RenderCardProps {
  pipelineState: PipelineState;
  progress: number;
  repairComplete: boolean;
  onRender: () => void;
}
