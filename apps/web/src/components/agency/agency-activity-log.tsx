'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import type { TeamActivity } from '@repo/types'

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function AgencyActivityLog({ activities }: { activities: TeamActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3 text-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {a.userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p>
                <span className="font-medium">{a.userName}</span>{' '}
                <span className="text-muted-foreground">{a.action}</span>{' '}
                <span className="font-medium">{a.target}</span>
              </p>
              {a.brandName && (
                <p className="text-xs text-muted-foreground">{a.brandName}</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
