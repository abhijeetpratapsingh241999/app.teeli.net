/**
 * ToolManager - Class
 * Switches between active tools using Strategy Pattern
 */

import type { ITool } from "./ITool";

export class ToolManager {
  private static instance: ToolManager | null = null;
  private activeTool: ITool | null = null;
  
  private constructor() {}
  
  public static getInstance(): ToolManager {
    if (!ToolManager.instance) {
      ToolManager.instance = new ToolManager();
    }
    return ToolManager.instance;
  }
  
  public setActiveTool(tool: ITool | null): void {
    this.activeTool = tool;
  }
  
  public getActiveTool(): ITool | null {
    return this.activeTool;
  }
  
  public update(): void {
    this.activeTool?.update();
  }
  
  public cancel(): void {
    this.activeTool?.cancel();
  }
}
