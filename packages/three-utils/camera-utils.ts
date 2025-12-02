/**
 * Camera Utilities
 * 
 * Camera setup and control utilities for 3D viewport.
 */

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  AbstractMesh,
  Nullable
} from '@babylonjs/core';

export interface CameraConfig {
  /** Initial alpha (horizontal rotation) */
  alpha?: number;
  /** Initial beta (vertical rotation) */
  beta?: number;
  /** Initial radius (distance from target) */
  radius?: number;
  /** Target position */
  target?: Vector3;
  /** Min zoom distance */
  minZ?: number;
  /** Max zoom distance */
  maxZ?: number;
  /** Camera speed */
  speed?: number;
  /** Enable auto-rotate */
  autoRotate?: boolean;
  /** Auto-rotate speed */
  autoRotateSpeed?: number;
}

/**
 * Create and configure an arc rotate camera
 */
export function setupCamera(
  scene: Scene,
  canvas: HTMLCanvasElement,
  config: CameraConfig = {}
): ArcRotateCamera {
  const {
    alpha = Math.PI / 4,
    beta = Math.PI / 3,
    radius = 10,
    target = Vector3.Zero(),
    minZ = 1,
    maxZ = 100,
    speed = 1,
    autoRotate = false,
    autoRotateSpeed = 0.5
  } = config;
  
  // Create camera
  const camera = new ArcRotateCamera(
    'camera',
    alpha,
    beta,
    radius,
    target,
    scene
  );
  
  // Attach controls
  camera.attachControl(canvas, true);
  
  // Configure limits
  camera.lowerRadiusLimit = minZ;
  camera.upperRadiusLimit = maxZ;
  camera.wheelPrecision = 50;
  camera.speed = speed;
  
  // Panning
  camera.panningSensibility = 50;
  
  // Auto-rotate
  if (autoRotate) {
    camera.useAutoRotationBehavior = true;
    if (camera.autoRotationBehavior) {
      camera.autoRotationBehavior.idleRotationSpeed = autoRotateSpeed;
      camera.autoRotationBehavior.idleRotationWaitTime = 2000;
    }
  }
  
  return camera;
}

/**
 * Frame camera on mesh
 */
export function frameMesh(
  camera: ArcRotateCamera,
  mesh: AbstractMesh,
  padding: number = 1.2
) {
  const boundingInfo = mesh.getHierarchyBoundingVectors(true);
  const size = boundingInfo.max.subtract(boundingInfo.min);
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  // Calculate optimal distance
  const fov = camera.fov;
  const distance = (maxDimension / 2) / Math.tan(fov / 2) * padding;
  
  // Set target to mesh center
  const center = boundingInfo.max.add(boundingInfo.min).scale(0.5);
  camera.setTarget(center);
  
  // Animate to new radius
  camera.radius = distance;
}

/**
 * Reset camera to default position
 */
export function resetCamera(
  camera: ArcRotateCamera,
  animated: boolean = true
) {
  if (animated) {
    camera.alpha = Math.PI / 4;
    camera.beta = Math.PI / 3;
  } else {
    camera.alpha = Math.PI / 4;
    camera.beta = Math.PI / 3;
  }
  
  camera.setTarget(Vector3.Zero());
}

/**
 * Get camera view presets
 */
export const CameraPresets = {
  front: { alpha: 0, beta: Math.PI / 2 },
  back: { alpha: Math.PI, beta: Math.PI / 2 },
  left: { alpha: -Math.PI / 2, beta: Math.PI / 2 },
  right: { alpha: Math.PI / 2, beta: Math.PI / 2 },
  top: { alpha: 0, beta: 0 },
  bottom: { alpha: 0, beta: Math.PI },
  isometric: { alpha: Math.PI / 4, beta: Math.PI / 3 }
};

/**
 * Apply camera preset
 */
export function applyCameraPreset(
  camera: ArcRotateCamera,
  preset: keyof typeof CameraPresets,
  animated: boolean = true
) {
  const { alpha, beta } = CameraPresets[preset];
  
  if (animated) {
    // TODO: Add animation
    camera.alpha = alpha;
    camera.beta = beta;
  } else {
    camera.alpha = alpha;
    camera.beta = beta;
  }
}
