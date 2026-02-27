import { Button } from '@repo/ui'
import { Plus, Target } from 'lucide-react'
import Link from 'next/link'

export default function CampaignsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage multi-platform campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Target className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Create your first AI-powered campaign. We'll generate creatives for all your platforms.
        </p>
        <Link href="/campaigns/new" className="mt-6">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create First Campaign
          </Button>
        </Link>
      </div>
    </div>
  )
}
