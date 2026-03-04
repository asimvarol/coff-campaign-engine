'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'

interface AgencyKPI {
  label: string
  value: string | number
  subtitle?: string
}

export function AgencyOverview({ kpis }: { kpis: AgencyKPI[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{kpi.value}</div>
            {kpi.subtitle && <p className="mt-1 text-xs text-muted-foreground">{kpi.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
