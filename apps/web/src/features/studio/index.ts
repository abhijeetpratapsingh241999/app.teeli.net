/**
 * Studio Feature - Barrel Export
 */

// Babylon.js side-effects (MUST be first)
import "./core/babylon-imports";

// Core
export { SceneManager } from "./core/SceneManager";
export { StudioCanvas } from "./core/StudioCanvas";
export { useEngineStore } from "./core/EngineStore";

// Tools
export type { ITool } from "./tools/ITool";
export { ToolManager } from "./tools/ToolManager";
export { MoveTool } from "./tools/transform/MoveTool";
export { RotateTool } from "./tools/transform/RotateTool";
export { ScaleTool } from "./tools/transform/ScaleTool";
export { SelectionTool } from "./tools/selection/SelectionTool";
export { SelectionManager } from "./tools/selection/SelectionManager";
export { CameraControl } from "./tools/navigation/CameraControl";

// Systems
export { GridSystem } from "./systems/GridSystem";
export { LightingSystem } from "./systems/LightingSystem";
export { HotkeySystem } from "./systems/HotkeySystem";

// Components
export { StudioLayout } from "./components/StudioLayout";
export { TopBar } from "./components/Header/TopBar";
export { LeftToolbar } from "./components/Panels/LeftToolbar";
export { RightProperties } from "./components/Panels/RightProperties";
export { ViewCube } from "./components/Viewport/ViewCube";
