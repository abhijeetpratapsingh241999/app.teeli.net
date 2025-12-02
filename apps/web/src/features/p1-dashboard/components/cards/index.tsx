"use client";

import { ScanCard } from "./ScanCard";
import { HealCard } from "./HealCard";
import { RenderCard } from "./RenderCard";
import { CO2Card } from "./CO2Card";
import { CostCard } from "./CostCard";
import type { PipelineState, PipelineProgress } from "../../types";

interface PipelineCardsProps {
  progress: PipelineProgress;
  pipelineState: PipelineState;
  onScan?: () => void;
  onHeal?: () => void;
  onRender?: () => void;
  onStartRepair?: () => void;
  onStartRender?: () => void;
}

export function PipelineCards({
  progress,
  pipelineState,
  onScan,
  onHeal,
  onRender,
  onStartRepair,
  onStartRender,
}: PipelineCardsProps) {
  // Use new prop names if provided, fallback to old ones
  const handleHeal = onStartRepair || onHeal || (() => {});
  const handleRender = onStartRender || onRender || (() => {});
  const handleScan = onScan || (() => {});

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Card 1: Auto-Diagnostic */}
      <ScanCard
        progress={progress}
        pipelineState={pipelineState}
        onScan={handleScan}
      />

      {/* Card 2: AI Auto-Heal */}
      <HealCard
        progress={progress}
        pipelineState={pipelineState}
        onHeal={handleHeal}
      />

      {/* Card 3: Cloud Render - Full Width */}
      <RenderCard
        progress={progress}
        pipelineState={pipelineState}
        onRender={handleRender}
      />

      {/* Card 4: CO₂ Estimate */}
      <CO2Card progress={progress} pipelineState={pipelineState} />

      {/* Card 5: Cost Estimate */}
      <CostCard progress={progress} pipelineState={pipelineState} />
    </div>
  );
}

export { ScanCard } from "./ScanCard";
export { HealCard } from "./HealCard";
export { RenderCard } from "./RenderCard";
export { CO2Card } from "./CO2Card";
export { CostCard } from "./CostCard";
