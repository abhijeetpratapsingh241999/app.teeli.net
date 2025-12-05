/**
 * GizmoManager - Singleton Class
 * Manages Position/Rotation/Scale Gizmos for selected meshes
 * Handles G/R/S transform tools
 */

// Side-effects must be imported first
import "../../core/babylon-imports";

import { PositionGizmo } from "@babylonjs/core/Gizmos/positionGizmo";
import { RotationGizmo } from "@babylonjs/core/Gizmos/rotationGizmo";
import { ScaleGizmo } from "@babylonjs/core/Gizmos/scaleGizmo";
import { GizmoManager as BabylonGizmoManager } from "@babylonjs/core/Gizmos/gizmoManager";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { useEngineStore, type ToolType } from "../../core/EngineStore";

export type GizmoMode = "move" | "rotate" | "scale" | null;

export class GizmoManager {
  private static instance: GizmoManager | null = null;
  
  private scene: Scene | null = null;
  private gizmoManager: BabylonGizmoManager | null = null;
  private currentMode: GizmoMode = null;
  private unsubscribe: (() => void) | null = null;
  
  private constructor() {}
  
  public static getInstance(): GizmoManager {
    if (!GizmoManager.instance) {
      GizmoManager.instance = new GizmoManager();
    }
    return GizmoManager.instance;
  }
  
  /**
   * Initialize gizmo system and subscribe to store changes
   */
  public setup(scene: Scene): void {
    if (this.scene) {
      console.warn("[GizmoManager] Already initialized!");
      return;
    }
    
    this.scene = scene;
    
    // Create Babylon's built-in GizmoManager (handles all 3 gizmo types)
    this.gizmoManager = new BabylonGizmoManager(scene);
    
    // Configure gizmo appearance
    this.gizmoManager.positionGizmoEnabled = false;
    this.gizmoManager.rotationGizmoEnabled = false;
    this.gizmoManager.scaleGizmoEnabled = false;
    this.gizmoManager.boundingBoxGizmoEnabled = false;
    
    // Use utility layer to ensure gizmos render on top
    this.gizmoManager.usePointerToAttachGizmos = false; // We'll attach manually
    
    // Subscribe to store changes (activeTool and selectedMesh)
    this.subscribeToStore();
    
    console.log("🟢 [GizmoManager] Initialized and subscribed to store");
  }
  
  /**
   * Subscribe to EngineStore changes for reactive gizmo updates
   */
  private subscribeToStore(): void {
    this.unsubscribe = useEngineStore.subscribe((state, prevState) => {
      // React to activeTool changes
      if (state.activeTool !== prevState.activeTool) {
        console.log(`🔧 [GizmoManager] Tool changed: ${prevState.activeTool} → ${state.activeTool}`);
        this.updateGizmoForActiveTool(state.activeTool, state.selectedMesh);
      }
      
      // React to selectedMesh changes
      if (state.selectedMesh !== prevState.selectedMesh) {
        console.log(`🎯 [GizmoManager] Selection changed: ${prevState.selectedMesh?.name ?? 'none'} → ${state.selectedMesh?.name ?? 'none'}`);
        this.updateGizmoForActiveTool(state.activeTool, state.selectedMesh);
      }
    });
  }
  
