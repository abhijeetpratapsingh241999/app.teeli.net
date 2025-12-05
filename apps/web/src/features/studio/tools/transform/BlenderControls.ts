/**
 * BlenderControls - Singleton Class
 * Implements Blender 4.x style modal transformations:
 * - G = Modal Move (follows mouse without holding button)
 * - X/Y/Z = Axis locking
 * - Click = Confirm, ESC/Right Click = Cancel
 * - Hides gizmos during operation
 */

// Side-effects must be imported first
import "../../core/babylon-imports";

import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Plane } from "@babylonjs/core/Maths/math.plane";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { LinesMesh } from "@babylonjs/core/Meshes/linesMesh";
import { useEngineStore } from "../../core/EngineStore";
import { GizmoManager } from "./GizmoManager";

export type TransformMode = "move" | "rotate" | "scale" | null;
export type AxisLock = "x" | "y" | "z" | null;

export class BlenderControls {
  private static instance: BlenderControls | null = null;
  
  private scene: Scene | null = null;
  private isActive = false;
  private mode: TransformMode = null;
  private targetMesh: AbstractMesh | null = null;
  private axisLock: AxisLock = null;
  
  // Transform state
  private initialPosition = new Vector3();
  private initialRotation = new Vector3();
  private initialScale = new Vector3();
  private transformPlane: Plane | null = null;
  
  // Visual aids
  private axisLine: LinesMesh | null = null;
  
  private constructor() {}
  
  public static getInstance(): BlenderControls {
    if (!BlenderControls.instance) {
      BlenderControls.instance = new BlenderControls();
    }
    return BlenderControls.instance;
  }
  
  /**
   * Initialize BlenderControls
   */
  public setup(scene: Scene): void {
    if (this.scene) {
      console.warn("[BlenderControls] Already initialized!");
      return;
    }
    
    this.scene = scene;
    console.log("🟢 [BlenderControls] Initialized");
  }
  
  /**
   * Start modal transform (called by hotkey)
   */
  public startModalTransform(mode: TransformMode, mesh: AbstractMesh): void {
    if (!this.scene || !mode || !mesh) return;
    
    this.isActive = true;
    this.mode = mode;
    this.targetMesh = mesh;
    this.axisLock = null;
    
    // Store initial values
    this.initialPosition.copyFrom(mesh.position);
    this.initialRotation.copyFrom(mesh.rotation);
    this.initialScale.copyFrom(mesh.scaling);
    
    // Create transform plane (XZ plane at mesh position)
    const normal = new Vector3(0, 1, 0); // Y-up
    this.transformPlane = Plane.FromPositionAndNormal(mesh.position, normal);
    
    // HIDE standard gizmos during modal operation
    GizmoManager.getInstance().detach();
    
    // Listen for mouse movement (modal mode - no click needed!)
    this.scene.onPointerObservable.add(this.onPointerMove);
    window.addEventListener("pointerdown", this.onPointerDown);
    
    console.log(`🎯 [BlenderControls] MODAL ${mode.toUpperCase()} started - Move mouse to transform`);
  }
  
