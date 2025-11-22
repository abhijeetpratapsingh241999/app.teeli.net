'use client'

import { useState } from 'react'
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
  Award,
  TrendingDown
} from 'lucide-react'

export default function CarbonFootprintDemo() {
  const [open, setOpen] = useState(false)

  // Mock data for demo
  const mockData = {
    sustainabilityScore: 72,
    rating: 'B' as const,
    totalEmissions: 45.6,
    renderingEmissions: 32.4,
    storageEmissions: 8.2,
    transferEmissions: 5.0,
    sessionTime: 3.5,
    treesNeeded: 0.002,
    recommendations: [
      'Reduce polygon count to lower GPU energy consumption',
      'Compress textures to reduce storage and transfer emissions'
    ]
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Leaf className="size-4" />
          Carbon Report (Demo)
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
                <Badge className={getRatingColor(mockData.rating)}>
                  {mockData.rating}
                </Badge>
                <span className={`text-2xl font-bold ${getScoreColor(mockData.sustainabilityScore)}`}>
                  {mockData.sustainabilityScore}/100
                </span>
              </div>
            </div>
            <Progress value={mockData.sustainabilityScore} className="mb-2" />
            <p className="text-sm text-zinc-400">
              Equivalent to boiling water for tea 10 times
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
                <span className="text-white font-mono">{mockData.renderingEmissions}g CO₂</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2">
                  <Cloud className="size-4 text-blue-400" />
                  <span className="text-zinc-300">Cloud Storage</span>
                </div>
                <span className="text-white font-mono">{mockData.storageEmissions}g CO₂</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2">
                  <Download className="size-4 text-purple-400" />
                  <span className="text-zinc-300">Data Transfer</span>
                </div>
                <span className="text-white font-mono">{mockData.transferEmissions}g CO₂</span>
              </div>
              <div className="border-t border-zinc-700 pt-2">
                <div className="flex items-center justify-between p-2 bg-zinc-700/50 rounded font-semibold">
                  <span className="text-white">Total Emissions</span>
                  <span className="text-white font-mono text-lg">{mockData.totalEmissions}g CO₂</span>
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
                  {mockData.treesNeeded}
                </div>
                <div className="text-xs text-zinc-400">Trees needed to offset</div>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded">
                <div className="text-2xl font-bold text-blue-400">
                  {mockData.sessionTime}
                </div>
                <div className="text-xs text-zinc-400">Minutes viewed</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingDown className="size-4" />
              Carbon Reduction Tips
            </h3>
            <div className="space-y-2">
              {mockData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-zinc-800/50 rounded">
                  <Lightbulb className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>

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
        </div>
      </DialogContent>
    </Dialog>
  )
}