  /**
   * Update gizmo based on active tool and selected mesh
   */
  private updateGizmoForActiveTool(activeTool: ToolType, selectedMesh: AbstractMesh | null): void {
    if (!this.gizmoManager) return;
    
    // Disable all gizmos first
    this.gizmoManager.positionGizmoEnabled = false;
    this.gizmoManager.rotationGizmoEnabled = false;
    this.gizmoManager.scaleGizmoEnabled = false;
    
    // If no mesh selected or tool is "select", detach all gizmos
    if (!selectedMesh || activeTool === "select") {
      this.gizmoManager.attachToMesh(null);
      this.currentMode = null;
      console.log("🔷 [GizmoManager] Gizmos detached (select mode or no mesh)");
      return;
    }
    
    // Attach gizmo to selected mesh
    this.gizmoManager.attachToMesh(selectedMesh);
    
    // Enable appropriate gizmo based on active tool
    switch (activeTool) {
      case "move":
        this.gizmoManager.positionGizmoEnabled = true;
        this.currentMode = "move";
        console.log("🔷 [GizmoManager] Position gizmo enabled on:", selectedMesh.name);
        break;
      case "rotate":
        this.gizmoManager.rotationGizmoEnabled = true;
        this.currentMode = "rotate";
        console.log("🔷 [GizmoManager] Rotation gizmo enabled on:", selectedMesh.name);
        break;
      case "scale":
        this.gizmoManager.scaleGizmoEnabled = true;
        this.currentMode = "scale";
        console.log("🔷 [GizmoManager] Scale gizmo enabled on:", selectedMesh.name);
        break;
      default:
        this.currentMode = null;
        console.log("🔷 [GizmoManager] No gizmo for tool:", activeTool);
    }
  }
  
  /**
   * Attach gizmo to a mesh based on current tool
   */
  public attachToMesh(mesh: AbstractMesh | null, mode: GizmoMode = null): void {
    if (!this.gizmoManager) {
      console.warn("[GizmoManager] Not initialized!");
      return;
    }
    
    // Use provided mode or get from store
    const toolMode = mode ?? this.getActiveTool();
    
    // Disable all gizmos first
    this.gizmoManager.positionGizmoEnabled = false;
    this.gizmoManager.rotationGizmoEnabled = false;
    this.gizmoManager.scaleGizmoEnabled = false;
    
    if (!mesh) {
      // No mesh - clear gizmos
      this.gizmoManager.attachToMesh(null);
      this.currentMode = null;
      console.log("🔷 [GizmoManager] Detached");
      return;
    }
    
    // Attach to mesh
    this.gizmoManager.attachToMesh(mesh);
    
    // Enable appropriate gizmo based on tool
    switch (toolMode) {
      case "move":
        this.gizmoManager.positionGizmoEnabled = true;
        console.log("🔷 [GizmoManager] Position gizmo attached to:", mesh.name);
        break;
      case "rotate":
        this.gizmoManager.rotationGizmoEnabled = true;
        console.log("🔷 [GizmoManager] Rotation gizmo attached to:", mesh.name);
        break;
      case "scale":
        this.gizmoManager.scaleGizmoEnabled = true;
        console.log("🔷 [GizmoManager] Scale gizmo attached to:", mesh.name);
        break;
      default:
        // Select tool or no tool - no gizmo
        console.log("🔷 [GizmoManager] No gizmo (select mode)");
    }
    
    this.currentMode = toolMode;
  }
  
  /**
   * Change gizmo mode for currently attached mesh
   */
  public setMode(mode: GizmoMode): void {
    if (!this.gizmoManager) return;
    
    const attachedMesh = this.gizmoManager.gizmos.positionGizmo?.attachedMesh 
      || this.gizmoManager.gizmos.rotationGizmo?.attachedMesh
      || this.gizmoManager.gizmos.scaleGizmo?.attachedMesh;
    
    if (attachedMesh) {
      this.attachToMesh(attachedMesh, mode);
    }
  }
  
  /**
   * Get active tool mode from store
   */
  private getActiveTool(): GizmoMode {
    const activeTool = useEngineStore.getState().activeTool;
    
    switch (activeTool) {
      case "move":
        return "move";
      case "rotate":
        return "rotate";
      case "scale":
        return "scale";
      default:
        return null;
    }
  }
  
  /**
   * Detach all gizmos
   */
  public detach(): void {
    this.attachToMesh(null);
  }
  
  /**
   * Check if a gizmo is currently active
   */
  public isActive(): boolean {
    return this.currentMode !== null;
  }
  
  /**
   * Get current gizmo mode
   */
  public getCurrentMode(): GizmoMode {
    return this.currentMode;
  }
  
  /**
   * Cleanup
   */
  public dispose(): void {
    // Unsubscribe from store
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    
    this.gizmoManager?.dispose();
    this.gizmoManager = null;
    this.scene = null;
    this.currentMode = null;
  }
}

