'use client'

import { useEffect } from 'react'
import { Button, Card, CardContent } from '@repo/ui'
import { XCircle } from 'lucide-react'

export default function PhotoshootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Photoshoot error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Failed to load photoshoot studio. Please try again.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.href = '/photoshoot'} variant="outline" className="flex-1">
              Go Back
            </Button>
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
