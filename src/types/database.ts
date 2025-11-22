export interface SceneConfig {
  environment?: string;
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
