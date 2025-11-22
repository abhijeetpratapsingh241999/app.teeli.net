'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, Camera, FileJson } from 'lucide-react'
import { useViewerStore } from '../store/useViewerStore'

export default function ExportMenu() {
  const triggerCapture = useViewerStore((state) => state.triggerCapture)
  const viewerState = useViewerStore()

  const exportScreenshot = () => {
    triggerCapture()
  }

  const exportSceneConfig = () => {
    const config = {
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
      measurements: viewerState.measurements
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scene-config-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportScreenshot} className="gap-2">
          <Camera className="size-4" />
          Screenshot
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportSceneConfig} className="gap-2">
          <FileJson className="size-4" />
          Scene Config
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}