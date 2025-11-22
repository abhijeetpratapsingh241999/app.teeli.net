'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { QrCode, Copy, Check } from 'lucide-react'

interface QRCodeShareProps {
  projectId: string
}

export default function QRCodeShare({ projectId }: QRCodeShareProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${projectId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
          title="Share QR Code"
        >
          <QrCode className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="rounded-lg border border-zinc-800"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Scan to view project</p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyToClipboard}
                className="gap-1"
              >
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}