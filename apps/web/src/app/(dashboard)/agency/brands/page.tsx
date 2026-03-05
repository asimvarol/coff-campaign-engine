'use client'

import { useEffect } from 'react'
import { Button } from '@repo/ui'
import { AgencyBrandsList } from '@/components/agency/agency-brands-list'
import type { AgencyBrand } from '@repo/types'

// TODO: Fetch from API
const mockAgencyBrands: AgencyBrand[] = []

export default function AgencyBrandsPage() {
  useEffect(() => { document.title = 'Agency Brands | Coff' }, [])

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
