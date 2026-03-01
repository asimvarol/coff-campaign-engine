'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { CreativePerformanceView } from '@repo/types'

function scoreColor(label: string) {
  switch (label) {
    case 'excellent': return 'default'
    case 'good': return 'secondary'
    case 'average': return 'outline'
    case 'poor': case 'critical': return 'destructive'
    default: return 'outline'
  }
}

export function AnalyticsTopCreatives({ creatives }: { creatives: CreativePerformanceView[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Creatives</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {creatives.slice(0, 5).map((c) => (
          <div key={c.id} className="flex gap-3 items-start">
            <img src={c.thumbnailUrl} alt={c.name} className="h-14 w-14 rounded-lg object-cover bg-muted" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{c.name}</span>
                <Badge variant={scoreColor(c.performanceLabel) as 'default' | 'secondary' | 'outline' | 'destructive'}>
                  {c.performanceScore}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{c.platform} {c.format} · {c.campaignName}</p>
              <div className="mt-1 flex gap-3 text-xs tabular-nums">
                <span>Reach: {c.reach.toLocaleString()}</span>
                <span className={c.ctr >= 3 ? 'text-emerald-400' : c.ctr < 1 ? 'text-red-400' : ''}>
                  CTR: {c.ctr}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
