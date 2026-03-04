import Link from 'next/link'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { Calendar03Icon, Link01Icon, Share08Icon, AlertCircle01Icon } from '@/lib/icons'
import { getPublishStats, getRecentActivity, getPlatform } from '@/lib/mock-data/publish'

export default function PublishPage() {
  const stats = getPublishStats()
  const recentActivity = getRecentActivity()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Publish Hub</h1>
          <p className="mt-2 text-muted-foreground">
            Schedule and manage your social media posts
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/publish/accounts">
              <Link01Icon className="mr-2 h-4 w-4" />
              Connect Account
            </Link>
          </Button>
          <Button asChild>
            <Link href="/publish/schedule">
              <Calendar03Icon className="mr-2 h-4 w-4" />
              Schedule Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Share08Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar03Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Upcoming posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Share08Icon className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Successfully posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle01Icon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 10 published and scheduled posts</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/publish/queue">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((post) => {
              const platform = getPlatform(post.platform)
              const date = new Date(post.scheduledFor)
              const isUpcoming = date > new Date()

              return (
                <div
                  key={post.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  {/* Creative Thumbnail */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={post.creativeThumbnail}
                      alt="Creative"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {platform?.icon} {platform?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isUpcoming ? 'Scheduled for' : 'Published'}{' '}
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-chart-3/10 text-chart-3'
                            : post.status === 'failed'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {post.status === 'published' ? '✓ Published' : 
                         post.status === 'failed' ? '✗ Failed' : 
                         '◷ Scheduled'}
                      </span>
                      {post.postUrl && (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View Post →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-dashed hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar03Icon className="h-5 w-5" />
              Content Calendar
            </CardTitle>
            <CardDescription>
              View and manage all scheduled posts in a calendar view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/publish/calendar">Open Calendar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link01Icon className="h-5 w-5" />
              Connected Accounts
            </CardTitle>
            <CardDescription>
              Manage your connected social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/publish/accounts">Manage Accounts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
