'use client'

import { AnalyticsCampaignComparison } from '@/components/analytics/analytics-campaign-comparison'
import { mockCampaignAnalytics } from '@/lib/mock-data/analytics'

export default function AnalyticsCampaignsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Campaign Analytics</h1>
        <p className="text-sm text-muted-foreground">Compare performance across all your campaigns</p>
      </div>
      <AnalyticsCampaignComparison campaigns={mockCampaignAnalytics} />
    </div>
  )
}
