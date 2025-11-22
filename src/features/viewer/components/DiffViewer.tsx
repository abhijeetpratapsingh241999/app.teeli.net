'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  Minus, 
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react'
import { type SceneState } from '@/lib/version-control/versionEngine'

interface DiffViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  oldState: SceneState | null
  newState: SceneState
  title?: string
}

interface DiffItem {
  path: string
  type: 'added' | 'removed' | 'modified'
  oldValue?: any
  newValue?: any
}

export default function DiffViewer({ 
  open, 
  onOpenChange, 
  oldState, 
  newState, 
  title = "Scene Changes" 
}: DiffViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['camera', 'environment']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const calculateDiffs = (): DiffItem[] => {
    const diffs: DiffItem[] = []

    if (!oldState) {
      diffs.push({
        path: 'scene',
        type: 'added',
        newValue: 'Initial scene setup'
      })
      return diffs
    }

    // Camera changes
    if (JSON.stringify(oldState.camera) !== JSON.stringify(newState.camera)) {
      Object.keys(newState.camera).forEach(key => {
        const oldVal = (oldState.camera as any)[key]
        const newVal = (newState.camera as any)[key]
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          diffs.push({
            path: `camera.${key}`,
            type: 'modified',
            oldValue: oldVal,
            newValue: newVal
          })
        }
      })
    }

    // Environment changes
    if (JSON.stringify(oldState.environment) !== JSON.stringify(newState.environment)) {
      Object.keys(newState.environment).forEach(key => {
        const oldVal = (oldState.environment as any)[key]
        const newVal = (newState.environment as any)[key]
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          diffs.push({
            path: `environment.${key}`,
            type: 'modified',
            oldValue: oldVal,
            newValue: newVal
          })
        }
      })
    }

    // Lighting changes
    if (JSON.stringify(oldState.lighting) !== JSON.stringify(newState.lighting)) {
      Object.keys(newState.lighting).forEach(key => {
        const oldVal = (oldState.lighting as any)[key]
        const newVal = (newState.lighting as any)[key]
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          diffs.push({
            path: `lighting.${key}`,
            type: 'modified',
            oldValue: oldVal,
            newValue: newVal
          })
        }
      })
    }

    // Annotations
    const oldAnnotations = oldState.annotations.length
    const newAnnotations = newState.annotations.length
    if (oldAnnotations !== newAnnotations) {
      diffs.push({
        path: 'annotations',
        type: newAnnotations > oldAnnotations ? 'added' : 'removed',
        oldValue: oldAnnotations,
        newValue: newAnnotations
      })
    }

    // Measurements
    const oldMeasurements = oldState.measurements.length
    const newMeasurements = newState.measurements.length
    if (oldMeasurements !== newMeasurements) {
      diffs.push({
        path: 'measurements',
        type: newMeasurements > oldMeasurements ? 'added' : 'removed',
        oldValue: oldMeasurements,
        newValue: newMeasurements
      })
    }

    return diffs
  }

  const diffs = calculateDiffs()
  const groupedDiffs = diffs.reduce((acc, diff) => {
    const section = diff.path.split('.')[0]
    if (!acc[section]) acc[section] = []
    acc[section].push(diff)
    return acc
  }, {} as Record<string, DiffItem[]>)

  const formatValue = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const getDiffIcon = (type: DiffItem['type']) => {
    switch (type) {
      case 'added': return <Plus className="size-4 text-green-400" />
      case 'removed': return <Minus className="size-4 text-red-400" />
      case 'modified': return <RotateCcw className="size-4 text-yellow-400" />
    }
  }

  const getDiffColor = (type: DiffItem['type']) => {
    switch (type) {
      case 'added': return 'bg-green-500/10 border-green-500/30'
      case 'removed': return 'bg-red-500/10 border-red-500/30'
      case 'modified': return 'bg-yellow-500/10 border-yellow-500/30'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-blue-400" />
            {title}
            <Badge variant="outline" className="ml-2">
              {diffs.length} changes
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {diffs.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <FileText className="size-12 mx-auto mb-2 text-zinc-600" />
              <p>No changes detected</p>
              <p className="text-sm">The scene state is identical</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedDiffs).map(([section, sectionDiffs]) => (
                <div key={section} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full flex items-center justify-between p-3 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white capitalize">{section}</span>
                      <Badge variant="outline" className="text-xs">
                        {sectionDiffs.length} changes
                      </Badge>
                    </div>
                    {expandedSections.has(section) ? (
                      <EyeOff className="size-4 text-zinc-400" />
                    ) : (
                      <Eye className="size-4 text-zinc-400" />
                    )}
                  </button>

                  {expandedSections.has(section) && (
                    <div className="border-t border-zinc-800">
                      {sectionDiffs.map((diff, index) => (
                        <div
                          key={index}
                          className={`p-3 border-l-4 ${getDiffColor(diff.type)}`}
                        >
                          <div className="flex items-start gap-2">
                            {getDiffIcon(diff.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white text-sm">
                                {diff.path}
                              </div>
                              
                              {diff.type === 'modified' && (
                                <div className="mt-2 space-y-2">
                                  <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                                    <div className="text-xs text-red-400 font-medium mb-1">- Old Value</div>
                                    <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
                                      {formatValue(diff.oldValue)}
                                    </pre>
                                  </div>
                                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                                    <div className="text-xs text-green-400 font-medium mb-1">+ New Value</div>
                                    <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
                                      {formatValue(diff.newValue)}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {diff.type === 'added' && (
                                <div className="mt-2 bg-green-500/10 border border-green-500/30 rounded p-2">
                                  <div className="text-xs text-green-400 font-medium mb-1">+ Added</div>
                                  <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
                                    {formatValue(diff.newValue)}
                                  </pre>
                                </div>
                              )}

                              {diff.type === 'removed' && (
                                <div className="mt-2 bg-red-500/10 border border-red-500/30 rounded p-2">
                                  <div className="text-xs text-red-400 font-medium mb-1">- Removed</div>
                                  <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
                                    {formatValue(diff.oldValue)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}