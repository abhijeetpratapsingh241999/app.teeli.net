'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Download, ExternalLink } from 'lucide-react'
import type { QueueJob } from '@/lib/queue/mockQueue'

interface RenderProgressProps {
  jobId: string | null
  onClose: () => void
}

export default function RenderProgress({ jobId, onClose }: RenderProgressProps) {
  const [job, setJob] = useState<QueueJob | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!jobId) return

    const fetchStatus = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/render/status/${jobId}`)
        const data = await response.json()
        if (data.job) setJob(data.job)
      } catch (error) {
        console.error('Failed to fetch job status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 1000)
    return () => clearInterval(interval)
  }, [jobId])

  if (!jobId) return null

  const getStatusColor = () => {
    switch (job?.status) {
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'processing': return 'text-blue-400'
      default: return 'text-yellow-400'
    }
  }

  const getStatusIcon = () => {
    switch (job?.status) {
      case 'completed': return <CheckCircle className="size-5 text-green-400" />
      case 'failed': return <XCircle className="size-5 text-red-400" />
      default: return null
    }
  }

  return (
    <Dialog open={!!jobId} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Render Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-zinc-400">Loading...</div>
          ) : job ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Status:</span>
                  <span className={getStatusColor()}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Quality:</span>
                  <span className="text-white">{job.quality.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Started:</span>
                  <span className="text-white">
                    {new Date(job.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {job.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Progress:</span>
                    <span className="text-white">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="w-full" />
                </div>
              )}

              {job.status === 'completed' && job.resultUrl && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400">
                      ✅ Render completed successfully!
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.open(job.resultUrl, '_blank')}
                      className="flex-1 gap-2"
                    >
                      <ExternalLink className="size-4" />
                      View Result
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const a = document.createElement('a')
                        a.href = job.resultUrl!
                        a.download = `render-${job.id}.jpg`
                        a.click()
                      }}
                      className="gap-2"
                    >
                      <Download className="size-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {job.status === 'failed' && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">
                    ❌ Render failed. Please try again.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-zinc-400">Job not found</div>
          )}

          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}