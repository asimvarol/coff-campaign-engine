import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track campaign performance across all platforms</p>
        </div>
        <select className="rounded-lg border border-input bg-background px-3 py-2">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Reach</CardDescription>
            <CardTitle className="text-2xl">12.4K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-accent">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+23%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Engagement</CardDescription>
            <CardTitle className="text-2xl">856</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-accent">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>CTR</CardDescription>
            <CardTitle className="text-2xl">3.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-destructive">
              <TrendingDown className="mr-1 h-4 w-4" />
              <span>-0.4%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Clicks</CardDescription>
            <CardTitle className="text-2xl">245</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-accent">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+8%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Instagram</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[68%] rounded-full bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Facebook</span>
                <span className="text-sm font-medium">21%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[21%] rounded-full bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">TikTok</span>
                <span className="text-sm font-medium">11%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[11%] rounded-full bg-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Creative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-lg bg-muted" />
              <div>
                <p className="font-medium">Honor Her Story</p>
                <p className="text-sm text-muted-foreground">Instagram Story</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>Reach: 4.2K</span>
                  <span className="text-accent">CTR: 5.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
