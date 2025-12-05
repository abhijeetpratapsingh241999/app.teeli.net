/**
 * SceneManager - Singleton
 * Manages Babylon.js Engine, Scene, RenderLoop, and Model Loading
 */

// Side-effect imports MUST come first
import "./babylon-imports";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

import { GridSystem } from "../systems/GridSystem";
import { LightingSystem } from "../systems/LightingSystem";
import { SelectionManager } from "../tools/selection/SelectionManager";
import { useEngineStore } from "./EngineStore";

export class SceneManager {
  private static instance: SceneManager | null = null;
  
  private engine: Engine | null = null;
  private scene: Scene | null = null;
  private camera: ArcRotateCamera | null = null;
  private loadedMeshes: AbstractMesh[] = [];
  
  private constructor() {}
  
  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }
  
  public initialize(canvas: HTMLCanvasElement): void {
    const store = useEngineStore.getState();
    store.setLoading(true, "Initializing 3D Engine...");
    
    // Create engine
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    });
    
    // Create scene
    this.scene = new Scene(this.engine);
    this.scene.clearColor.set(0.02, 0.02, 0.02, 1);
    
    // CRITICAL: Attach control to scene for pointer events
    this.scene.attachControl();
    console.log("[SceneManager] Scene created and control attached");
    
    // Create camera
    this.camera = new ArcRotateCamera(
      "MainCamera",
      Math.PI / 4,
      Math.PI / 3,
      15,
      Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(canvas, true);
    this.camera.wheelPrecision = 50;
    this.camera.minZ = 0.1;
    this.camera.maxZ = 1000;
    this.camera.panningSensibility = 100;
    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 500;
    
    // Initialize systems
    store.setLoadingProgress(30);
    store.setLoading(true, "Creating environment...");
    GridSystem.getInstance().initialize(this.scene);
    
    store.setLoadingProgress(60);
    store.setLoading(true, "Setting up lighting...");
    LightingSystem.getInstance().initialize(this.scene);
    
    // Initialize Selection Manager (handles its own HighlightLayer)
    console.log("[SceneManager] Initializing SelectionManager...");
    SelectionManager.getInstance().setup(this.scene);
    console.log("[SceneManager] SelectionManager initialized successfully");
    
    // FALLBACK: Direct scene.onPointerDown for guaranteed event capture
    this.scene.onPointerDown = (evt, pickResult) => {
      console.log("🎯 [SceneManager] scene.onPointerDown fired!", {
        button: evt.button,
        hit: pickResult?.hit,
        mesh: pickResult?.pickedMesh?.name ?? "(none)"
      });
    };
    console.log("[SceneManager] Direct onPointerDown attached");
    
    // Start render loop
    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });
    
    // Handle resize
    window.addEventListener("resize", this.onResize);
    
    // Mark as ready
    store.setLoadingProgress(100);
    setTimeout(() => {
      store.setReady(true);
    }, 500);
  }
  
  private onResize = (): void => {
    this.engine?.resize();
  };
  
  /**
   * Load a 3D model from file
   */
  public async loadModel(file: File): Promise<AbstractMesh[]> {
    if (!this.scene) return [];
    
    const store = useEngineStore.getState();
    store.setLoading(true, `Loading ${file.name}...`);
    store.setLoadingProgress(0);
    
    try {
      const url = URL.createObjectURL(file);
      
      // For blob URLs, we need to pass the filename so the loader
      // can determine the correct plugin based on extension
      const result = await SceneLoader.ImportMeshAsync(
        "",
        url,
        "", // Empty string since full URL is in rootUrl
        this.scene,
        (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            store.setLoadingProgress(progress);
          }
        },
        "." + file.name.split(".").pop() // Pass extension as pluginExtension
      );
      
      URL.revokeObjectURL(url);
      
      const meshes = result.meshes.filter(m => m.name !== "__root__");
      this.loadedMeshes.push(...meshes);
      
      // CRITICAL: Ensure all meshes are pickable
      meshes.forEach(mesh => {
        mesh.isPickable = true;
        console.log(`[SceneManager] Mesh "${mesh.name}" isPickable=${mesh.isPickable}`);
      });
      
      // Auto-normalize: center and scale
      this.normalizeModel(meshes);
      
      // Add shadow casters
      meshes.forEach(mesh => {
        LightingSystem.getInstance().addShadowCaster(mesh);
      });
      
      // Zoom camera to fit
      this.zoomToFit(meshes);
      
      store.setReady(true);
      
      return meshes;
    } catch (error) {
      console.error("Failed to load model:", error);
      store.setLoading(false);
      return [];
    }
  }
  
  /**
   * Center model at origin and scale to ~10 units
   */
  private normalizeModel(meshes: AbstractMesh[]): void {
    if (meshes.length === 0) return;
    
    // Calculate bounding box
    let min = new Vector3(Infinity, Infinity, Infinity);
    let max = new Vector3(-Infinity, -Infinity, -Infinity);
    
    meshes.forEach(mesh => {
      mesh.computeWorldMatrix(true);
      const bounds = mesh.getBoundingInfo().boundingBox;
      min = Vector3.Minimize(min, bounds.minimumWorld);
      max = Vector3.Maximize(max, bounds.maximumWorld);
    });
    
    const center = min.add(max).scale(0.5);
    const size = max.subtract(min);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale to fit in 10 units
    const targetSize = 10;
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;
    
    // Apply transform to all meshes
    meshes.forEach(mesh => {
      mesh.position.subtractInPlace(center);
      mesh.scaling.scaleInPlace(scaleFactor);
      
      // Lift model so it sits on the grid
      const newBounds = mesh.getBoundingInfo().boundingBox;
      const bottomY = newBounds.minimumWorld.y * scaleFactor;
      mesh.position.y -= bottomY;
    });
  }
  
  /**
   * Zoom camera to fit loaded meshes
   */
  private zoomToFit(meshes: AbstractMesh[]): void {
    if (!this.camera || meshes.length === 0) return;
    
    this.camera.setTarget(Vector3.Zero());
    this.camera.radius = 15;
    this.camera.alpha = Math.PI / 4;
    this.camera.beta = Math.PI / 3;
  }
  
  public getScene(): Scene | null {
    return this.scene;
  }
  
  public getEngine(): Engine | null {
    return this.engine;
  }
  
  public getCamera(): ArcRotateCamera | null {
    return this.camera;
  }
  
  public getLoadedMeshes(): AbstractMesh[] {
    return this.loadedMeshes;
  }
  
  public dispose(): void {
    window.removeEventListener("resize", this.onResize);
    SelectionManager.getInstance().dispose();
    GridSystem.getInstance().dispose();
    LightingSystem.getInstance().dispose();
    this.scene?.dispose();
    this.engine?.dispose();
    this.scene = null;
    this.engine = null;
    this.camera = null;
    this.loadedMeshes = [];
  }
}
