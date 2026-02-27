import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { Plus, Building2, Users } from 'lucide-react'

export default function AgencyPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agency</h1>
          <p className="text-muted-foreground">Multi-brand management for agencies and teams</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Client Brands</CardDescription>
            <CardTitle className="text-2xl">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Team Members</CardDescription>
            <CardTitle className="text-2xl">1</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Credits Used</CardDescription>
            <CardTitle className="text-2xl">0</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Agency Mode</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upgrade to Agency Plan to manage multiple client brands, collaborate with your team, and get bulk pricing.
        </p>
        <Button className="mt-6">Upgrade to Agency Plan</Button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Agency Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Unlimited client brands</li>
              <li>✓ Team collaboration (10 members)</li>
              <li>✓ Bulk credit packages (20% discount)</li>
              <li>✓ White-label client dashboards</li>
              <li>✓ Branded PDF reports</li>
              <li>✓ Priority support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">+ credit packages as you go</p>
              <Button className="mt-4 w-full">Start 14-Day Free Trial</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
