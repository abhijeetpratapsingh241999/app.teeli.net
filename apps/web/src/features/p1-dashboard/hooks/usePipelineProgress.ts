"use client";

import { useState, useCallback, useRef } from "react";
import type { PipelineState, PipelineProgress } from "../types";
import { INITIAL_PROGRESS, PIPELINE_STEPS } from "../constants/pipeline";

export function usePipelineProgress() {
  const [pipelineState, setPipelineState] = useState<PipelineState>("idle");
  const [progress, setProgress] = useState<PipelineProgress>(INITIAL_PROGRESS);
  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const clearAllIntervals = useCallback(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
  }, []);

  const animateScan = useCallback(() => {
    if (pipelineState !== "idle" || progress.scan > 0) return;
    
    setPipelineState("scanning");
    const { increment, interval } = PIPELINE_STEPS.scan;
    
    intervalsRef.current.scan = setInterval(() => {
      setProgress(prev => {
        if (prev.scan >= 100) {
          clearInterval(intervalsRef.current.scan);
          setPipelineState("idle");
          return { ...prev, scan: 100 };
        }
        return { ...prev, scan: Math.min(prev.scan + increment, 100) };
      });
    }, interval);
  }, [pipelineState, progress.scan]);

  const animateRepair = useCallback(() => {
    if (progress.scan < 100 || progress.repair >= 100) return;
    
    setPipelineState("repairing");
    const { increment, interval } = PIPELINE_STEPS.repair;
    
    intervalsRef.current.repair = setInterval(() => {
      setProgress(prev => {
        if (prev.repair >= 100) {
          clearInterval(intervalsRef.current.repair);
          setPipelineState("idle");
          return { ...prev, repair: 100 };
        }
        return { ...prev, repair: Math.min(prev.repair + increment, 100) };
      });
    }, interval);
  }, [progress.scan, progress.repair]);

  const animateRender = useCallback(() => {
    if (progress.repair < 100 || progress.render >= 100) return;
    
    setPipelineState("rendering");
    const { increment, interval } = PIPELINE_STEPS.render;
    
    intervalsRef.current.render = setInterval(() => {
      setProgress(prev => {
        if (prev.render >= 100) {
          clearInterval(intervalsRef.current.render);
          setPipelineState("complete");
          return { ...prev, render: 100 };
        }
        return { ...prev, render: Math.min(prev.render + increment, 100) };
      });
    }, interval);
  }, [progress.repair, progress.render]);

  const resetPipeline = useCallback(() => {
    clearAllIntervals();
    setPipelineState("idle");
    setProgress(INITIAL_PROGRESS);
  }, [clearAllIntervals]);

  const resetProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
  }, []);

  return {
    pipelineState,
    setPipelineState,
    progress,
    setProgress,
    animateScan,
    animateRepair,
    animateRender,
    resetPipeline,
    resetProgress,
  };
}
