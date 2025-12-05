/**
 * SelectionManager - Singleton Class
 * Handles mesh selection via Babylon.js pointer events
 * SIMPLIFIED & BULLETPROOF IMPLEMENTATION
 */

// Side-effects must be imported first
import "../../core/babylon-imports";

import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { useEngineStore } from "../../core/EngineStore";

// Meshes to NEVER select
const EXCLUDED_NAMES = ["skybox", "ground", "grid", "gizmo", "helper", "axis", "environment"];

export class SelectionManager {
  private static instance: SelectionManager | null = null;
  
  private scene: Scene | null = null;
  private highlight: HighlightLayer | null = null;
  private selectedMesh: AbstractMesh | null = null;
  
  private constructor() {}
  
  public static getInstance(): SelectionManager {
    if (!SelectionManager.instance) {
      SelectionManager.instance = new SelectionManager();
    }
    return SelectionManager.instance;
  }
  
  /**
   * Initialize selection system - SIMPLIFIED
   */
  public setup(scene: Scene): void {
    if (this.scene) {
      console.warn("[SelectionManager] Already initialized!");
      return;
    }
    
    this.scene = scene;
    
    // Create highlight layer
    this.highlight = new HighlightLayer("hl1", scene, {
      blurHorizontalSize: 0.3,
      blurVerticalSize: 0.3,
    });
    this.highlight.innerGlow = false;
    this.highlight.outerGlow = true;
    
    console.log("🟢 [SelectionManager] HighlightLayer created");
    
    // ATTACH POINTER OBSERVABLE - The key to everything
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        // Get picked mesh directly from pointerInfo
        const mesh = pointerInfo.pickInfo?.pickedMesh;
        
        console.log("🔥 BABYLON CLICK:", mesh?.name ?? "(empty space)");
        
        if (mesh && !this.isExcluded(mesh)) {
          // SELECT
          this.selectMesh(mesh);
        } else {
          // DESELECT
          this.deselectMesh();
        }
      }
    });
    
    console.log("🟢 [SelectionManager] Pointer observable attached - READY");
  }
  
  /**
   * Check if mesh should be excluded from selection
   */
  private isExcluded(mesh: AbstractMesh): boolean {
    const name = mesh.name.toLowerCase();
    // Exclude internal meshes (start with __)
    if (name.startsWith("__")) return true;
    // Exclude by name pattern
    return EXCLUDED_NAMES.some(ex => name.includes(ex));
  }
  
  /**
   * Select a mesh
   */
  private selectMesh(mesh: AbstractMesh): void {
    // Skip if already selected
    if (this.selectedMesh === mesh) return;
    
    // Clear previous
    this.highlight?.removeAllMeshes();
    
    // Add highlight
    if (this.highlight) {
      this.highlight.addMesh(mesh as Mesh, Color3.White());
    }
    
    // Store reference
    this.selectedMesh = mesh;
    
    // Update Zustand store
    useEngineStore.getState().setSelectedMesh(mesh);
    
    console.log("✅ Selected:", mesh.name);
  }
  
  /**
   * Deselect current mesh
   */
  private deselectMesh(): void {
    if (!this.selectedMesh) return;
    
    this.highlight?.removeAllMeshes();
    this.selectedMesh = null;
    useEngineStore.getState().clearSelection();
    
    console.log("❌ Deselected");
  }
  
  /**
   * Public method to get selected mesh
   */
  public getSelectedMesh(): AbstractMesh | null {
    return this.selectedMesh;
  }
  
  /**
   * Cleanup
   */
  public dispose(): void {
    this.highlight?.dispose();
    this.highlight = null;
    this.selectedMesh = null;
    this.scene = null;
  }
}
