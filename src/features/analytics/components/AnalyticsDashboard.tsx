'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Eye, Users, Zap, TrendingUp, Clock } from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  uniqueViewers: number
  totalProjects: number
  renderJobs: number
  avgSessionTime: number
  topProjects: Array<{
    id: string
    name: string
    views: number
    renders: number
  }>
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueViewers: 0,
    totalProjects: 0,
    renderJobs: 0,
    avgSessionTime: 0,
    topProjects: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const supabase = createClient()
      
      // Mock data for demo
      const mockData: AnalyticsData = {
        totalViews: 1247,
        uniqueViewers: 89,
        totalProjects: 12,
        renderJobs: 34,
        avgSessionTime: 342, // seconds
        topProjects: [
          { id: '1', name: 'Modern House Design', views: 234, renders: 12 },
          { id: '2', name: 'Office Interior', views: 189, renders: 8 },
          { id: '3', name: 'Product Showcase', views: 156, renders: 15 },
          { id: '4', name: 'Architectural Viz', views: 98, renders: 5 }
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${seconds % 60}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{data.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Eye className="size-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Unique Viewers</p>
              <p className="text-2xl font-bold text-white">{data.uniqueViewers}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Users className="size-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Render Jobs</p>
              <p className="text-2xl font-bold text-white">{data.renderJobs}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Zap className="size-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Avg Session</p>
              <p className="text-2xl font-bold text-white">{formatTime(data.avgSessionTime)}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Clock className="size-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Projects */}
      <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="size-5 text-zinc-400" />
          <h2 className="text-xl font-semibold text-white">Top Performing Projects</h2>
        </div>
        
        <div className="space-y-4">
          {data.topProjects.map((project, index) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-zinc-700 rounded-full text-sm font-medium text-zinc-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-white">{project.name}</h3>
                  <p className="text-sm text-zinc-400">{project.views} views • {project.renders} renders</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{project.views}</div>
                  <div className="text-xs text-zinc-400">views</div>
                </div>
                <div className="w-24 bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${(project.views / data.topProjects[0].views) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="size-5 text-zinc-400" />
          <h2 className="text-xl font-semibold text-white">Activity Overview</h2>
        </div>
        
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="size-12 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-400">Interactive charts coming soon</p>
            <p className="text-sm text-zinc-500">Views, renders, and engagement over time</p>
          </div>
        </div>
      </div>
    </div>
  )
}