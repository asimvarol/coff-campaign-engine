'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { AgencyMember } from '@repo/types'

function roleBadge(role: string) {
  if (role === 'OWNER') return 'default'
  if (role === 'ADMIN') return 'secondary'
  return 'outline'
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function AgencyTeamTable({ members }: { members: AgencyMember[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Member</th>
                <th className="pb-2 pr-4 font-medium">Role</th>
                <th className="pb-2 pr-4 font-medium">Brand Access</th>
                <th className="pb-2 font-medium text-right">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 pr-4">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={roleBadge(m.role) as 'default' | 'secondary' | 'outline'}>{m.role}</Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {m.brandAccess.length === 0 ? 'All brands' : `${m.brandAccess.length} brands`}
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground">{timeAgo(m.lastActiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
