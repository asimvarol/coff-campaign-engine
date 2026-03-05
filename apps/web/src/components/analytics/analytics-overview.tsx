'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import type { AnalyticsKPI } from '@repo/types'

function TrendArrow({ trend, change }: { trend: string; change: number }) {
  if (trend === 'up') return <span className="text-emerald-400">↑ +{change}%</span>
  if (trend === 'down') return <span className="text-red-400">↓ {change}%</span>
  return <span className="text-muted-foreground">— {change}%</span>
}

export function AnalyticsOverview({ kpis }: { kpis: AnalyticsKPI[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{kpi.value}</div>
            <div className="mt-1 text-sm">
              <TrendArrow trend={kpi.trend} change={kpi.change} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
