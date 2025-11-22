import { create } from "zustand";

type Environment = "city" | "sunset" | "studio" | "dawn";
type TransformMode = "translate" | "rotate" | "scale" | null;

interface Annotation {
  id: string;
  position: [number, number, number];
  content: string;
  author: string;
}

interface Measurement {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  distance: number;
}

interface ModelStats {
  triangles: number;
  materials: number;
  meshes: number;
  meshNames: string[];
}

interface ViewerStore {
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;
  autoRotate: boolean;
  toggleAutoRotate: () => void;
  gridVisible: boolean;
  toggleGrid: () => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  environmentPreset: Environment;
  setEnvironmentPreset: (preset: Environment) => void;
  showStats: boolean;
  toggleStats: () => void;
  modelStats: ModelStats | null;
  setModelStats: (stats: ModelStats) => void;
  captureScreenshot: boolean;
  triggerCapture: () => void;
  enableEffects: boolean;
  toggleEffects: () => void;
  carbonScore: string | null;
  setCarbonScore: (score: string) => void;
  isRenderModalOpen: boolean;
  toggleRenderModal: () => void;
  selectedMeshId: string | null;
  selectedMaterialColor: string;
  selectMesh: (uuid: string, color: string) => void;
  updateMaterialColor: (color: string) => void;
  showBackground: boolean;
  toggleBackground: () => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  transformMode: TransformMode;
  setTransformMode: (mode: TransformMode) => void;
  sceneNodes: Array<{ uuid: string; name: string; type: string }> | null;
  setSceneNodes: (nodes: Array<{ uuid: string; name: string; type: string }>) => void;
  cameraFov: number;
  setCameraFov: (fov: number) => void;
  isOrthographic: boolean;
  toggleOrthographic: () => void;
  environmentRotation: number;
  setEnvironmentRotation: (rotation: number) => void;
  lightIntensity: number;
  setLightIntensity: (intensity: number) => void;
  isAnnotationMode: boolean;
  toggleAnnotationMode: () => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (id: string) => void;
  isMeasurementMode: boolean;
  toggleMeasurementMode: () => void;
  measurements: Measurement[];
  addMeasurement: (measurement: Measurement) => void;
  clearMeasurements: () => void;
  clippingEnabled: boolean;
  toggleClipping: () => void;
  clippingLevel: number;
  setClippingLevel: (level: number) => void;
  resetCamera: () => void;
}

export const useViewerStore = create<ViewerStore>((set) => ({
  fileUrl: null,
  setFileUrl: (url) => set({ fileUrl: url }),
  autoRotate: false,
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  gridVisible: false,
  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),
  environment: "city",
  setEnvironment: (env) => set({ environment: env }),
  environmentPreset: "city",
  setEnvironmentPreset: (preset) => set({ environmentPreset: preset }),
  showStats: false,
  toggleStats: () => set((state) => ({ showStats: !state.showStats })),
  modelStats: null,
  setModelStats: (stats) => set({ modelStats: stats }),
  captureScreenshot: false,
  triggerCapture: () => {
    set({ captureScreenshot: true });
    setTimeout(() => set({ captureScreenshot: false }), 100);
  },
  enableEffects: false,
  toggleEffects: () => set((state) => ({ enableEffects: !state.enableEffects })),
  carbonScore: null,
  setCarbonScore: (score) => set({ carbonScore: score }),
  isRenderModalOpen: false,
  toggleRenderModal: () => set((state) => ({ isRenderModalOpen: !state.isRenderModalOpen })),
  selectedMeshId: null,
  selectedMaterialColor: "#ffffff",
  selectMesh: (uuid, color) => set({ selectedMeshId: uuid, selectedMaterialColor: color }),
  updateMaterialColor: (color) => set({ selectedMaterialColor: color }),
  showBackground: false,
  toggleBackground: () => set((state) => ({ showBackground: !state.showBackground })),
  backgroundColor: "#111111",
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  isPresentationMode: false,
  togglePresentationMode: () => set((state) => ({ 
    isPresentationMode: !state.isPresentationMode,
    autoRotate: !state.isPresentationMode ? true : state.autoRotate
  })),
  transformMode: null,
  setTransformMode: (mode) => set({ transformMode: mode }),
  sceneNodes: null,
  setSceneNodes: (nodes) => set({ sceneNodes: nodes }),
  cameraFov: 50,
  setCameraFov: (fov) => set({ cameraFov: fov }),
  isOrthographic: false,
  toggleOrthographic: () => set((state) => ({ isOrthographic: !state.isOrthographic })),
  environmentRotation: 0,
  setEnvironmentRotation: (rotation) => set({ environmentRotation: rotation }),
  lightIntensity: 1,
  setLightIntensity: (intensity) => set({ lightIntensity: intensity }),
  isAnnotationMode: false,
  toggleAnnotationMode: () => set((state) => ({ isAnnotationMode: !state.isAnnotationMode })),
  annotations: [],
  addAnnotation: (annotation) => set((state) => ({ annotations: [...state.annotations, annotation] })),
  removeAnnotation: (id) => set((state) => ({ annotations: state.annotations.filter(a => a.id !== id) })),
  isMeasurementMode: false,
  toggleMeasurementMode: () => set((state) => ({ isMeasurementMode: !state.isMeasurementMode })),
  measurements: [],
  addMeasurement: (measurement) => set((state) => ({ measurements: [...state.measurements, measurement] })),
  clearMeasurements: () => set({ measurements: [] }),
  clippingEnabled: false,
  toggleClipping: () => set((state) => ({ clippingEnabled: !state.clippingEnabled })),
  clippingLevel: 0,
  setClippingLevel: (level) => set({ clippingLevel: level }),
  resetCamera: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resetCamera'));
    }
  }
}));

export type { Environment, ModelStats, ViewerStore, TransformMode, Annotation, Measurement };
