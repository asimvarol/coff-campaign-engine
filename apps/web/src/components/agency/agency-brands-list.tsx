'use client'

import { Card, CardContent } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { AgencyBrand } from '@repo/types'

export function AgencyBrandsList({ brands }: { brands: AgencyBrand[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <Card key={brand.id} className="transition-colors hover:border-primary/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <img src={brand.logoUrl} alt={brand.name} className="h-12 w-12 rounded-lg bg-muted object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{brand.name}</h3>
                <p className="text-xs text-muted-foreground">{brand.industry}</p>
              </div>
              <Badge variant="outline" className="text-xs tabular-nums">{brand.avgPerformance}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-semibold tabular-nums">{brand.campaignCount}</div>
                <div className="text-xs text-muted-foreground">Campaigns</div>
              </div>
              <div>
                <div className="text-sm font-semibold tabular-nums">{brand.creativeCount}</div>
                <div className="text-xs text-muted-foreground">Creatives</div>
              </div>
              <div>
                <div className="text-sm font-semibold tabular-nums">{brand.creditsUsed}</div>
                <div className="text-xs text-muted-foreground">Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
