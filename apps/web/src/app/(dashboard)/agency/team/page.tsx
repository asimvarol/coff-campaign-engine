'use client'

import { Button } from '@repo/ui'
import { AgencyTeamTable } from '@/components/agency/agency-team-table'
import { mockAgencyMembers } from '@/lib/mock-data/agency'

export default function AgencyTeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-sm text-muted-foreground">Manage team members and permissions</p>
        </div>
        <Button size="sm">+ Invite Member</Button>
      </div>
      <AgencyTeamTable members={mockAgencyMembers} />
    </div>
  )
}
