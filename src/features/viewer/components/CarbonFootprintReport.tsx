'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Leaf, 
  Zap, 
  Cloud, 
  Download, 
  TreePine,
  Lightbulb,
  AlertTriangle,
  Award,
  TrendingDown
} from 'lucide-react'
import { CarbonCalculator, type CarbonMetrics, type ModelData } from '@/lib/carbon/carbonCalculator'
import * as THREE from 'three'

interface CarbonFootprintReportProps {
  scene?: THREE.Group | null
  fileUrl?: string
}

export default function CarbonFootprintReport({ scene, fileUrl }: CarbonFootprintReportProps) {
  const [open, setOpen] = useState(false)
  const [carbonData, setCarbonData] = useState<CarbonMetrics | null>(null)
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    if (!scene) return

    // Analyze scene for carbon calculation
    let triangles = 0
    let textureMemory = 0
    const textureUUIDs = new Set<string>()

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        
        if (mesh.geometry) {
          const geometry = mesh.geometry
          if (geometry.index) {
            triangles += geometry.index.count / 3
          } else if (geometry.attributes.position) {
            triangles += geometry.attributes.position.count / 3
          }
        }

        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach((mat: any) => {
            Object.keys(mat).forEach(key => {
              const value = mat[key]
              if (value && value.isTexture && !textureUUIDs.has(value.uuid)) {
                textureUUIDs.add(value.uuid)
                const width = value.image?.width || 512
                const height = value.image?.height || 512
                const memory = (width * height * 4) / (1024 * 1024)
                textureMemory += memory
              }
            })
          })
        }
      }
    })

    // Mock data for calculation
    const modelData: ModelData = {
      triangles: Math.round(triangles),
      textureMemory: Math.round(textureMemory * 100) / 100,
      fileSize: Math.max(1, Math.round((triangles * 0.1 + textureMemory * 1024) / 1024)), // Estimate MB
      renderTime: sessionTime || 30, // Default 30 seconds
      viewCount: 5 // Estimated views
    }

    const metrics = CarbonCalculator.calculateCarbonFootprint(modelData)
    setCarbonData(metrics)
  }, [scene, sessionTime])

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!carbonData) {
    return (
      <Button variant="ghost" size="icon" disabled className="text-zinc-500">
        <Leaf className="size-5" />
      </Button>
    )
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+': return 'bg-green-600 text-white'
      case 'A': return 'bg-green-500 text-white'
      case 'B': return 'bg-yellow-500 text-white'
      case 'C': return 'bg-orange-500 text-white'
      case 'D': return 'bg-red-500 text-white'
      case 'F': return 'bg-red-700 text-white'
      default: return 'bg-zinc-500 text-white'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      fileUrl,
      carbonFootprint: carbonData,
      sessionTime,
      comparison: CarbonCalculator.getEmissionComparison(carbonData.totalEmissions),
      tips: CarbonCalculator.getCarbonSavingTips()
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carbon-footprint-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
          title={`Carbon Rating: ${carbonData.rating} (${carbonData.sustainabilityScore}/100)`}
        >
          <Leaf className="size-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="size-5 text-green-400" />
            Carbon Footprint Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sustainability Rating */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Sustainability Rating</h3>
              <div className="flex items-center gap-3">
                <Badge className={getRatingColor(carbonData.rating)}>
                  {carbonData.rating}
                </Badge>
                <span className={`text-2xl font-bold ${getScoreColor(carbonData.sustainabilityScore)}`}>
                  {carbonData.sustainabilityScore}/100
                </span>
              </div>
            </div>
            <Progress value={carbonData.sustainabilityScore} className="mb-2" />
            <p className="text-sm text-zinc-400">
              {CarbonCalculator.getEmissionComparison(carbonData.totalEmissions)}
            </p>
          </div>

          {/* Emissions Breakdown */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Cloud className="size-4" />
              Carbon Emissions Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-yellow-400" />
                  <span className="text-zinc-300">Rendering Energy</span>
                </div>
                <span className="text-white font-mono">{carbonData.renderingEmissions}g CO₂</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2">
                  <Cloud className="size-4 text-blue-400" />
                  <span className="text-zinc-300">Cloud Storage</span>
                </div>
                <span className="text-white font-mono">{carbonData.storageEmissions}g CO₂</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2">
                  <Download className="size-4 text-purple-400" />
                  <span className="text-zinc-300">Data Transfer</span>
                </div>
                <span className="text-white font-mono">{carbonData.transferEmissions}g CO₂</span>
              </div>
              <div className="border-t border-zinc-700 pt-2">
                <div className="flex items-center justify-between p-2 bg-zinc-700/50 rounded font-semibold">
                  <span className="text-white">Total Emissions</span>
                  <span className="text-white font-mono text-lg">{carbonData.totalEmissions}g CO₂</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <TreePine className="size-4" />
              Environmental Impact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(carbonData.totalEmissions / 22000 * 100) / 100}
                </div>
                <div className="text-xs text-zinc-400">Trees needed to offset</div>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(sessionTime / 60 * 100) / 100}
                </div>
                <div className="text-xs text-zinc-400">Minutes viewed</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {carbonData.recommendations.length > 0 && (
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingDown className="size-4" />
                Carbon Reduction Tips
              </h3>
              <div className="space-y-2">
                {carbonData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-zinc-800/50 rounded">
                    <Lightbulb className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sustainability Tips */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Award className="size-4" />
              Best Practices for Sustainable 3D
            </h3>
            <div className="space-y-1 text-sm text-zinc-300">
              <div>• Optimize polygon count for target platform</div>
              <div>• Use compressed texture formats (WebP, AVIF)</div>
              <div>• Implement Level of Detail (LOD) systems</div>
              <div>• Enable GPU-based culling and batching</div>
              <div>• Consider renewable energy hosting</div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={exportReport} className="gap-2">
              <Download className="size-4" />
              Export Carbon Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}