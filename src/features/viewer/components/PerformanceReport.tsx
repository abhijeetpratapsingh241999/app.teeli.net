'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Triangle, 
  Image, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Download
} from 'lucide-react'
import { useViewerStore } from '../store/useViewerStore'

export default function PerformanceReport() {
  const [open, setOpen] = useState(false)
  const modelStats = useViewerStore((state) => state.modelStats)

  if (!modelStats) return null

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'Very High': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
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
      performance: {
        optimizationScore: modelStats.optimizationScore,
        complexity: modelStats.complexity,
        loadTime: modelStats.loadTime
      },
      geometry: {
        triangles: modelStats.triangles,
        vertices: modelStats.vertices,
        meshes: modelStats.meshes
      },
      materials: {
        count: modelStats.materials,
        textures: modelStats.textures,
        textureMemory: modelStats.textureMemory
      },
      recommendations: modelStats.recommendations
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="size-4" />
          Performance
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="size-5 text-blue-400" />
            Performance Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Optimization Score</h3>
              <span className={`text-2xl font-bold ${getScoreColor(modelStats.optimizationScore)}`}>
                {modelStats.optimizationScore}/100
              </span>
            </div>
            <Progress value={modelStats.optimizationScore} className="mb-2" />
            <div className="flex items-center gap-2">
              <Badge className={getComplexityColor(modelStats.complexity)}>
                {modelStats.complexity} Complexity
              </Badge>
              <span className="text-sm text-zinc-400">
                Load time: {modelStats.loadTime}ms
              </span>
            </div>
          </div>

          {/* Geometry Analysis */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Triangle className="size-4" />
              Geometry Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{modelStats.triangles.toLocaleString()}</div>
                <div className="text-sm text-zinc-400">Triangles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{modelStats.vertices.toLocaleString()}</div>
                <div className="text-sm text-zinc-400">Vertices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{modelStats.meshes}</div>
                <div className="text-sm text-zinc-400">Meshes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{modelStats.drawCalls}</div>
                <div className="text-sm text-zinc-400">Draw Calls</div>
              </div>
            </div>
          </div>

          {/* Material & Texture Analysis */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Image className="size-4" />
              Materials & Textures
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{modelStats.materials}</div>
                <div className="text-sm text-zinc-400">Materials</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{modelStats.textures}</div>
                <div className="text-sm text-zinc-400">Textures</div>
              </div>
              <div className="col-span-2">
                <div className="text-2xl font-bold text-white">{modelStats.textureMemory} MB</div>
                <div className="text-sm text-zinc-400">Texture Memory Usage</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {modelStats.recommendations.length > 0 && (
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Optimization Recommendations
              </h3>
              <div className="space-y-2">
                {modelStats.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-zinc-800/50 rounded">
                    <AlertTriangle className="size-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="size-4" />
              Performance Tips
            </h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <div>• Keep triangle count under 100K for web viewing</div>
              <div>• Use texture atlases to reduce draw calls</div>
              <div>• Compress textures to reduce memory usage</div>
              <div>• Remove unnecessary geometry details</div>
              <div>• Use LOD (Level of Detail) for complex models</div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button onClick={exportReport} className="gap-2">
              <Download className="size-4" />
              Export Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}