/**
 * EngineStore - Zustand Store
 * Holds UI state: activeTool, selection, loading, etc.
 */

import { create } from "zustand";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

export type ToolType = "select" | "move" | "rotate" | "scale";

interface EngineState {
  // Engine state
  isReady: boolean;
  isLoading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  
  // Selection state
  selectedMesh: AbstractMesh | null;
  selectedMeshName: string | null;
  
  // Tool state
  activeTool: ToolType;
  
  // Actions
  setReady: (ready: boolean) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setLoadingProgress: (progress: number) => void;
  setSelectedMesh: (mesh: AbstractMesh | null) => void;
  setActiveTool: (tool: ToolType) => void;
  clearSelection: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  // Engine state
  isReady: false,
  isLoading: true,
  loadingProgress: 0,
  loadingMessage: "Initializing Studio...",
  
  // Selection state
  selectedMesh: null,
  selectedMeshName: null,
  
  // Tool state
  activeTool: "select",
  
  // Actions
  setReady: (ready) => set({ isReady: ready, isLoading: !ready }),
  
  setLoading: (loading, message) => set({ 
    isLoading: loading, 
    loadingMessage: message ?? "Loading..." 
  }),
  
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  setSelectedMesh: (mesh) => set({ 
    selectedMesh: mesh,
    selectedMeshName: mesh?.name ?? null
  }),
  
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  clearSelection: () => set({ selectedMesh: null, selectedMeshName: null }),
}));
