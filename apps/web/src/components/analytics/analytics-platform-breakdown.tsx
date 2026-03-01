'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import type { PlatformBreakdown } from '@repo/types'

const platformIcons: Record<string, string> = {
  Instagram: '📸',
  Facebook: '📘',
  TikTok: '🎵',
  LinkedIn: '💼',
  X: '𝕏',
  Pinterest: '📌',
}

export function AnalyticsPlatformBreakdown({ data }: { data: PlatformBreakdown[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((p) => (
          <div key={p.platform}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-sm font-medium">
                <span>{platformIcons[p.platform] || '🌐'}</span>
                {p.platform}
              </span>
              <span className="text-sm font-medium tabular-nums">{p.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${p.percentage}%`, background: p.color }}
              />
            </div>
            <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
              <span>Reach: {p.reach.toLocaleString()}</span>
              <span>Engagement: {p.engagement}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
