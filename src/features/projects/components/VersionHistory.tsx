'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { History, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Version {
  id: string
  scene_config: any
  created_at: string
}

interface VersionHistoryProps {
  projectId: string
  onRestore: (config: any) => void
}

export default function VersionHistory({ projectId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const loadVersions = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data } = await supabase
      .from('project_versions')
      .select('id, scene_config, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setVersions(data)
    setLoading(false)
  }

  useEffect(() => {
    if (open) loadVersions()
  }, [open, projectId])

  const handleRestore = (config: any) => {
    onRestore(config)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
          title="Version History"
        >
          <History className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-zinc-400">Loading...</div>
          ) : versions.length === 0 ? (
            <div className="text-center py-4 text-zinc-400">No versions found</div>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <div>
                  <div className="text-sm font-medium text-white">
                    {new Date(version.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {new Date(version.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRestore(version.scene_config)}
                  className="gap-1"
                >
                  <RotateCcw className="size-3" />
                  Restore
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}