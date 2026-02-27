'use client'

import { Loader2 } from 'lucide-react'

interface GenerationProgressProps {
  message?: string
}

export function GenerationProgress({ message = 'Generating 4 variants...' }: GenerationProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">This will take 3-5 seconds</p>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
