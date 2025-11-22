'use client'

import { useEffect, useCallback } from 'react'
import { useViewerStore } from '@/features/viewer/store/useViewerStore'
import { saveProjectState } from '../actions/saveProjectState'

export function useAutosave(projectId: string, enabled = true) {
  const viewerState = useViewerStore()

  const saveState = useCallback(async () => {
    if (!projectId || !enabled) return

    const sceneConfig = {
      camera: {
        fov: viewerState.cameraFov,
        isOrthographic: viewerState.isOrthographic
      },
      environment: {
        preset: viewerState.environmentPreset,
        rotation: viewerState.environmentRotation,
        showBackground: viewerState.showBackground,
        backgroundColor: viewerState.backgroundColor
      },
      lighting: {
        intensity: viewerState.lightIntensity
      },
      settings: {
        gridVisible: viewerState.gridVisible,
        autoRotate: viewerState.autoRotate,
        enableEffects: viewerState.enableEffects
      },
      annotations: viewerState.annotations,
      measurements: viewerState.measurements,
      timestamp: new Date().toISOString()
    }

    try {
      await saveProjectState(projectId, sceneConfig)
      console.log('Auto-saved at', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Autosave failed:', error)
    }
  }, [projectId, enabled, viewerState])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(saveState, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [saveState, enabled])

  return { saveState }
}