/**
 * 3D Model Loader Utility
 * 
 * Load and parse 3D models using Babylon.js.
 * Supports GLB, GLTF, OBJ, and other formats.
 */

import {
  Scene,
  SceneLoader,
  AbstractMesh,
  AssetContainer,
  ISceneLoaderProgressEvent
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';

export interface LoadModelOptions {
  /** Scale the model on load */
  scale?: number;
  /** Center the model in the scene */
  center?: boolean;
  /** Normalize size to fit in unit cube */
  normalize?: boolean;
  /** Progress callback */
  onProgress?: (progress: number) => void;
}

export interface LoadedModel {
  /** Root mesh of the loaded model */
  rootMesh: AbstractMesh;
  /** All meshes in the model */
  meshes: AbstractMesh[];
  /** Asset container for cleanup */
  container: AssetContainer;
  /** Model metadata */
  metadata: {
    vertexCount: number;
    faceCount: number;
    bounds: {
      min: { x: number; y: number; z: number };
      max: { x: number; y: number; z: number };
    };
  };
}

/**
 * Load a 3D model from URL
 */
export async function loadModel(
  scene: Scene,
  url: string,
  options: LoadModelOptions = {}
): Promise<LoadedModel> {
  const {
    scale = 1,
    center = true,
    normalize = false,
    onProgress
  } = options;
  
  return new Promise((resolve, reject) => {
    // Progress handler
    const onProgressCallback = (evt: ISceneLoaderProgressEvent) => {
      if (evt.lengthComputable && onProgress) {
        const progress = (evt.loaded / evt.total) * 100;
        onProgress(progress);
      }
    };
    
    // Load the model
    SceneLoader.LoadAssetContainer(
      '',
      url,
      scene,
      (container) => {
        // Add to scene
        container.addAllToScene();
        
        const meshes = container.meshes.filter(m => m instanceof AbstractMesh) as AbstractMesh[];
        
        if (meshes.length === 0) {
          reject(new Error('No meshes found in model'));
          return;
        }
        
        const rootMesh = meshes[0];
        
        // Apply transformations
        if (scale !== 1) {
          rootMesh.scaling.scaleInPlace(scale);
        }
        
        if (center || normalize) {
          centerModel(rootMesh, normalize);
        }
        
        // Calculate metadata
        const metadata = calculateModelMetadata(meshes);
        
        resolve({
          rootMesh,
          meshes,
          container,
          metadata
        });
        
        onProgress?.(100);
      },
      onProgressCallback,
      (scene, message, exception) => {
        reject(new Error(`Failed to load model: ${message || exception}`));
      }
    );
  });
}

/**
 * Load model from file (local upload)
 */
export async function loadModelFromFile(
  scene: Scene,
  file: File,
  options: LoadModelOptions = {}
): Promise<LoadedModel> {
  const url = URL.createObjectURL(file);
  
  try {
    const result = await loadModel(scene, url, options);
    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Center model in scene
 */
function centerModel(mesh: AbstractMesh, normalize: boolean) {
  const boundingInfo = mesh.getHierarchyBoundingVectors(true);
  const center = boundingInfo.max.add(boundingInfo.min).scale(0.5);
  
  // Center
  mesh.position.subtractInPlace(center);
  
  // Normalize size
  if (normalize) {
    const size = boundingInfo.max.subtract(boundingInfo.min);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDimension; // Fit in 2-unit cube
    mesh.scaling.scaleInPlace(scale);
  }
}

/**
 * Calculate model statistics
 */
function calculateModelMetadata(meshes: AbstractMesh[]) {
  let totalVertices = 0;
  let totalFaces = 0;
  
  const bounds = {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity }
  };
  
  meshes.forEach(mesh => {
    const geometry = mesh.geometry;
    if (geometry) {
      totalVertices += geometry.getTotalVertices();
      totalFaces += geometry.getTotalIndices() / 3;
    }
    
    const meshBounds = mesh.getBoundingInfo();
    bounds.min.x = Math.min(bounds.min.x, meshBounds.boundingBox.minimumWorld.x);
    bounds.min.y = Math.min(bounds.min.y, meshBounds.boundingBox.minimumWorld.y);
    bounds.min.z = Math.min(bounds.min.z, meshBounds.boundingBox.minimumWorld.z);
    bounds.max.x = Math.max(bounds.max.x, meshBounds.boundingBox.maximumWorld.x);
    bounds.max.y = Math.max(bounds.max.y, meshBounds.boundingBox.maximumWorld.y);
    bounds.max.z = Math.max(bounds.max.z, meshBounds.boundingBox.maximumWorld.z);
  });
  
  return {
    vertexCount: totalVertices,
    faceCount: totalFaces,
    bounds
  };
}

/**
 * Dispose model and free resources
 */
export function disposeModel(model: LoadedModel) {
  model.container.dispose();
}
