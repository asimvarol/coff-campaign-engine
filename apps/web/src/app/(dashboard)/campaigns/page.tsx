'use client'

import { useEffect, useState } from 'react'
import { Button, Badge, Card, CardContent, Input } from '@repo/ui'
import { Add01Icon, Target03Icon, Search01Icon } from '@/lib/icons'
import Link from 'next/link'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import Image from 'next/image'
import { useBrand } from '@/lib/brand-context'
import { formatDate } from '@/lib/format-date'
import { GettingStarted } from '@/components/getting-started'

interface Campaign {
  id: string
  name: string
  brandId: string
  brandName: string
  brandLogo: string
  objective: string
  status: string
  platforms: string[]
  creativeCount: number
  createdAt: string
  updatedAt: string
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; color: string }> = {
  DRAFT: { label: 'Draft', variant: 'secondary', color: 'oklch(0.7 0.05 240)' },
  GENERATING: { label: 'Generating', variant: 'default', color: 'oklch(0.65 0.15 280)' },
  REVIEW: { label: 'Review', variant: 'default', color: 'oklch(0.70 0.18 60)' },
  APPROVED: { label: 'Approved', variant: 'default', color: 'oklch(0.65 0.15 160)' },
  PUBLISHED: { label: 'Published', variant: 'default', color: 'oklch(0.60 0.18 145)' },
}

const objectiveLabels: Record<string, string> = {
  AWARENESS: 'Awareness',
  ENGAGEMENT: 'Engagement',
  CONVERSION: 'Conversion',
  PRODUCT_LAUNCH: 'Product Launch',
  SEASONAL: 'Seasonal',
}

export default function CampaignsPage() {
  useEffect(() => { document.title = 'Campaigns | Coff' }, [])

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { selectedBrandId } = useBrand()

  useEffect(() => {
    setIsLoading(true)
    const url = selectedBrandId ? `/api/campaigns?brandId=${selectedBrandId}` : '/api/campaigns'
    fetch(url)
      .then(res => res.json())
      .then(data => setCampaigns(data.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [selectedBrandId])

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => ['PUBLISHED', 'GENERATING', 'REVIEW'].includes(c.status)).length,
    published: campaigns.filter(c => c.status === 'PUBLISHED').length,
    totalCreatives: campaigns.reduce((sum, c) => sum + c.creativeCount, 0),
  }

  return (
    <div >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage multi-platform campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button size="lg"><Add01Icon className="mr-2 h-4 w-4" />New Campaign</Button>
        </Link>
      </div>

      <GettingStarted />

      {/* Search & Filter */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative flex-1">
          <Search01Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'DRAFT', 'PUBLISHED', 'GENERATING', 'REVIEW'].map(status => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : statusConfig[status]?.label || status}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Campaigns</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">{stats.published}</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold font-mono">{stats.totalCreatives}</div>
            <div className="text-sm text-muted-foreground">Total Creatives</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Target03Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add a brand first, then campaigns will be generated from your brand's products and collections.
          </p>
          <Link href="/brand/new" className="mt-6">
            <Button><Add01Icon className="mr-2 h-4 w-4" />Add a Brand</Button>
          </Link>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          <Search01Icon className="h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No results found</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            No campaigns match your search or filter criteria. Try adjusting your filters.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setStatusFilter('all') }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => {
            const statusInfo = statusConfig[campaign.status] || statusConfig.DRAFT
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={campaign.brandLogo} alt={campaign.brandName} fill unoptimized className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold group-hover:text-primary">{campaign.name}</h3>
                      <p className="text-xs text-muted-foreground">{campaign.brandName}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant={statusInfo.variant} style={{ backgroundColor: statusInfo.color }}>{statusInfo.label}</Badge>
                    <Badge variant="outline">{objectiveLabels[campaign.objective] || campaign.objective}</Badge>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-1">
                    {campaign.platforms.map((p) => (
                      <span key={p} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {PLATFORM_LABELS[p] || p}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                    <span>{campaign.creativeCount} creatives</span>
                    <span>{formatDate(campaign.updatedAt)}</span>
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
