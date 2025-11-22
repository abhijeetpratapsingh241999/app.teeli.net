'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Triangle, 
  Image, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Download,
  Activity
} from 'lucide-react'
import * as THREE from 'three'

interface RealPerformanceReportProps {
  scene: THREE.Group | null
  fileUrl?: string
}

interface PerformanceData {
  triangles: number
  vertices: number
  meshes: number
  materials: number
  textures: number
  textureMemory: number
  drawCalls: number
  loadTime: number
  fileSize: number
  complexity: 'Low' | 'Medium' | 'High' | 'Very High'
  optimizationScore: number
  recommendations: string[]
  fps: number
}

export default function RealPerformanceReport({ scene, fileUrl }: RealPerformanceReportProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<PerformanceData | null>(null)
  const [fps, setFps] = useState(60)

  useEffect(() => {
    if (!scene) return

    const startTime = performance.now()
    let triangles = 0
    let vertices = 0
    let meshes = 0
    const materialUUIDs = new Set<string>()
    const textureUUIDs = new Set<string>()
    let totalTextureMemory = 0

    // Analyze scene
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes++
        const mesh = child as THREE.Mesh
        
        if (mesh.geometry) {
          const geometry = mesh.geometry
          if (geometry.index) {
            triangles += geometry.index.count / 3
            vertices += geometry.index.count
          } else if (geometry.attributes.position) {
            triangles += geometry.attributes.position.count / 3
            vertices += geometry.attributes.position.count
          }
        }

        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach((mat: any) => {
            materialUUIDs.add(mat.uuid)
            
            Object.keys(mat).forEach(key => {
              const value = mat[key]
              if (value && value.isTexture && !textureUUIDs.has(value.uuid)) {
                textureUUIDs.add(value.uuid)
                const width = value.image?.width || 512
                const height = value.image?.height || 512
                const memory = (width * height * 4) / (1024 * 1024)
                totalTextureMemory += memory
              }
            })
          })
        }
      }
    })

    // Calculate metrics
    const loadTime = Math.round(performance.now() - startTime)
    let complexity: 'Low' | 'Medium' | 'High' | 'Very High' = 'Low'
    
    if (triangles < 10000) complexity = 'Low'
    else if (triangles < 50000) complexity = 'Medium'
    else if (triangles < 200000) complexity = 'High'
    else complexity = 'Very High'
    
    // Optimization score
    let score = 100
    if (triangles > 100000) score -= 25
    if (totalTextureMemory > 50) score -= 20
    if (meshes > 100) score -= 15
    if (materialUUIDs.size > 50) score -= 10
    if (textureUUIDs.size > 20) score -= 10
    
    // Recommendations
    const recommendations: string[] = []
    if (triangles > 100000) recommendations.push(`High polygon count (${Math.round(triangles).toLocaleString()}). Consider reducing for better performance.`)
    if (totalTextureMemory > 50) recommendations.push(`Large texture memory usage (${Math.round(totalTextureMemory)}MB). Compress textures.`)
    if (meshes > 100) recommendations.push(`Too many meshes (${meshes}). Consider merging objects.`)
    if (materialUUIDs.size > 50) recommendations.push(`Many materials (${materialUUIDs.size}). Reduce for better performance.`)
    if (textureUUIDs.size > 20) recommendations.push(`Many textures (${textureUUIDs.size}). Use texture atlases.`)

    // Estimate file size
    const estimatedFileSize = Math.round((triangles * 0.1 + totalTextureMemory * 1024) / 1024) // MB

    setData({
      triangles: Math.round(triangles),
      vertices: Math.round(vertices),
      meshes,
      materials: materialUUIDs.size,
      textures: textureUUIDs.size,
      textureMemory: Math.round(totalTextureMemory * 100) / 100,
      drawCalls: meshes,
      loadTime,
      fileSize: estimatedFileSize,
      complexity,
      optimizationScore: Math.max(0, score),
      recommendations,
      fps
    })
  }, [scene])

  // FPS monitoring
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    const rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [])

  if (!data) {
    return (
      <Button variant="ghost" size="icon" disabled className="text-zinc-500">
        <Zap className="size-5" />
      </Button>
    )
  }

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
      fileUrl,
      performance: data,
      analysis: {
        isOptimized: data.optimizationScore >= 70,
        primaryIssues: data.recommendations.slice(0, 3),
        estimatedLoadTime: `${data.loadTime}ms`,
        memoryUsage: `${data.textureMemory}MB`
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-analysis-${Date.now()}.json`
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
          title={`Performance: ${data.optimizationScore}/100 (${data.complexity})`}
        >
          <Zap className="size-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="size-5 text-blue-400" />
            Real-Time Performance Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Live Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 text-center">
              <div className="text-2xl font-bold text-white">{data.fps}</div>
              <div className="text-xs text-zinc-400">FPS</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 text-center">
              <div className="text-2xl font-bold text-white">{data.loadTime}ms</div>
              <div className="text-xs text-zinc-400">Load Time</div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 text-center">
              <div className="text-2xl font-bold text-white">{data.fileSize}MB</div>
              <div className="text-xs text-zinc-400">Est. Size</div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Optimization Score</h3>
              <span className={`text-2xl font-bold ${getScoreColor(data.optimizationScore)}`}>
                {data.optimizationScore}/100
              </span>
            </div>
            <Progress value={data.optimizationScore} className="mb-2" />
            <Badge className={getComplexityColor(data.complexity)}>
              {data.complexity} Complexity Model
            </Badge>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Triangle className="size-4" />
                Geometry
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Triangles</span>
                  <span className="text-white font-mono">{data.triangles.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Vertices</span>
                  <span className="text-white font-mono">{data.vertices.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Meshes</span>
                  <span className="text-white font-mono">{data.meshes}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Image className="size-4" />
                Materials
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Materials</span>
                  <span className="text-white font-mono">{data.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Textures</span>
                  <span className="text-white font-mono">{data.textures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Memory</span>
                  <span className="text-white font-mono">{data.textureMemory}MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {data.recommendations.length > 0 && (
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Optimization Recommendations
              </h3>
              <div className="space-y-2">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-zinc-800/50 rounded">
                    <AlertTriangle className="size-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={exportReport} className="gap-2">
              <Download className="size-4" />
              Export Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}