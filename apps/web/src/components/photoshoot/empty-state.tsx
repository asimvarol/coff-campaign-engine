import Link from 'next/link'

import { Button } from '@repo/ui'

import { Camera01Icon } from '@/lib/icons'

/**
 * Empty state component for photoshoot list
 * Displays when no photoshoots exist
 */
export function PhotoshootEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Camera01Icon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No photoshoots yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Create your first AI-powered product photoshoot with professional backgrounds and templates.
      </p>
      <Button asChild>
        <Link href="/photoshoot/create">Create your first photoshoot</Link>
      </Button>
    </div>
  )
}