  /**
   * Handle keys during modal transform (X/Y/Z axis locking, ESC cancel)
   */
  public handleKey(key: string, event: KeyboardEvent): void {
    if (!this.isActive) return;
    
    switch (key) {
      case "x":
        this.toggleAxisLock("x");
        event.preventDefault();
        break;
      case "y":
        this.toggleAxisLock("y");
        event.preventDefault();
        break;
      case "z":
        this.toggleAxisLock("z");
        event.preventDefault();
        break;
      case "c":
        // Clear axis lock
        this.clearAxisLock();
        event.preventDefault();
        break;
      case "escape":
        this.cancel();
        event.preventDefault();
        break;
      case "enter":
        this.confirm();
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Toggle axis locking (X/Y/Z)
   */
  private toggleAxisLock(axis: AxisLock): void {
    if (this.axisLock === axis) {
      // Pressing same axis again = clear lock
      this.clearAxisLock();
    } else {
      this.axisLock = axis;
      this.showAxisLine();
      if (axis) {
        console.log(`🔒 [BlenderControls] Axis locked to ${axis.toUpperCase()}`);
      }
    }
  }
  
  /**
   * Clear axis lock
   */
  private clearAxisLock(): void {
    this.axisLock = null;
    this.hideAxisLine();
    console.log(`🔓 [BlenderControls] Axis lock cleared - free move`);
  }
  
  /**
   * Show visual axis line for locked axis
   */
  private showAxisLine(): void {
    if (!this.scene || !this.targetMesh || !this.axisLock) return;
    
    this.hideAxisLine(); // Remove old line
    
    // Create infinite line along locked axis
    const meshPos = this.targetMesh.position;
    const direction = new Vector3();
    let color = Color3.White();
    
    switch (this.axisLock) {
      case "x":
        direction.set(1000, 0, 0);
        color = Color3.Red();
        break;
      case "y":
        direction.set(0, 1000, 0);
        color = Color3.Green();
        break;
      case "z":
        direction.set(0, 0, 1000);
        color = Color3.Blue();
        break;
    }
    
    const start = meshPos.subtract(direction);
    const end = meshPos.add(direction);
    
    this.axisLine = MeshBuilder.CreateLines(
      "__axisLockLine__",
      { points: [start, end], updatable: false },
      this.scene
    );
    this.axisLine.color = color;
    this.axisLine.alpha = 0.5;
    this.axisLine.isPickable = false;
  }
  
  /**
   * Hide axis line
   */
  private hideAxisLine(): void {
    if (this.axisLine) {
      this.axisLine.dispose();
      this.axisLine = null;
    }
  }
  
  /**
   * Handle mouse movement during modal transform
   */
  private onPointerMove = (): void => {
    if (!this.isActive || !this.scene || !this.targetMesh || !this.transformPlane) return;
    
    // Raycast from camera through mouse to plane
    const ray = this.scene.createPickingRay(
      this.scene.pointerX,
      this.scene.pointerY,
      null,
      this.scene.activeCamera
    );
    
    const distance = ray.intersectsPlane(this.transformPlane);
    if (distance === null) return;
    
    const hitPoint = ray.origin.add(ray.direction.scale(distance));
    
    // Apply transform based on mode and axis lock
    if (this.mode === "move") {
      this.applyMove(hitPoint);
    }
    // TODO: Implement rotate and scale modes
  };
  
  /**
   * Apply move transform with optional axis locking
   */
  private applyMove(hitPoint: Vector3): void {
    if (!this.targetMesh) return;
    
    if (this.axisLock) {
      // Constrained movement along locked axis
      const delta = hitPoint.subtract(this.initialPosition);
      
      switch (this.axisLock) {
        case "x":
          this.targetMesh.position.set(
            this.initialPosition.x + delta.x,
            this.initialPosition.y,
            this.initialPosition.z
          );
          break;
        case "y":
          this.targetMesh.position.set(
            this.initialPosition.x,
            this.initialPosition.y + delta.y,
            this.initialPosition.z
          );
          break;
        case "z":
          this.targetMesh.position.set(
            this.initialPosition.x,
            this.initialPosition.y,
            this.initialPosition.z + delta.z
          );
          break;
      }
    } else {
      // Free movement (XZ plane)
      this.targetMesh.position.set(
        hitPoint.x,
        this.initialPosition.y, // Keep Y constant in free mode
        hitPoint.z
      );
    }
  }
  
  /**
   * Confirm transform on left click
   */
  private onPointerDown = (event: PointerEvent): void => {
    if (!this.isActive) return;
    
    if (event.button === 0) {
      // Left click = confirm
      this.confirm();
    } else if (event.button === 2) {
      // Right click = cancel
      this.cancel();
      event.preventDefault();
    }
  };
  
  /**
   * Confirm transform and exit modal mode
   */
  private confirm(): void {
    if (!this.isActive) return;
    
    console.log(`✅ [BlenderControls] MODAL ${this.mode?.toUpperCase()} confirmed`);
    this.cleanup();
  }
  
  /**
   * Cancel transform and restore initial values
   */
  public cancel(): void {
    if (!this.isActive || !this.targetMesh) return;
    
    // Restore initial values
    this.targetMesh.position.copyFrom(this.initialPosition);
    this.targetMesh.rotation.copyFrom(this.initialRotation);
    this.targetMesh.scaling.copyFrom(this.initialScale);
    
    console.log(`❌ [BlenderControls] MODAL ${this.mode?.toUpperCase()} cancelled`);
    this.cleanup();
  }
  
  /**
   * Cleanup after modal transform
   */
  private cleanup(): void {
    // Remove listeners
    if (this.scene) {
      this.scene.onPointerObservable.clear();
    }
    window.removeEventListener("pointerdown", this.onPointerDown);
    
    // Hide axis line
    this.hideAxisLine();
    
    // Restore gizmo (based on current tool)
    const selectedMesh = useEngineStore.getState().selectedMesh;
    const activeTool = useEngineStore.getState().activeTool;
    if (selectedMesh && activeTool !== "select") {
      GizmoManager.getInstance().attachToMesh(selectedMesh, activeTool as any);
    }
    
    // Reset state
    this.isActive = false;
    this.mode = null;
    this.axisLock = null;
    this.targetMesh = null;
    this.transformPlane = null;
  }
  
  /**
   * Check if modal transform is active
   */
  public isTransforming(): boolean {
    return this.isActive;
  }
  
  /**
   * Cleanup
   */
  public dispose(): void {
    this.cleanup();
    this.scene = null;
  }
}
