import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@repo/ui'
import { PlusIcon, ZapIcon, AlertCircleIcon, TrendingUpIcon } from '@/lib/icons'

export const metadata = { title: 'Autopilot | Coff' }

export default function AutopilotPage() {
  return (
    <div >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autopilot</h1>
          <p className="text-muted-foreground">Automatic campaign optimization</p>
        </div>
        <Button size="lg">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Rule
        </Button>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription title="Rules currently monitoring your campaigns">Active Rules</CardDescription>
            <CardTitle className="text-2xl">4/6</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Actions Today</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription title="Estimated savings from automated optimizations this month">Savings</CardDescription>
            <CardTitle className="text-2xl">$342</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Saved from auto-optimizations this month</p>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold">Recent Actions</h3>
        <div className="space-y-3">
          <Card>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircleIcon className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Paused "Ancient Craft" IG Story</p>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-sm text-muted-foreground">CTR 0.3% &lt; 1% threshold (24h)</p>
                <p className="mt-1 text-xs text-muted-foreground">10:23 AM</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">View</Button>
                <Button size="sm" variant="outline">Undo</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <ZapIcon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Generated replacement creative</p>
                  <Badge>New</Badge>
                </div>
                <p className="text-sm text-muted-foreground">New: "Timeless Heritage" IG Story v2</p>
                <p className="mt-1 text-xs text-muted-foreground">10:24 AM</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Approve & Publish</Button>
                <Button size="sm" variant="outline">Reject</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">High performer detected!</p>
                  <Badge variant="secondary">Success</Badge>
                </div>
                <p className="text-sm text-muted-foreground">"Honor Her Story" FB Feed — CTR: 6.2%</p>
                <p className="mt-1 text-xs text-muted-foreground">9:15 AM</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Boost 2x</Button>
                <Button size="sm" variant="outline">Ignore</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Active Rules</h3>
        <div className="grid gap-3">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Critical Low Performance</p>
                <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">CTR &lt; 0.5% (24h)</code> <span className="mx-1">→</span> Pause + Notify</p>
              </div>
              <Badge>Active</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Low Performance</p>
                <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">CTR &lt; 1% (48h)</code> <span className="mx-1">→</span> Replace + Notify</p>
              </div>
              <Badge>Active</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">High Performer Boost</p>
                <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">CTR &gt; 5% (24h)</code> <span className="mx-1">→</span> Increase budget 2x</p>
              </div>
              <Badge>Active</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Engagement Surge</p>
                <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Engagement &gt; 10%</code> <span className="mx-1">→</span> Cross-post to other platforms</p>
              </div>
              <Badge>Active</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Budget Cap Alert</p>
                <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Daily spend &gt; $50</code> <span className="mx-1">→</span> Pause + Notify</p>
              </div>
              <Badge variant="outline">Paused</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Weekend Schedule</p>
                <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Sat-Sun</code> <span className="mx-1">→</span> Reduce posting frequency by 50%</p>
              </div>
              <Badge variant="outline">Paused</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
