"use client";

import { useEffect, useRef } from "react";
import { 
  Engine, 
  Scene, 
  ArcRotateCamera, 
  DirectionalLight,
  HemisphericLight, 
  Vector3,
  MeshBuilder,
  PBRMaterial,
  Color3,
  Color4,
  ShadowGenerator,
  Mesh,
  AbstractMesh,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

interface Viewer3DProps {
  step: number; // 0: raw, 1: scanned, 2: fixed, 3: rendered
  modelUrl?: string; // GLB file path - defaults to /models/model.glb
}

export function Viewer3D({ step, modelUrl = "/models/model.glb" }: Viewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const modelRef = useRef<AbstractMesh | null>(null);
  const materialRef = useRef<PBRMaterial | null>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine with alpha for transparent background
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
      alpha: true,
    });
    engineRef.current = engine;

    // Create scene with transparent background
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    sceneRef.current = scene;

    // Create camera with orbit controls
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      5,
      new Vector3(0, 0.5, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 2.5;
    camera.upperRadiusLimit = 10;
    camera.wheelPrecision = 50;
    camera.panningSensibility = 0; // Disable panning for cleaner UX

    // Main directional light (for shadows)
    const dirLight = new DirectionalLight("dirLight", new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(5, 10, 5);
    dirLight.intensity = 1.2;

    // Ambient hemisphere light
    const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.4;
    hemiLight.groundColor = new Color3(0.2, 0.2, 0.3);

    // Rim light for hologram effect
    const rimLight = new HemisphericLight("rimLight", new Vector3(0, -1, 0), scene);
    rimLight.intensity = 0.2;
    rimLight.diffuse = new Color3(0.5, 0.8, 1);

    // Shadow Generator
    const shadowGenerator = new ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.darkness = 0.4;

    // Invisible ground for shadow catching
    const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    ground.position.y = -1.5;
    ground.receiveShadows = true;
    
    // Shadow-only material (invisible ground, visible shadow)
    const groundMat = new PBRMaterial("groundMat", scene);
    groundMat.alpha = 0; // Completely invisible
    groundMat.transparencyMode = 2; // Alpha blend
    ground.material = groundMat;

    // Create PBR material for the model - Premium Ceramic look
    const material = new PBRMaterial("modelMat", scene);
    material.metallic = 0.1;
    material.roughness = 0.2; // Shiny ceramic
    material.albedoColor = new Color3(0.92, 0.92, 0.94); // Clean white
    material.reflectivityColor = new Color3(0.8, 0.8, 0.85);
    materialRef.current = material;

    // Load GLB model from public folder
    const loadModel = async () => {
      try {
        // Extract folder path and filename from modelUrl
        const lastSlash = modelUrl.lastIndexOf('/');
        const folderPath = modelUrl.substring(0, lastSlash + 1);
        const fileName = modelUrl.substring(lastSlash + 1);
        
        const result = await SceneLoader.ImportMeshAsync("", folderPath, fileName, scene);
        const meshes = result.meshes.filter(m => m.name !== "__root__");
        
        if (meshes.length > 0) {
          // Apply material and shadows to all meshes
          meshes.forEach(mesh => {
            mesh.material = material;
            shadowGenerator.addShadowCaster(mesh as Mesh);
          });
          
          // Center and scale model
          const rootMesh = result.meshes[0];
          rootMesh.position = new Vector3(0, 0, 0);
          
          // Auto-scale based on bounding box
          const boundingInfo = rootMesh.getHierarchyBoundingVectors(true);
          const size = boundingInfo.max.subtract(boundingInfo.min);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scaleFactor = 2 / maxDim; // Fit to 2 units
          rootMesh.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
          
          // Center vertically
          const newBounds = rootMesh.getHierarchyBoundingVectors(true);
          const centerY = (newBounds.min.y + newBounds.max.y) / 2;
          rootMesh.position.y = -centerY + 0.3;
          
          modelRef.current = rootMesh;
          console.log("✅ Model loaded successfully:", modelUrl);
        }
      } catch (error) {
        console.error("❌ Failed to load GLB model:", error);
        console.log("📁 Make sure your .glb file is at: public" + modelUrl);
        
        // Show error placeholder mesh
        const errorBox = MeshBuilder.CreateBox("errorBox", { size: 1.5 }, scene);
        errorBox.position.y = 0.3;
        const errorMat = new PBRMaterial("errorMat", scene);
        errorMat.albedoColor = new Color3(0.8, 0.2, 0.2);
        errorMat.emissiveColor = new Color3(0.3, 0.05, 0.05);
        errorBox.material = errorMat;
        shadowGenerator.addShadowCaster(errorBox);
        modelRef.current = errorBox;
      }
    };

    loadModel();

    // Subtle auto-rotate animation
    let angle = 0;
    scene.registerBeforeRender(() => {
      if (modelRef.current) {
        angle += 0.003;
        modelRef.current.rotation.y = angle;
      }
    });

    // Start render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [modelUrl]);

  // Update material based on step
  useEffect(() => {
    if (!materialRef.current) return;

    const mat = materialRef.current;

    switch (step) {
      case 0: // Default - Premium white ceramic
        mat.albedoColor = new Color3(0.92, 0.92, 0.94);
        mat.metallic = 0.1;
        mat.roughness = 0.2;
        mat.emissiveColor = new Color3(0.02, 0.02, 0.03);
        mat.alpha = 1;
        break;

      case 1: // Scanning - Cyan wireframe overlay effect
        mat.albedoColor = new Color3(0.3, 0.8, 0.95);
        mat.metallic = 0.3;
        mat.roughness = 0.4;
        mat.emissiveColor = new Color3(0, 0.3, 0.5);
        mat.alpha = 0.92;
        break;

      case 2: // Fixed - Clean blue ceramic
        mat.albedoColor = new Color3(0.4, 0.6, 0.95);
        mat.metallic = 0.2;
        mat.roughness = 0.25;
        mat.emissiveColor = new Color3(0.05, 0.1, 0.2);
        mat.alpha = 1;
        break;

      case 3: // Rendered - Premium gold/brass
        mat.albedoColor = new Color3(1, 0.85, 0.5);
        mat.metallic = 0.95;
        mat.roughness = 0.1;
        mat.emissiveColor = new Color3(0.15, 0.1, 0.02);
        mat.alpha = 1;
        break;
    }
  }, [step]);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-transparent">
      {/* Subtle ambient glow - very soft */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`w-40 h-40 rounded-full blur-[100px] transition-all duration-1000
            ${step === 0 ? "bg-slate-300/20 dark:bg-slate-400/15" : ""}
            ${step === 1 ? "bg-cyan-300/30 dark:bg-cyan-400/25" : ""}
            ${step === 2 ? "bg-blue-300/30 dark:bg-blue-400/25" : ""}
            ${step === 3 ? "bg-amber-300/40 dark:bg-amber-400/35" : ""}
          `}
        />
      </div>

      {/* Babylon.js Canvas - fully transparent */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none bg-transparent"
      />

      {/* Minimal step dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-1 h-1 rounded-full transition-all duration-300
              ${s === step 
                ? "w-4 bg-gray-600 dark:bg-white/80" 
                : s < step 
                  ? "bg-gray-400 dark:bg-white/40" 
                  : "bg-gray-300 dark:bg-white/20"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
