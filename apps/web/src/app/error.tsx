'use client'

import { useEffect } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { AlertCircleIcon, RefreshIcon } from '@/lib/icons'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircleIcon className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>
            {error.message || 'An unexpected error occurred'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.digest && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                Error ID: <code className="font-mono">{error.digest}</code>
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshIcon className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.location.href = '/'}
            >
              Go home
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            If this problem persists, please contact support
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
