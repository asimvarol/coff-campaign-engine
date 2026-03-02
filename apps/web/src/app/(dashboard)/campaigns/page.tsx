import { Button, Badge } from '@repo/ui'
import { Add01Icon, Target03Icon } from '@/lib/icons'
import Link from 'next/link'
import { mockCampaigns, getCampaignStats } from '@/lib/mock-data/campaigns'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import Image from 'next/image'

const statusConfig = {
  DRAFT: { label: 'Draft', variant: 'secondary' as const, color: 'oklch(0.7 0.05 240)' },
  GENERATING: { label: 'Generating', variant: 'default' as const, color: 'oklch(0.65 0.15 280)' },
  REVIEW: { label: 'Review', variant: 'default' as const, color: 'oklch(0.70 0.18 60)' },
  APPROVED: { label: 'Approved', variant: 'default' as const, color: 'oklch(0.65 0.15 160)' },
  PUBLISHED: { label: 'Published', variant: 'default' as const, color: 'oklch(0.60 0.18 145)' },
  PAUSED: { label: 'Paused', variant: 'outline' as const, color: 'oklch(0.50 0.05 240)' },
  COMPLETED: { label: 'Completed', variant: 'secondary' as const, color: 'oklch(0.60 0.10 200)' },
  ARCHIVED: { label: 'Archived', variant: 'outline' as const, color: 'oklch(0.50 0.02 240)' },
}

const objectiveLabels = {
  AWARENESS: 'Awareness',
  ENGAGEMENT: 'Engagement',
  CONVERSION: 'Conversion',
  TRAFFIC: 'Traffic',
  PRODUCT_LAUNCH: 'Product Launch',
  SEASONAL: 'Seasonal',
}

export default function CampaignsPage() {
  const stats = getCampaignStats()
  
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage multi-platform campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button size="lg" aria-label="Create new campaign">
            <Add01Icon className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Campaigns</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{stats.published}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">{stats.totalCreatives}</div>
          <div className="text-sm text-muted-foreground">Total Creatives</div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {mockCampaigns.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Target03Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first AI-powered campaign. We'll generate creatives for all your platforms.
          </p>
          <Link href="/campaigns/new" className="mt-6">
            <Button aria-label="Create your first campaign">
              <Add01Icon className="mr-2 h-4 w-4" />
              Create First Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((campaign) => {
            const statusInfo = statusConfig[campaign.status]
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image
                          src={campaign.brandLogo}
                          alt={campaign.brandName}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary">{campaign.name}</h3>
                        <p className="text-xs text-muted-foreground">{campaign.brandName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Objective */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant={statusInfo.variant} style={{ backgroundColor: statusInfo.color }}>
                      {statusInfo.label}
                    </Badge>
                    <Badge variant="outline">
                      {objectiveLabels[campaign.objective]}
                    </Badge>
                  </div>

                  {/* Platforms */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {campaign.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          {PLATFORM_LABELS[platform] || platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                    <span>{campaign.creativeCount} creatives</span>
                    <span>{new Date(campaign.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
