'use client'

import { useEffect } from 'react'
import { Button } from '@repo/ui'
import { RefreshIcon, ArrowLeft01Icon } from '@/lib/icons'

export default function CampaignDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Campaign detail error:', error)
  }, [error])

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="mb-3 text-2xl font-bold">Campaign not found</h2>
        <p className="mb-6 text-muted-foreground">
          We couldn't load this campaign. It might have been deleted or you don't have permission to view it.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} aria-label="Try again">
            <RefreshIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/campaigns'} aria-label="Back to campaigns">
            <ArrowLeft01Icon className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
