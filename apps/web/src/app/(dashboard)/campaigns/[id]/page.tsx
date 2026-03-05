'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Skeleton, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Separator } from '@repo/ui'
import { Edit02Icon, Copy01Icon, Delete02Icon, Download04Icon, Add01Icon } from '@/lib/icons'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import { formatDate } from '@/lib/format-date'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

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
  creatives?: Creative[]
  createdAt: string
  updatedAt: string
}

interface Creative {
  id: string
  campaignId: string
  platform: string
  format: string
  width: number
  height: number
  imageUrl: string
  header: { text: string }
  version: number
  createdAt: string
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  GENERATING: { label: 'Generating', variant: 'default' },
  REVIEW: { label: 'Review', variant: 'default' },
  APPROVED: { label: 'Approved', variant: 'default' },
  PUBLISHED: { label: 'Published', variant: 'default' },
  PAUSED: { label: 'Paused', variant: 'outline' },
  COMPLETED: { label: 'Completed', variant: 'secondary' },
  ARCHIVED: { label: 'Archived', variant: 'outline' },
}

const objectiveLabels: Record<string, string> = {
  AWARENESS: 'Awareness',
  ENGAGEMENT: 'Engagement',
  CONVERSION: 'Conversion',
  TRAFFIC: 'Traffic',
  PRODUCT_LAUNCH: 'Product Launch',
  SEASONAL: 'Seasonal',
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  useEffect(() => { document.title = 'Campaign Detail | Coff' }, [])

  const { id } = use(params)
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [archiveAlertOpen, setArchiveAlertOpen] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setIsNotFound(true)
          } else {
            setError('Failed to load campaign')
          }
          return
        }
        const data = await response.json()
        setCampaign(data.data)
      } catch {
        setError('Network error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [id])

  if (isNotFound) {
    notFound()
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center" role="alert">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading || !campaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  const campaignCreatives: Creative[] = campaign.creatives || []
  const statusInfo = statusConfig[campaign.status] || statusConfig.DRAFT

  const handleArchive = async () => {
    setIsArchiving(true)
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })
      if (!response.ok) throw new Error('Failed to archive')
      router.push('/campaigns')
    } catch {
      setError('Failed to archive campaign. Please try again.')
      setIsArchiving(false)
      setArchiveAlertOpen(false)
    }
  }

  // Group creatives by platform
  const creativesByPlatform = campaign.platforms.reduce((acc, platform) => {
    acc[platform] = campaignCreatives.filter(c => c.platform === platform)
    return acc
  }, {} as Record<string, Creative[]>)

  return (
    <div >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={campaign.brandLogo}
                alt={campaign.brandName}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold truncate max-w-md" title={campaign.name}>{campaign.name}</h1>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{campaign.brandName}</span>
                <span>•</span>
                <span>{objectiveLabels[campaign.objective] || campaign.objective}</span>
                <span>•</span>
                <span>{campaignCreatives.length} creatives</span>
                <span>•</span>
                <span>Updated {formatDate(campaign.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" aria-label="Edit campaign">
              <Edit02Icon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" aria-label="Duplicate campaign">
              <Copy01Icon className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm" aria-label="Download all creatives" disabled={campaignCreatives.length === 0} title={campaignCreatives.length === 0 ? 'No creatives to download' : ''}>
              <Download04Icon className="mr-2 h-4 w-4" />
              Download All
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button variant="outline" size="sm" aria-label="Archive campaign" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => setArchiveAlertOpen(true)}>
              <Delete02Icon className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-2">
          {campaign.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-md bg-muted px-3 py-1 text-sm font-medium"
            >
              {PLATFORM_LABELS[platform] || platform}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold font-mono">{campaignCreatives.length}</div>
          <div className="text-sm text-muted-foreground">Creatives</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold font-mono">{campaign.platforms.length}</div>
          <div className="text-sm text-muted-foreground">Platforms</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">CTR</div>
          <div className="text-lg font-medium text-muted-foreground/60 italic">&mdash;</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Clicks</div>
          <div className="text-lg font-medium text-muted-foreground/60 italic">&mdash;</div>
        </div>
      </div>

      {/* Creatives by Platform */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Creatives</h2>
          <Link href="/campaigns/new">
            <Button aria-label="Generate more creatives">
              <Add01Icon className="mr-2 h-4 w-4" />
              Generate More
            </Button>
          </Link>
        </div>

        {campaignCreatives.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                All ({campaignCreatives.length})
              </TabsTrigger>
              {campaign.platforms.map(platform => (
                <TabsTrigger key={platform} value={platform}>
                  {PLATFORM_LABELS[platform] || platform} ({creativesByPlatform[platform]?.length || 0})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {campaignCreatives.map(creative => (
                  <Link
                    key={creative.id}
                    href={`/campaigns/${campaign.id}/${creative.id}`}
                    className="group overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="relative" style={{ aspectRatio: `${creative.width}/${creative.height}` }}>
                      <Image
                        src={creative.imageUrl}
                        alt={creative.header.text}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {PLATFORM_LABELS[creative.platform] || creative.platform}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {creative.format}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {creative.header.text}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>v{creative.version}</span>
                        <span>{new Date(creative.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {campaign.platforms.map(platform => (
              <TabsContent key={platform} value={platform} className="mt-6">
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {(creativesByPlatform[platform] || []).map(creative => (
                    <Link
                      key={creative.id}
                      href={`/campaigns/${campaign.id}/${creative.id}`}
                      className="group overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg"
                    >
                      <div className="relative" style={{ aspectRatio: `${creative.width}/${creative.height}` }}>
                        <Image
                          src={creative.imageUrl}
                          alt={creative.header.text}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">{creative.format}</span>
                          <Badge variant="outline" className="text-xs">
                            {creative.width}×{creative.height}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {creative.header.text}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No creatives generated yet. Click "Generate More" to create creatives for this campaign.
            </p>
          </div>
        )}
      </div>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={archiveAlertOpen} onOpenChange={setArchiveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this campaign? Archived campaigns can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} disabled={isArchiving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isArchiving ? 'Archiving...' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
