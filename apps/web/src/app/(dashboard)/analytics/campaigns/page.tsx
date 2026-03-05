'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { ChevronDown01Icon } from '@/lib/icons'
import type { CampaignMetrics } from '@repo/types'

// TODO: Fetch from API
const mockCampaignMetrics: CampaignMetrics[] = []

type SortField = 'campaignName' | 'reach' | 'engagement' | 'ctr' | 'clicks' | 'score'
type SortDirection = 'asc' | 'desc'

export default function CampaignAnalyticsPage() {
  useEffect(() => { document.title = 'Campaign Analytics | Coff' }, [])

  const [sortField, setSortField] = useState<SortField>('score')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])

  const sortedCampaigns = useMemo(() => {
    const sorted = [...mockCampaignMetrics].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      const aNum = Number(aValue)
      const bNum = Number(bValue)
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
    })

    return sorted
  }, [sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns((prev) => {
      if (prev.includes(campaignId)) {
        return prev.filter((id) => id !== campaignId)
      }
      if (prev.length >= 2) {
        return [prev[1], campaignId]
      }
      return [...prev, campaignId]
    })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return (
      <ChevronDown01Icon size={14} className={`inline ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
    )
  }

  return (
    <div >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campaign Analytics</h1>
        <p className="text-muted-foreground">
          Compare performance metrics across all campaigns
        </p>
      </div>

      {/* Comparison Mode */}
      {selectedCampaigns.length === 2 && (
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle>Campaign Comparison</CardTitle>
            <CardDescription>Side-by-side comparison of selected campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedCampaigns.map((campaignId) => {
                const campaign = mockCampaignMetrics.find((c) => c.campaignId === campaignId)
                if (!campaign) return null

                return (
                  <div key={campaignId} className="space-y-3 rounded-lg border border-border p-4">
                    <h3 className="font-semibold">{campaign.campaignName}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Reach</p>
                        <p className="font-medium font-mono">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-medium font-mono">{campaign.engagement.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-medium font-mono">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-medium font-mono">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Score</p>
                        <p className="text-lg font-bold text-primary font-mono">{campaign.score}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setSelectedCampaigns([])}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear comparison
            </button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Click column headers to sort. Select up to 2 campaigns to compare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3">
                    <input type="checkbox" className="mr-2" disabled />
                  </th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => handleSort('campaignName')}
                  >
                    Campaign <SortIcon field="campaignName" />
                  </th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => handleSort('reach')}
                  >
                    Reach <SortIcon field="reach" />
                  </th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => handleSort('engagement')}
                  >
                    Engagement <SortIcon field="engagement" />
                  </th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => handleSort('ctr')}
                  >
                    CTR <SortIcon field="ctr" />
                  </th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => handleSort('clicks')}
                  >
                    Clicks <SortIcon field="clicks" />
                  </th>
                  <th
                    className="cursor-pointer pb-3 font-medium hover:text-foreground"
                    onClick={() => handleSort('score')}
                  >
                    Score <SortIcon field="score" />
                  </th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map((campaign) => (
                  <tr
                    key={campaign.campaignId}
                    className={`border-b border-border transition-colors hover:bg-muted/50 ${
                      selectedCampaigns.includes(campaign.campaignId) ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-4">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.campaignId)}
                        onChange={() => toggleCampaignSelection(campaign.campaignId)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{campaign.campaignName}</p>
                        <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-sm">
                      {campaign.reach.toLocaleString()}
                    </td>
                    <td className="py-4 font-mono text-sm">
                      {campaign.engagement.toLocaleString()}
                    </td>
                    <td className="py-4 font-mono text-sm">{campaign.ctr}%</td>
                    <td className="py-4 font-mono text-sm">
                      {campaign.clicks.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          campaign.score >= 85
                            ? 'bg-primary/20 text-primary'
                            : campaign.score >= 70
                              ? 'bg-blue-500/20 text-blue-400'
                              : campaign.score >= 50
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        {campaign.score}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/analytics/campaigns/${campaign.campaignId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
