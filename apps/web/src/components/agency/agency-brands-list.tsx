'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, Badge } from '@repo/ui'
import type { AgencyBrand } from '@repo/types'

export function AgencyBrandsList({ brands }: { brands: AgencyBrand[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brand/${brand.id}`}>
          <Card className="group cursor-pointer transition-all hover:border-primary/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Image src={brand.logoUrl} alt={brand.name} width={48} height={48} className="h-12 w-12 shrink-0 rounded-lg bg-muted object-cover" unoptimized />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold leading-tight" title={brand.name}>{brand.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{brand.industry}</p>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs tabular-nums" title="Brand health score based on campaign performance">{brand.avgPerformance}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="min-w-0">
                  <div className="text-sm font-semibold tabular-nums">{brand.campaignCount}</div>
                  <div className="truncate text-[10px] leading-tight text-muted-foreground">Campaigns</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold tabular-nums">{brand.creativeCount}</div>
                  <div className="truncate text-[10px] leading-tight text-muted-foreground">Creatives</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold tabular-nums">{brand.creditsUsed}</div>
                  <div className="truncate text-[10px] leading-tight text-muted-foreground">Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
