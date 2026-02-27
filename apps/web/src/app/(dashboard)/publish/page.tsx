import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { Calendar, Plus } from 'lucide-react'

export default function PublishPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your social media posts</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        <Button variant="outline">Month</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Day</Button>
      </div>

      <div className="rounded-lg border border-border">
        <div className="grid grid-cols-7 border-b border-border">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="border-r border-border p-4 text-center text-sm font-medium last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[120px] border-r border-b border-border p-2 last:border-r-0">
              <div className="text-sm text-muted-foreground">{(i % 31) + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">Connected Accounts</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instagram</CardTitle>
              <CardDescription>No account connected</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Facebook</CardTitle>
              <CardDescription>No account connected</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">TikTok</CardTitle>
              <CardDescription>No account connected</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
