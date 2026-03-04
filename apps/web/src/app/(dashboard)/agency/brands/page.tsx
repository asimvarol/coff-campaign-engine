'use client'

import { Button } from '@repo/ui'
import { AgencyBrandsList } from '@/components/agency/agency-brands-list'
import { mockAgencyBrands } from '@/lib/mock-data/agency'

export default function AgencyBrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Brands</h1>
          <p className="text-sm text-muted-foreground">Manage all your client brands</p>
        </div>
        <Button size="sm">+ Add Brand</Button>
      </div>
      <AgencyBrandsList brands={mockAgencyBrands} />
    </div>
  )
}
