'use client'

import { useEffect } from 'react'
import { useViewerStore } from '../store/useViewerStore'

export default function KeyboardShortcuts() {
  const toggleGrid = useViewerStore((state) => state.toggleGrid)
  const toggleAutoRotate = useViewerStore((state) => state.toggleAutoRotate)
  const resetCamera = useViewerStore((state) => state.resetCamera)
  const toggleEffects = useViewerStore((state) => state.toggleEffects)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          resetCamera()
          break
        case 'g':
          e.preventDefault()
          toggleGrid()
          break
        case 'r':
          e.preventDefault()
          toggleAutoRotate()
          break
        case 'e':
          e.preventDefault()
          toggleEffects()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleGrid, toggleAutoRotate, resetCamera, toggleEffects])

  return null
}