'use client'

import { useState, useEffect } from 'react'
import type { AnalyticsDateRange } from '@repo/types'
import { AnalyticsCampaignComparison } from '@/components/analytics/analytics-campaign-comparison'
import { AnalyticsAIInsights } from '@/components/analytics/analytics-ai-insights'
import { AnalyticsDateRangePicker } from '@/components/analytics/analytics-date-range-picker'
import {
  mockCampaignAnalytics,
  mockAIInsightsLegacy,
  mockAnalyticsOverview,
  mockReachTrend,
  mockPlatformBreakdown,
  mockCreativeMetrics,
} from '@/lib/mock-data/analytics'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { TrendUp01Icon, TrendDown01Icon, AlertCircle01Icon } from '@/lib/icons'
import { toast } from 'sonner'
import { LineChart } from '@/components/analytics/line-chart'
import { DonutChart } from '@/components/analytics/donut-chart'

export default function AnalyticsPage() {
  useEffect(() => { document.title = 'Analytics | Coff' }, [])

  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('30d')

  const overview = mockAnalyticsOverview

  // Get data for selected period
  const getTrendData = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
    return mockReachTrend.slice(-days)
  }

  const trendData = getTrendData()

  // Find top performing and underperforming creatives
  const topCreative = mockCreativeMetrics.reduce((prev, current) =>
    prev.performanceScore > current.performanceScore ? prev : current
  )

  const underperformingCreatives = mockCreativeMetrics.filter(
    (c) => c.performanceLabel === 'critical' || c.performanceLabel === 'poor'
  )

  // Format donut chart data
  const platformData = mockPlatformBreakdown.map((p) => ({
    label: p.platform,
    value: p.reach,
    percentage: p.percentage,
  }))

  const kpiCards = [
    {
      title: 'Total Reach',
      value: overview.totalReach.toLocaleString(),
      change: overview.totalReachChange,
      trend: overview.totalReachChange > 0 ? 'up' : 'down',
      tooltip: 'Total number of users who saw your content',
    },
    {
      title: 'Engagement',
      value: overview.totalEngagement.toLocaleString(),
      change: overview.totalEngagementChange,
      trend: overview.totalEngagementChange > 0 ? 'up' : 'down',
      tooltip: 'Likes, comments, shares, and saves',
    },
    {
      title: 'CTR',
      value: `${overview.avgCtr}%`,
      change: overview.avgCtrChange,
      trend: overview.avgCtrChange > 0 ? 'up' : 'down',
      tooltip: 'Click-through rate — percentage of viewers who clicked',
    },
    {
      title: 'Clicks',
      value: overview.totalClicks.toLocaleString(),
      change: overview.totalClicksChange,
      trend: overview.totalClicksChange > 0 ? 'up' : 'down',
      tooltip: 'Total link clicks across all platforms',
    },
    {
      title: 'Saves',
      value: overview.totalSaves.toLocaleString(),
      change: overview.totalSavesChange,
      trend: overview.totalSavesChange > 0 ? 'up' : 'down',
      tooltip: 'Total saves/bookmarks across all platforms',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground">Track campaign performance across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <AnalyticsDateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm" onClick={() => toast.info('Export coming soon')}>Export</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="pb-2">
              <CardDescription title={kpi.tooltip} aria-label={kpi.tooltip}>{kpi.title}</CardDescription>
              <p className="text-2xl font-semibold font-mono tracking-tight">{kpi.value}</p>
            </CardHeader>
            <CardContent>
              <div
                className={`flex items-center gap-1 text-sm ${
                  kpi.trend === 'up' ? 'text-primary' : 'text-destructive'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <TrendUp01Icon size={16} />
                ) : (
                  <TrendDown01Icon size={16} />
                )}
                <span>{Math.abs(kpi.change)}% vs prev. period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reach Over Time */}
      <Card>
        <CardHeader>
          <CardTitle as="h2">Reach Over Time</CardTitle>
          <CardDescription>Daily reach for the selected period</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <LineChart data={trendData} dataKey="reach" height={280} />
        </CardContent>
      </Card>

      {/* Platform Breakdown & Top Creative */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle as="h2">Platform Breakdown</CardTitle>
            <CardDescription>Reach distribution across platforms</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <DonutChart data={platformData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h2">Top Performing Creative</CardTitle>
            <CardDescription>Highest scoring creative this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div
                className="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${topCreative.thumbnailUrl})` }}
              />
              <div className="flex-1">
                <p className="font-medium">{topCreative.creativeName}</p>
                <p className="text-sm text-muted-foreground">{topCreative.campaignName}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>Reach: {topCreative.reach.toLocaleString()}</span>
                  <span className="text-primary">CTR: {topCreative.ctr}%</span>
                  <span className="font-medium">Score: {topCreative.performanceScore}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCampaignComparison campaigns={mockCampaignAnalytics} />
      <AnalyticsAIInsights insights={mockAIInsightsLegacy} />

      {/* Underperforming Alerts */}
      {underperformingCreatives.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle01Icon className="text-destructive" />
              <CardTitle as="h2">Underperforming Creatives (Autopilot Alerts)</CardTitle>
            </div>
            <CardDescription>
              Creatives with critical or poor performance that need attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {underperformingCreatives.map((creative) => (
              <div
                key={creative.creativeId}
                className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4"
              >
                <AlertCircle01Icon className="mt-0.5 flex-shrink-0 text-destructive" size={20} />
                <div className="flex-1">
                  <p className="font-medium">
                    {creative.creativeName} — CTR: {creative.ctr}%
                  </p>
                  <p className="text-sm text-muted-foreground">{creative.aiInsight}</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Replace Creative
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
