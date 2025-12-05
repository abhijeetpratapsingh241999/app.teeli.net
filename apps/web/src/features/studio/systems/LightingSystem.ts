/**
 * LightingSystem - Class
 * Manages ambient lighting and shadows
 */

// Side-effect imports for shadows
import "../core/babylon-imports";

import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

export class LightingSystem {
  private static instance: LightingSystem | null = null;
  private hemisphericLight: HemisphericLight | null = null;
  private directionalLight: DirectionalLight | null = null;
  private shadowGenerator: ShadowGenerator | null = null;
  
  private constructor() {}
  
  public static getInstance(): LightingSystem {
    if (!LightingSystem.instance) {
      LightingSystem.instance = new LightingSystem();
    }
    return LightingSystem.instance;
  }
  
  public initialize(scene: Scene): void {
    // Soft ambient light from above
    this.hemisphericLight = new HemisphericLight(
      "__ambientLight__",
      new Vector3(0, 1, 0),
      scene
    );
    this.hemisphericLight.intensity = 0.6;
    this.hemisphericLight.groundColor.set(0.1, 0.1, 0.12);
    
    // Key light for shadows
    this.directionalLight = new DirectionalLight(
      "__keyLight__",
      new Vector3(-1, -2, -1).normalize(),
      scene
    );
    this.directionalLight.position = new Vector3(10, 20, 10);
    this.directionalLight.intensity = 0.8;
    
    // Shadow generator
    this.shadowGenerator = new ShadowGenerator(1024, this.directionalLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.blurKernel = 32;
  }
  
  public addShadowCaster(mesh: AbstractMesh): void {
    this.shadowGenerator?.addShadowCaster(mesh);
  }
  
  public removeShadowCaster(mesh: AbstractMesh): void {
    this.shadowGenerator?.removeShadowCaster(mesh);
  }
  
  public dispose(): void {
    this.shadowGenerator?.dispose();
    this.directionalLight?.dispose();
    this.hemisphericLight?.dispose();
    this.shadowGenerator = null;
    this.directionalLight = null;
    this.hemisphericLight = null;
  }
}
