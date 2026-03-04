'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { ScoreGauge } from '@/components/analytics/score-gauge'
import { mockCreativeMetrics } from '@/lib/mock-data/analytics'

type PerformanceFilter = 'all' | 'excellent' | 'good' | 'average' | 'poor' | 'critical'

const performanceBadges = {
  excellent: { label: 'Excellent', color: 'bg-primary/20 text-primary border-primary/30' },
  good: { label: 'Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  average: { label: 'Average', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  poor: { label: 'Poor', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  critical: { label: 'Critical', color: 'bg-destructive/20 text-destructive border-destructive/30' },
}

export default function CreativeAnalyticsPage() {
  const [performanceFilter, setPerformanceFilter] = useState<PerformanceFilter>('all')
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([])

  const filteredCreatives = useMemo(() => {
    let filtered = mockCreativeMetrics

    if (performanceFilter !== 'all') {
      filtered = filtered.filter((c) => c.performanceLabel === performanceFilter)
    }

    // Sort by performance score descending
    return filtered.sort((a, b) => b.performanceScore - a.performanceScore)
  }, [performanceFilter])

  const toggleCreativeSelection = (creativeId: string) => {
    setSelectedCreatives((prev) => {
      if (prev.includes(creativeId)) {
        return prev.filter((id) => id !== creativeId)
      }
      if (prev.length >= 2) {
        return [prev[1], creativeId]
      }
      return [...prev, creativeId]
    })
  }

  return (
    <div >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Creative Analytics</h1>
        <p className="text-muted-foreground">
          Analyze individual creative performance and compare variants
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setPerformanceFilter('all')}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            performanceFilter === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          }`}
        >
          All ({mockCreativeMetrics.length})
        </button>
        {(Object.keys(performanceBadges) as Array<keyof typeof performanceBadges>).map((filter) => {
          const count = mockCreativeMetrics.filter((c) => c.performanceLabel === filter).length
          return (
            <button
              key={filter}
              onClick={() => setPerformanceFilter(filter)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                performanceFilter === filter
                  ? performanceBadges[filter].color
                  : 'border-border bg-background hover:bg-muted'
              }`}
            >
              {performanceBadges[filter].label} ({count})
            </button>
          )
        })}
      </div>

      {/* Comparison Mode */}
      {selectedCreatives.length === 2 && (
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle>A/B Comparison</CardTitle>
            <CardDescription>Side-by-side comparison of selected creatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedCreatives.map((creativeId) => {
                const creative = mockCreativeMetrics.find((c) => c.creativeId === creativeId)
                if (!creative) return null

                const badge = performanceBadges[creative.performanceLabel]

                return (
                  <div key={creativeId} className="space-y-3 rounded-lg border border-border p-4">
                    <div
                      className="h-48 w-full rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${creative.thumbnailUrl})` }}
                    />
                    <h3 className="font-semibold">{creative.creativeName}</h3>
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${badge.color}`}>
                      {badge.label}
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Reach</p>
                        <p className="font-medium font-mono">{creative.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement Rate</p>
                        <p className="font-medium font-mono">{creative.engagementRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-medium font-mono">{creative.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Score</p>
                        <p className="text-lg font-bold text-primary font-mono">{creative.performanceScore}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setSelectedCreatives([])}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear comparison
            </button>
          </CardContent>
        </Card>
      )}

      {/* Creative Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCreatives.map((creative) => {
          const badge = performanceBadges[creative.performanceLabel]
          const isSelected = selectedCreatives.includes(creative.creativeId)

          return (
            <Card
              key={creative.creativeId}
              className={`cursor-pointer transition-all hover:border-primary ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleCreativeSelection(creative.creativeId)}
            >
              <CardHeader className="p-0">
                <div
                  className="h-48 w-full rounded-t-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${creative.thumbnailUrl})` }}
                />
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold leading-tight">{creative.creativeName}</h3>
                    <p className="text-xs text-muted-foreground">{creative.campaignName}</p>
                  </div>
                  <ScoreGauge score={creative.performanceScore} size={60} strokeWidth={6} />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {creative.platform}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Reach</p>
                    <p className="font-medium font-mono">{creative.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium font-mono">{creative.engagementRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CTR</p>
                    <p className="font-medium font-mono">{creative.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clicks</p>
                    <p className="font-medium font-mono">{creative.clicks}</p>
                  </div>
                </div>

                <Link
                  href={`/analytics/creatives/${creative.creativeId}`}
                  className="block text-center text-sm text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Full Metrics →
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCreatives.length === 0 && (
        <Card>
          <CardContent className="flex h-48 items-center justify-center">
            <p className="text-muted-foreground">No creatives found for this filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
