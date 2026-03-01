'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { CampaignAnalytics } from '@repo/types'

function statusBadge(status: string) {
  if (status === 'PUBLISHED') return 'default'
  if (status === 'COMPLETED') return 'secondary'
  return 'outline'
}

export function AnalyticsCampaignComparison({ campaigns }: { campaigns: CampaignAnalytics[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Campaign</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium text-right">Reach</th>
                <th className="pb-2 pr-4 font-medium text-right">CTR</th>
                <th className="pb-2 pr-4 font-medium text-right">Engagement</th>
                <th className="pb-2 pr-4 font-medium text-right">ROAS</th>
                <th className="pb-2 font-medium text-right">Spend</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 pr-4">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.brandName}</div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={statusBadge(c.status) as 'default' | 'secondary' | 'outline'}>{c.status}</Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{c.totalReach.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{c.avgCtr}%</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{c.avgEngagementRate}%</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{c.roas}x</td>
                  <td className="py-2.5 text-right tabular-nums">${c.spend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
