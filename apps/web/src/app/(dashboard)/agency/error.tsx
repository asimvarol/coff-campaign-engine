'use client'

import { useEffect } from 'react'
import { Button } from '@repo/ui'
import { RefreshIcon } from '@/lib/icons'

export default function AgencyError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Agency error:', error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        Failed to load agency data. Please try again.
      </p>
      <Button onClick={reset}>
        <RefreshIcon className="h-4 w-4 mr-2" />
        Try again
      </Button>
    </div>
  )
}
