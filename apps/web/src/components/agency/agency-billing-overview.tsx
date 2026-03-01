'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import type { AgencyBrand } from '@repo/types'

export function AgencyBillingOverview({ brands }: { brands: AgencyBrand[] }) {
  const maxCredits = Math.max(...brands.map(b => b.creditsUsed))
  const totalCredits = brands.reduce((sum, b) => sum + b.creditsUsed, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Usage by Brand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground tabular-nums">{totalCredits}</span> credits used
        </div>
        <svg viewBox="0 0 600 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {brands.map((b, i) => {
            const barW = (b.creditsUsed / maxCredits) * 400
            const y = i * 38 + 5
            return (
              <g key={b.id}>
                <text x="0" y={y + 16} className="fill-foreground text-[11px]">{b.name.slice(0, 20)}</text>
                <rect x="160" y={y} width={barW} height="24" rx="4"
                  fill="oklch(0.66 0.21 354)" opacity={0.6 + (i * 0.1)} />
                <text x={165 + barW} y={y + 16} className="fill-muted-foreground text-[11px]">
                  {b.creditsUsed}
                </text>
              </g>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}
