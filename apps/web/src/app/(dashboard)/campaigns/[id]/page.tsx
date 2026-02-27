import { Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui'
import { Edit02Icon, Copy01Icon, Delete02Icon, Download04Icon, Add01Icon } from '@/lib/icons-temp'
import { mockCampaigns, mockCreatives } from '@/lib/mock-data/campaigns'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const statusConfig = {
  DRAFT: { label: 'Draft', variant: 'secondary' as const },
  GENERATING: { label: 'Generating', variant: 'default' as const },
  REVIEW: { label: 'Review', variant: 'default' as const },
  APPROVED: { label: 'Approved', variant: 'default' as const },
  PUBLISHED: { label: 'Published', variant: 'default' as const },
  PAUSED: { label: 'Paused', variant: 'outline' as const },
  COMPLETED: { label: 'Completed', variant: 'secondary' as const },
  ARCHIVED: { label: 'Archived', variant: 'outline' as const },
}

const objectiveLabels = {
  AWARENESS: 'Awareness',
  ENGAGEMENT: 'Engagement',
  CONVERSION: 'Conversion',
  TRAFFIC: 'Traffic',
  PRODUCT_LAUNCH: 'Product Launch',
  SEASONAL: 'Seasonal',
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  
  if (!campaign) {
    notFound()
  }

  const campaignCreatives = mockCreatives.filter(c => c.campaignId === campaign.id)
  const statusInfo = statusConfig[campaign.status]

  // Group creatives by platform
  const creativesByPlatform = campaign.platforms.reduce((acc, platform) => {
    acc[platform] = campaignCreatives.filter(c => c.platform === platform)
    return acc
  }, {} as Record<string, typeof campaignCreatives>)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={campaign.brandLogo}
                alt={campaign.brandName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold">{campaign.name}</h1>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{campaign.brandName}</span>
                <span>•</span>
                <span>{objectiveLabels[campaign.objective]}</span>
                <span>•</span>
                <span>{campaign.creativeCount} creatives</span>
                <span>•</span>
                <span>Updated {new Date(campaign.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit02Icon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Copy01Icon className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <Download04Icon className="mr-2 h-4 w-4" />
              Download All
            </Button>
            <Button variant="outline" size="sm">
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
          <div className="text-2xl font-bold">24.5K</div>
          <div className="text-sm text-muted-foreground">Total Reach</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">1,247</div>
          <div className="text-sm text-muted-foreground">Engagement</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">3.2%</div>
          <div className="text-sm text-muted-foreground">CTR</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">342</div>
          <div className="text-sm text-muted-foreground">Clicks</div>
        </div>
      </div>

      {/* Creatives by Platform */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Creatives</h2>
          <Link href="/campaigns/new">
            <Button>
              <Add01Icon className="mr-2 h-4 w-4" />
              Generate More
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({campaignCreatives.length})
            </TabsTrigger>
            {campaign.platforms.map(platform => (
              <TabsTrigger key={platform} value={platform}>
                {PLATFORM_LABELS[platform]} ({creativesByPlatform[platform]?.length || 0})
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
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {PLATFORM_LABELS[creative.platform]}
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
      </div>
    </div>
  )
}
