'use client'

import { Button } from '@repo/ui'
import { AgencyOverview } from '@/components/agency/agency-overview'
import { AgencyBrandsList } from '@/components/agency/agency-brands-list'
import { AgencyActivityLog } from '@/components/agency/agency-activity-log'
import { mockAgency, mockAgencyBrands, mockTeamActivities } from '@/lib/mock-data/agency'

export default function AgencyPage() {
  const kpis = [
    { label: 'Client Brands', value: mockAgencyBrands.length, subtitle: 'Unlimited on Pro' },
    { label: 'Team Members', value: mockAgency.members.length, subtitle: 'of 10 slots' },
    { label: 'Credits Used', value: mockAgency.totalCreditsUsed.toLocaleString(), subtitle: `${mockAgency.totalCreditsRemaining.toLocaleString()} remaining` },
    { label: 'Monthly Plan', value: `$${mockAgency.monthlySpend}`, subtitle: 'Pro plan' },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agency</h1>
          <p className="text-sm text-muted-foreground">Multi-brand management for your team</p>
        </div>
        <Button size="sm">+ Add Brand</Button>
      </div>
      <AgencyOverview kpis={kpis} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Client Brands</h2>
          <AgencyBrandsList brands={mockAgencyBrands} />
        </div>
        <AgencyActivityLog activities={mockTeamActivities.slice(0, 6)} />
      </div>
    </div>
  )
}
