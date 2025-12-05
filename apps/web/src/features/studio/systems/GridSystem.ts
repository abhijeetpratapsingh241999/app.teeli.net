/**
 * GridSystem - Class
 * Manages the infinite Blender-style grid
 */

// Side-effect imports
import "../core/babylon-imports";

import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import type { Scene } from "@babylonjs/core/scene";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";

export class GridSystem {
  private static instance: GridSystem | null = null;
  private ground: Mesh | null = null;
  private material: GridMaterial | null = null;
  
  private constructor() {}
  
  public static getInstance(): GridSystem {
    if (!GridSystem.instance) {
      GridSystem.instance = new GridSystem();
    }
    return GridSystem.instance;
  }
  
  public initialize(scene: Scene): void {
    // Create large ground plane
    this.ground = MeshBuilder.CreateGround(
      "__infiniteGrid__",
      { width: 1000, height: 1000, subdivisions: 1 },
      scene
    );
    
    // Create visible grid material with proper contrast
    this.material = new GridMaterial("__gridMaterial__", scene);
    this.material.majorUnitFrequency = 5;
    this.material.minorUnitVisibility = 0.3; // Visible minor lines
    this.material.gridRatio = 1;
    this.material.backFaceCulling = false;
    this.material.mainColor = new Color3(0.4, 0.4, 0.4); // Light grey major lines
    this.material.lineColor = new Color3(0.2, 0.2, 0.2); // Darker grey minor lines
    this.material.opacity = 0.4; // Visible but not overwhelming
    
    // Fade into void at distance
    this.material.fogEnabled = true;
    scene.fogMode = 1; // Exponential
    scene.fogDensity = 0.008; // Gradual fade
    scene.fogColor = new Color3(0.02, 0.02, 0.02);
    
    this.ground.material = this.material;
    this.ground.isPickable = false;
    this.ground.receiveShadows = true;
  }
  
  public setVisible(visible: boolean): void {
    if (this.ground) {
      this.ground.setEnabled(visible);
    }
  }
  
  public dispose(): void {
    this.ground?.dispose();
    this.material?.dispose();
    this.ground = null;
    this.material = null;
  }
}
