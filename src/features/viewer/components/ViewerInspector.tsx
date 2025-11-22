"use client";

import { useViewerStore } from "../store/useViewerStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Grid3x3, RotateCw, Sparkles, Leaf, Palette, Sun, Image as ImageIcon, Camera, Lightbulb, Scissors } from "lucide-react";
import { formatNumber, getPerformanceGrade } from "../utils/formatStats";

export default function ViewerInspector() {
  const environmentPreset = useViewerStore((state) => state.environmentPreset);
  const setEnvironmentPreset = useViewerStore((state) => state.setEnvironmentPreset);
  const gridVisible = useViewerStore((state) => state.gridVisible);
  const toggleGrid = useViewerStore((state) => state.toggleGrid);
  const autoRotate = useViewerStore((state) => state.autoRotate);
  const toggleAutoRotate = useViewerStore((state) => state.toggleAutoRotate);
  const modelStats = useViewerStore((state) => state.modelStats);
  const enableEffects = useViewerStore((state) => state.enableEffects);
  const toggleEffects = useViewerStore((state) => state.toggleEffects);
  const carbonScore = useViewerStore((state) => state.carbonScore);
  const selectedMeshId = useViewerStore((state) => state.selectedMeshId);
  const selectedMaterialColor = useViewerStore((state) => state.selectedMaterialColor);
  const updateMaterialColor = useViewerStore((state) => state.updateMaterialColor);
  const showBackground = useViewerStore((state) => state.showBackground);
  const toggleBackground = useViewerStore((state) => state.toggleBackground);
  const backgroundColor = useViewerStore((state) => state.backgroundColor);
  const setBackgroundColor = useViewerStore((state) => state.setBackgroundColor);
  const cameraFov = useViewerStore((state) => state.cameraFov);
  const setCameraFov = useViewerStore((state) => state.setCameraFov);
  const isOrthographic = useViewerStore((state) => state.isOrthographic);
  const toggleOrthographic = useViewerStore((state) => state.toggleOrthographic);
  const environmentRotation = useViewerStore((state) => state.environmentRotation);
  const setEnvironmentRotation = useViewerStore((state) => state.setEnvironmentRotation);
  const lightIntensity = useViewerStore((state) => state.lightIntensity);
  const setLightIntensity = useViewerStore((state) => state.setLightIntensity);
  const clippingEnabled = useViewerStore((state) => state.clippingEnabled);
  const toggleClipping = useViewerStore((state) => state.toggleClipping);
  const clippingLevel = useViewerStore((state) => state.clippingLevel);
  const setClippingLevel = useViewerStore((state) => state.setClippingLevel);
  
  const performanceGrade = modelStats ? getPerformanceGrade(modelStats.triangles) : null;
  const isPresentationMode = useViewerStore((state) => state.isPresentationMode);

  return (
    <div className={`fixed right-0 top-0 h-full w-80 border-l border-white/10 bg-black/50 backdrop-blur-md overflow-y-auto hidden lg:block transition-opacity duration-300 ${
      isPresentationMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-white">Inspector</h2>
          <p className="text-xs text-zinc-400 mt-1">Scene settings and properties</p>
        </div>

        {/* Camera Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Camera className="size-4" />
            Camera
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-zinc-400">Field of View</Label>
                <span className="text-xs text-zinc-300 font-mono">{cameraFov}°</span>
              </div>
              <Slider
                value={[cameraFov]}
                onValueChange={(v) => setCameraFov(v[0])}
                min={10}
                max={90}
                step={1}
                className="w-full"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleOrthographic}
              className={`w-full justify-start gap-2 ${isOrthographic ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
            >
              <Camera className="size-4" />
              Orthographic {isOrthographic ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        {/* Lighting Studio */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Lightbulb className="size-4" />
            Lighting Studio
          </h3>
          
          {/* Environment Presets */}
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Environment</Label>
            <div className="grid grid-cols-2 gap-2">
              {['city', 'sunset', 'dawn', 'night', 'warehouse', 'forest', 'studio', 'apartment'].map((env) => (
                <button
                  key={env}
                  onClick={() => setEnvironmentPreset(env as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    environmentPreset === env
                      ? 'bg-purple-500/20 border-2 border-purple-500 text-white'
                      : 'bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Rotation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-zinc-400">Environment Rotation</Label>
              <span className="text-xs text-zinc-300 font-mono">{environmentRotation}°</span>
            </div>
            <Slider
              value={[environmentRotation]}
              onValueChange={(v) => setEnvironmentRotation(v[0])}
              min={0}
              max={360}
              step={1}
              className="w-full"
            />
          </div>

          {/* Light Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-zinc-400">Light Intensity</Label>
              <span className="text-xs text-zinc-300 font-mono">{lightIntensity.toFixed(1)}</span>
            </div>
            <Slider
              value={[lightIntensity]}
              onValueChange={(v) => setLightIntensity(v[0])}
              min={0}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Background Control */}
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Background</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleBackground}
              className={`w-full justify-start gap-2 ${showBackground ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
            >
              <ImageIcon className="size-4" />
              Show Background {showBackground ? 'On' : 'Off'}
            </Button>
            
            {!showBackground && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="bg-color" className="text-xs text-zinc-400">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    id="bg-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer bg-zinc-800 border border-zinc-700"
                  />
                  <div className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-300">
                    {backgroundColor.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Model Stats */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Model Stats</h3>
          {modelStats ? (
            <>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Triangles:</span>
                  <span className="text-zinc-300 font-mono">{formatNumber(modelStats.triangles)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials:</span>
                  <span className="text-zinc-300 font-mono">{modelStats.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span>Meshes:</span>
                  <span className="text-zinc-300 font-mono">{modelStats.meshes}</span>
                </div>
              </div>
              
              {/* Performance Grade */}
              {performanceGrade && (
                <div className="mt-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{performanceGrade.emoji}</span>
                    <span className={`text-sm font-semibold ${performanceGrade.color}`}>
                      {performanceGrade.label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{performanceGrade.description}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-zinc-500">Loading model data...</div>
          )}
        </div>

        {/* Sustainability Impact */}
        {carbonScore && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Sustainability Impact</h3>
            <div className={`p-3 rounded-lg border ${
              carbonScore.includes('Eco-Friendly') ? 'bg-green-500/10 border-green-500/30' :
              carbonScore.includes('Moderate') ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="size-4" />
                <span className={`text-sm font-semibold ${
                  carbonScore.includes('Eco-Friendly') ? 'text-green-400' :
                  carbonScore.includes('Moderate') ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {carbonScore}
                </span>
              </div>
              <p className="text-xs text-zinc-400" title="Based on estimated GPU rendering energy">
                Based on GPU rendering energy
              </p>
            </div>
          </div>
        )}

        {/* Material Editor */}
        {selectedMeshId && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Material Editor</h3>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="size-4 text-purple-400" />
                <span className="text-sm text-zinc-300">Selected Mesh</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-picker" className="text-xs text-zinc-400">Color</Label>
                <div className="flex gap-2">
                  <input
                    id="color-picker"
                    type="color"
                    value={selectedMaterialColor}
                    onChange={(e) => updateMaterialColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer bg-zinc-800 border border-zinc-700"
                  />
                  <div className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-300">
                    {selectedMaterialColor.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical View */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Scissors className="size-4" />
            Technical View
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleClipping}
              className={`w-full justify-start gap-2 ${clippingEnabled ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
            >
              <Scissors className="size-4" />
              Section Cut {clippingEnabled ? 'On' : 'Off'}
            </Button>

            {clippingEnabled && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-zinc-400">Cut Level</Label>
                  <span className="text-xs text-zinc-300 font-mono">{clippingLevel.toFixed(1)}</span>
                </div>
                <Slider
                  value={[clippingLevel]}
                  onValueChange={(v) => setClippingLevel(v[0])}
                  min={-10}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Display Controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Display</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEffects}
              className={`w-full justify-start gap-2 ${enableEffects ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
            >
              <Sparkles className="size-4" />
              Cinematic Mode {enableEffects ? 'On' : 'Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleGrid}
              className={`w-full justify-start gap-2 ${gridVisible ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
            >
              <Grid3x3 className="size-4" />
              Grid {gridVisible ? 'On' : 'Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoRotate}
              className={`w-full justify-start gap-2 ${autoRotate ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
            >
              <RotateCw className="size-4" />
              Auto-Rotate {autoRotate ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
