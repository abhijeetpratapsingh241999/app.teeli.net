export interface SceneConfig {
  camera?: {
    fov?: number;
    isOrthographic?: boolean;
  };
  environment?: {
    preset?: string;
    rotation?: number;
    showBackground?: boolean;
    backgroundColor?: string;
  } | string;
  lighting?: {
    intensity?: number;
  };
  settings?: {
    gridVisible?: boolean;
    autoRotate?: boolean;
    enableEffects?: boolean;
  };
  showGrid?: boolean;
  autoRotate?: boolean;
  showBackground?: boolean;
  backgroundColor?: string;
  cameraFov?: number;
  isOrthographic?: boolean;
  environmentRotation?: number;
  lightIntensity?: number;
  materialColors?: Record<string, string>;
  annotations?: Array<{ id: string; position: [number, number, number]; text: string; author: string }>;
  measurements?: Array<{ id: string; start: [number, number, number]; end: [number, number, number]; distance: number }>;
  timestamp?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  file_url?: string;
  scene_config?: SceneConfig;
  created_at: string;
  updated_at: string;
}
