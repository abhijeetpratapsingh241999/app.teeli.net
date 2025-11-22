"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModelErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

export default function ModelErrorFallback({ 
  error = "Failed to load 3D model", 
  onRetry 
}: ModelErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm z-50">
      <div className="max-w-md p-8 rounded-xl bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="size-8 text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-100">
            Model Load Failed
          </h2>
          <p className="text-sm text-zinc-400">
            {error}
          </p>
          <p className="text-xs text-zinc-500">
            The 3D model file may be corrupted, too large, or in an unsupported format.
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCcw className="size-4" />
              Retry
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="gap-2"
          >
            <Home className="size-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
