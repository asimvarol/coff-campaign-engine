'use client'

import { ClockIcon } from '@/lib/icons'
import { MockCreative } from '@/lib/mock-data/campaigns'

interface VersionHistoryProps {
  creative: MockCreative
}

export function VersionHistory({ creative }: VersionHistoryProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 font-semibold">Version History</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border bg-primary/5 p-3">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium">v{creative.version} (current)</div>
            <div className="text-xs text-muted-foreground">2 minutes ago</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3 opacity-50">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium">v{creative.version - 1}</div>
            <div className="text-xs text-muted-foreground">15 minutes ago</div>
          </div>
        </div>
      </div>
    </div>
  )
}
