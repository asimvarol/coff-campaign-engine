'use client'

import { AgencyBillingOverview } from '@/components/agency/agency-billing-overview'
import { AgencyOverview } from '@/components/agency/agency-overview'
import { AgencyUpgradeCard } from '@/components/agency/agency-upgrade-card'
import { mockAgencyBrands, mockAgency } from '@/lib/mock-data/agency'

export default function AgencyBillingPage() {
  const kpis = [
    { label: 'Total Credits Used', value: mockAgency.totalCreditsUsed.toLocaleString() },
    { label: 'Credits Remaining', value: mockAgency.totalCreditsRemaining.toLocaleString() },
    { label: 'Monthly Plan', value: '$' + mockAgency.monthlySpend },
    { label: 'Plan', value: mockAgency.plan },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">Credit usage and subscription management</p>
      </div>
      <AgencyOverview kpis={kpis} />
      <AgencyBillingOverview brands={mockAgencyBrands} />
      <AgencyUpgradeCard />
    </div>
  )
}
