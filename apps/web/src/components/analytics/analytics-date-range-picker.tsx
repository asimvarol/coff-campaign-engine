'use client'

import { Button } from '@repo/ui'
import type { AnalyticsDateRange } from '@repo/types'

const ranges: { value: AnalyticsDateRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
]

export function AnalyticsDateRangePicker({
  value,
  onChange,
}: {
  value: AnalyticsDateRange
  onChange: (v: AnalyticsDateRange) => void
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {ranges.map((r) => (
        <Button
          key={r.value}
          variant={value === r.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(r.value)}
          className="text-xs"
        >
          {r.label}
        </Button>
      ))}
    </div>
  )
}
