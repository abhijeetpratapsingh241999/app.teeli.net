/**
 * SelectionTool - Class
 * Handles click-to-select with glow highlight
 * NOTE: Selection is actually handled by SelectionManager directly
 * This tool is kept for potential future expansion
 */

import type { Scene } from "@babylonjs/core/scene";
import type { ITool } from "../ITool";

export class SelectionTool implements ITool {
  private static instance: SelectionTool | null = null;
  private scene: Scene | null = null;
  private isActive = false;
  
  private constructor() {}
  
  public static getInstance(): SelectionTool {
    if (!SelectionTool.instance) {
      SelectionTool.instance = new SelectionTool();
    }
    return SelectionTool.instance;
  }
  
  public initialize(scene: Scene): void {
    this.scene = scene;
    this.activate();
  }
  
  public activate(): void {
    if (this.isActive || !this.scene) return;
    // Selection is handled by SelectionManager
    this.isActive = true;
  }
  
  public deactivate(): void {
    if (!this.isActive || !this.scene) return;
    this.isActive = false;
  }
  
  public update(): void {
    // Selection tool doesn't need per-frame updates
  }
  
  public cancel(): void {
    // Selection clearing is handled by SelectionManager
  }
  
  public dispose(): void {
    this.deactivate();
    this.scene = null;
  }
}
