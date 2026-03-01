'use client'

import { Card, CardContent } from '@repo/ui'
import { Button } from '@repo/ui'


export function AgencyUpgradeCard() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          🚀
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Upgrade to Agency Pro</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Unlimited brands, 10 team members, white-label dashboards, and 20% bulk credit discount.
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <Button className="mt-2">Start Free Trial</Button>
        </div>
      </CardContent>
    </Card>
  )
}
