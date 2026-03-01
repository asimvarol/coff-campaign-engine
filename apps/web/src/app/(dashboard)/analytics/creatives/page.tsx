'use client'

import { AnalyticsTopCreatives } from '@/components/analytics/analytics-top-creatives'
import { mockTopCreatives } from '@/lib/mock-data/analytics'

export default function AnalyticsCreativesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Creative Analytics</h1>
        <p className="text-sm text-muted-foreground">Individual creative performance and A/B testing</p>
      </div>
      <AnalyticsTopCreatives creatives={mockTopCreatives} />
    </div>
  )
}
