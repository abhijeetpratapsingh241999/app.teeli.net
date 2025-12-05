/**
 * Babylon.js Side-Effect Imports
 * 
 * IMPORTANT: This file MUST be imported FIRST before any Babylon.js usage.
 * These are tree-shaking side-effects required for various Babylon.js features.
 */

// Scene Components (required for layers and shadows)
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

// Mesh/Material helpers
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Meshes/meshBuilder";

// Loaders
import "@babylonjs/loaders/glTF";

// Gizmos (required for transform tools)
import "@babylonjs/core/Gizmos/gizmoManager";

// Export a dummy to ensure this file is not tree-shaken
export const BABYLON_INITIALIZED = true;
