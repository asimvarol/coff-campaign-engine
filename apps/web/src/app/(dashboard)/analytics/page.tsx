'use client'

import { useState } from 'react'
import type { AnalyticsDateRange } from '@repo/types'
import { AnalyticsOverview } from '@/components/analytics/analytics-overview'
import { AnalyticsChart } from '@/components/analytics/analytics-chart'
import { AnalyticsPlatformBreakdown } from '@/components/analytics/analytics-platform-breakdown'
import { AnalyticsTopCreatives } from '@/components/analytics/analytics-top-creatives'
import { AnalyticsCampaignComparison } from '@/components/analytics/analytics-campaign-comparison'
import { AnalyticsAIInsights } from '@/components/analytics/analytics-ai-insights'
import { AnalyticsDateRangePicker } from '@/components/analytics/analytics-date-range-picker'
import {
  mockAnalyticsKPIs,
  mockPlatformBreakdown,
  mockTopCreatives,
  mockTimeSeriesData,
  mockCampaignAnalytics,
  mockAIInsights,
} from '@/lib/mock-data/analytics'
import { Button } from '@repo/ui'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('30d')

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track campaign performance across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <AnalyticsDateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>
      <AnalyticsOverview kpis={mockAnalyticsKPIs} />
      <AnalyticsChart data={mockTimeSeriesData} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsPlatformBreakdown data={mockPlatformBreakdown} />
        <AnalyticsTopCreatives creatives={mockTopCreatives} />
      </div>
      <AnalyticsCampaignComparison campaigns={mockCampaignAnalytics} />
      <AnalyticsAIInsights insights={mockAIInsights} />
    </div>
  )
}
