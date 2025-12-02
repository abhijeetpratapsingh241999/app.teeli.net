/**
 * Lighting Utilities
 * 
 * Setup and configure scene lighting for 3D viewport.
 */

import {
  Scene,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  Vector3,
  Color3,
  ShadowGenerator,
  AbstractMesh
} from '@babylonjs/core';

export interface LightingConfig {
  /** Ambient light intensity */
  ambient?: number;
  /** Directional light intensity */
  directional?: number;
  /** Enable shadows */
  shadows?: boolean;
  /** Shadow quality (low, medium, high) */
  shadowQuality?: 'low' | 'medium' | 'high';
  /** Environment preset */
  preset?: 'studio' | 'outdoor' | 'dramatic' | 'soft';
}

export interface SceneLighting {
  hemispheric: HemisphericLight;
  directional: DirectionalLight;
  shadowGenerator?: ShadowGenerator;
}

/**
 * Setup basic 3-point lighting
 */
export function setupLighting(
  scene: Scene,
  config: LightingConfig = {}
): SceneLighting {
  const {
    ambient = 0.5,
    directional = 1.0,
    shadows = true,
    shadowQuality = 'medium',
    preset = 'studio'
  } = config;
  
  // Apply preset
  const presetConfig = LightingPresets[preset];
  
  // Hemispheric light (ambient)
  const hemispheric = new HemisphericLight(
    'ambient',
    new Vector3(0, 1, 0),
    scene
  );
  hemispheric.intensity = ambient * presetConfig.ambientMultiplier;
  hemispheric.groundColor = new Color3(0.3, 0.3, 0.3);
  
  // Directional light (key light)
  const dirLight = new DirectionalLight(
    'directional',
    presetConfig.keyLightDirection,
    scene
  );
  dirLight.intensity = directional * presetConfig.keyLightIntensity;
  dirLight.position = presetConfig.keyLightDirection.scale(-10);
  
  // Shadow generator
  let shadowGen: ShadowGenerator | undefined;
  if (shadows) {
    const shadowMapSize = getShadowMapSize(shadowQuality);
    shadowGen = new ShadowGenerator(shadowMapSize, dirLight);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;
  }
  
  // Fill light (soften shadows)
  const fillLight = new DirectionalLight(
    'fill',
    presetConfig.fillLightDirection,
    scene
  );
  fillLight.intensity = presetConfig.fillLightIntensity;
  
  // Rim light (back light for edge definition)
  const rimLight = new DirectionalLight(
    'rim',
    presetConfig.rimLightDirection,
    scene
  );
  rimLight.intensity = presetConfig.rimLightIntensity;
  
  return {
    hemispheric,
    directional: dirLight,
    shadowGenerator: shadowGen
  };
}

/**
 * Enable shadows for mesh
 */
export function enableShadows(
  mesh: AbstractMesh,
  shadowGenerator: ShadowGenerator,
  castShadows: boolean = true,
  receiveShadows: boolean = true
) {
  if (castShadows) {
    shadowGenerator.addShadowCaster(mesh, true);
  }
  if (receiveShadows) {
    mesh.receiveShadows = true;
  }
}

/**
 * Lighting presets
 */
const LightingPresets = {
  studio: {
    ambientMultiplier: 0.4,
    keyLightDirection: new Vector3(-1, -2, -1).normalize(),
    keyLightIntensity: 1.2,
    fillLightDirection: new Vector3(1, 0, 1).normalize(),
    fillLightIntensity: 0.3,
    rimLightDirection: new Vector3(0, 0, -1).normalize(),
    rimLightIntensity: 0.5
  },
  outdoor: {
    ambientMultiplier: 0.7,
    keyLightDirection: new Vector3(-0.5, -1, -0.5).normalize(),
    keyLightIntensity: 1.5,
    fillLightDirection: new Vector3(1, -0.2, 0.5).normalize(),
    fillLightIntensity: 0.4,
    rimLightDirection: new Vector3(0, 0.5, -1).normalize(),
    rimLightIntensity: 0.3
  },
  dramatic: {
    ambientMultiplier: 0.2,
    keyLightDirection: new Vector3(-1, -1, 0).normalize(),
    keyLightIntensity: 1.8,
    fillLightDirection: new Vector3(1, 0, 0).normalize(),
    fillLightIntensity: 0.1,
    rimLightDirection: new Vector3(0, 1, -1).normalize(),
    rimLightIntensity: 0.8
  },
  soft: {
    ambientMultiplier: 0.6,
    keyLightDirection: new Vector3(-1, -1.5, -1).normalize(),
    keyLightIntensity: 0.8,
    fillLightDirection: new Vector3(1, 0, 1).normalize(),
    fillLightIntensity: 0.6,
    rimLightDirection: new Vector3(0, 0, -1).normalize(),
    rimLightIntensity: 0.2
  }
};

/**
 * Get shadow map size based on quality
 */
function getShadowMapSize(quality: 'low' | 'medium' | 'high'): number {
  switch (quality) {
    case 'low': return 512;
    case 'medium': return 1024;
    case 'high': return 2048;
  }
}

/**
 * Add point light at position
 */
export function addPointLight(
  scene: Scene,
  position: Vector3,
  intensity: number = 1,
  color: Color3 = Color3.White()
): PointLight {
  const light = new PointLight('point', position, scene);
  light.intensity = intensity;
  light.diffuse = color;
  return light;
}
