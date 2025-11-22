'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Image, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import RenderProgress from './RenderProgress'

interface RenderButtonProps {
  projectId: string
}

export default function RenderButton({ projectId }: RenderButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quality, setQuality] = useState<'preview' | 'hq'>('preview')
  const [jobId, setJobId] = useState<string | null>(null)

  const handleRender = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, quality }),
      })

      const data = await response.json()

      if (response.ok) {
        setJobId(data.jobId)
        setOpen(false)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert('Failed to start render')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Image className="size-4" />
          Render
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Render Image</DialogTitle>
          <DialogDescription>
            Generate a high-quality render of your 3D model
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Quality</Label>
            <Select value={quality} onValueChange={(v) => setQuality(v as 'preview' | 'hq')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preview">
                  Preview (1280x720, ~30s)
                </SelectItem>
                <SelectItem value="hq">
                  High Quality (3840x2160, ~3min)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleRender} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Starting Render...
              </>
            ) : (
              <>
                <Image className="size-4 mr-2" />
                Start Render
              </>
            )}
          </Button>
        </div>
      </DialogContent>
      
      <RenderProgress 
        jobId={jobId} 
        onClose={() => setJobId(null)} 
      />
    </Dialog>
  )
}
