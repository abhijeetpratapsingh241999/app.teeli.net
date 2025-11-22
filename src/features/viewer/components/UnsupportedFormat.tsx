'use client'

import { AlertTriangle } from 'lucide-react'

interface UnsupportedFormatProps {
  fileUrl: string
}

export default function UnsupportedFormat({ fileUrl }: UnsupportedFormatProps) {
  const fileName = fileUrl.split('/').pop() || 'Unknown file'
  const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'Unknown'

  return (
    <div className="h-full w-full bg-zinc-950 flex items-center justify-center">
      <div className="max-w-md p-8 rounded-xl bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-orange-500/10 border border-orange-500/20">
            <AlertTriangle className="size-8 text-orange-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-100">
            Unsupported File Format
          </h2>
          <p className="text-sm text-zinc-400">
            {fileExtension} files are not supported yet
          </p>
          <p className="text-xs text-zinc-500">
            Please upload GLTF or GLB files
          </p>
        </div>

        <div className="text-xs text-zinc-600 bg-zinc-800/50 rounded-lg p-3">
          <strong>Supported formats:</strong><br />
          • GLTF (.gltf)<br />
          • GLB (.glb)
        </div>
      </div>
    </div>
  )
}