'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui'
import { Download04Icon } from '@/lib/icons'
import { mockAgencyBrands } from '@/lib/mock-data/agency'

export default function AgencyReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate branded PDF reports for your clients</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockAgencyBrands.map((brand) => (
          <Card key={brand.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Image src={brand.logoUrl} alt={brand.name} width={40} height={40} className="h-10 w-10 rounded-lg bg-muted object-cover" unoptimized />
                <CardTitle className="text-sm">{brand.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 text-xs text-muted-foreground mb-3">
                <span>{brand.campaignCount} campaigns</span>
                <span>·</span>
                <span>{brand.creativeCount} creatives</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs"><Download04Icon className="mr-1 h-3 w-3" />Download Weekly</Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs"><Download04Icon className="mr-1 h-3 w-3" />Download Monthly</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
