// Render job types
export interface RenderJob {
  jobId: string
  projectId: string
  userId: string
  modelUrl: string
  quality: 'preview' | 'hq'
  settings: RenderSettings
  createdAt: string
}

export interface RenderSettings {
  width: number
  height: number
  samples: number
  hdri: string
  cameraPosition: [number, number, number]
  cameraRotation: [number, number, number]
}

export interface RenderJobStatus {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  quality: 'preview' | 'hq'
  outputUrl?: string
  progress?: number
  error?: string
  createdAt: string
  completedAt?: string
}
