import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const analyticsRouter = new Hono()

// Validation schemas
const dateRangeSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  period: z.enum(['7d', '30d', '90d']).optional(),
})

const paginationSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 20)),
})

const sortSchema = z.object({
  sortBy: z.enum(['reach', 'engagement', 'ctr', 'clicks', 'score', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

const compareSchema = z.object({
  type: z.enum(['campaign', 'creative']),
  ids: z.array(z.string()).min(2).max(2),
})

// GET /api/analytics/overview
// Returns KPI stats + trends for date range
analyticsRouter.get('/overview', zValidator('query', dateRangeSchema), async (c) => {
  const { period = '30d' } = c.req.valid('query')

  // Mock data - in production, fetch from database
  const data = {
    totalReach: 12400,
    totalReachChange: 23,
    totalEngagement: 856,
    totalEngagementChange: 12,
    avgCtr: 3.2,
    avgCtrChange: -0.4,
    totalClicks: 245,
    totalClicksChange: 8,
    totalSaves: 187,
    totalSavesChange: 31,
    period,
  }

  return c.json({ data })
})

// GET /api/analytics/reach-trend
// Returns time series data
analyticsRouter.get('/reach-trend', zValidator('query', dateRangeSchema), async (c) => {
  const { period = '30d' } = c.req.valid('query')

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

  // Mock time series data
  const data = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return {
      date: date.toISOString().split('T')[0],
      reach: Math.floor(300 + Math.random() * 500),
      engagement: Math.floor(20 + Math.random() * 40),
      clicks: Math.floor(5 + Math.random() * 15),
    }
  })

  return c.json({ data })
})

// GET /api/analytics/platform-breakdown
// Returns per-platform metrics
analyticsRouter.get('/platform-breakdown', zValidator('query', dateRangeSchema), async (c) => {
  const data = [
    {
      platform: 'Instagram',
      reach: 8432,
      engagement: 582,
      clicks: 167,
      percentage: 68,
    },
    {
      platform: 'Facebook',
      reach: 2604,
      engagement: 178,
      clicks: 51,
      percentage: 21,
    },
    {
      platform: 'TikTok',
      reach: 1364,
      engagement: 96,
      clicks: 27,
      percentage: 11,
    },
  ]

  return c.json({ data })
})

// GET /api/analytics/campaigns
// Returns campaign-level metrics with sorting + pagination
analyticsRouter.get(
  '/campaigns',
  zValidator('query', z.object({ ...paginationSchema.shape, ...sortSchema.shape })),
  async (c) => {
    const { page, limit, sortBy = 'score', sortOrder = 'desc' } = c.req.valid('query')

    // Mock campaign data
    const allCampaigns = [
      {
        campaignId: 'campaign-1',
        campaignName: "Mother's Day - Honor Her Story",
        brandName: 'Golden Horn Jewellery',
        reach: 4200,
        engagement: 312,
        ctr: 5.1,
        clicks: 214,
        score: 92,
      },
      {
        campaignId: 'campaign-2',
        campaignName: 'Spring Collection Launch',
        brandName: 'Golden Horn Jewellery',
        reach: 3800,
        engagement: 267,
        ctr: 4.3,
        clicks: 163,
        score: 85,
      },
      {
        campaignId: 'campaign-3',
        campaignName: 'Heritage Collection Awareness',
        brandName: 'Golden Horn Jewellery',
        reach: 2900,
        engagement: 189,
        ctr: 3.8,
        clicks: 110,
        score: 78,
      },
    ]

    // Sort
    const sorted = allCampaigns.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      const aNum = Number(aValue)
      const bNum = Number(bValue)
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum
    })

    // Paginate
    const total = sorted.length
    const start = (page - 1) * limit
    const end = start + limit
    const campaigns = sorted.slice(start, end)

    return c.json({
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  }
)

// GET /api/analytics/campaigns/:id
// Returns single campaign detailed metrics
analyticsRouter.get('/campaigns/:id', async (c) => {
  const id = c.req.param('id')

  // Mock campaign detail
  const data = {
    campaignId: id,
    campaignName: "Mother's Day - Honor Her Story",
    brandName: 'Golden Horn Jewellery',
    reach: 4200,
    engagement: 312,
    ctr: 5.1,
    clicks: 214,
    score: 92,
    creatives: [
      {
        creativeId: 'creative-1',
        creativeName: 'Honor Her Story - IG Story',
        platform: 'Instagram',
        reach: 2100,
        ctr: 5.5,
        score: 94,
      },
      {
        creativeId: 'creative-2',
        creativeName: 'Honor Her Story - FB Feed',
        platform: 'Facebook',
        reach: 2100,
        ctr: 4.7,
        score: 90,
      },
    ],
  }

  return c.json({ data })
})

// GET /api/analytics/creatives
// Returns creative-level metrics with sorting + pagination
analyticsRouter.get(
  '/creatives',
  zValidator(
    'query',
    z.object({
      ...paginationSchema.shape,
      ...sortSchema.shape,
      performanceLabel: z
        .enum(['excellent', 'good', 'average', 'poor', 'critical'])
        .optional(),
    })
  ),
  async (c) => {
    const {
      page,
      limit,
      sortBy = 'score',
      sortOrder = 'desc',
      performanceLabel,
    } = c.req.valid('query')

    // Mock creative data (simplified)
    let allCreatives = [
      {
        creativeId: 'creative-1',
        creativeName: 'Honor Her Story - IG Story',
        campaignName: "Mother's Day",
        platform: 'Instagram',
        reach: 4200,
        ctr: 5.1,
        score: 92,
        performanceLabel: 'excellent',
      },
      {
        creativeId: 'creative-2',
        creativeName: 'Spring Necklace - Feed',
        campaignName: 'Spring Collection',
        platform: 'Instagram',
        reach: 3100,
        ctr: 4.3,
        score: 85,
        performanceLabel: 'excellent',
      },
    ]

    // Filter by performance label
    if (performanceLabel) {
      allCreatives = allCreatives.filter((c) => c.performanceLabel === performanceLabel)
    }

    // Sort and paginate (same logic as campaigns)
    const total = allCreatives.length
    const start = (page - 1) * limit
    const end = start + limit
    const creatives = allCreatives.slice(start, end)

    return c.json({
      data: creatives,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  }
)

// GET /api/analytics/creatives/:id
// Returns single creative full metrics
analyticsRouter.get('/creatives/:id', async (c) => {
  const id = c.req.param('id')

  // Mock creative detail
  const data = {
    creativeId: id,
    creativeName: 'Honor Her Story - IG Story',
    campaignName: "Mother's Day",
    platform: 'Instagram',
    postUrl: 'https://instagram.com/p/abc123',
    publishedAt: new Date('2026-02-25'),
    thumbnailUrl: 'https://placehold.co/400x400/1c1b1b/e6d3c1?text=Story+1',
    reach: 4200,
    impressions: 5800,
    frequency: 1.38,
    likes: 287,
    comments: 23,
    shares: 12,
    saves: 45,
    engagementRate: 8.7,
    clicks: 214,
    ctr: 5.1,
    linkClicks: 189,
    videoViews: 3200,
    avgWatchTime: 8.5,
    completionRate: 72,
    performanceScore: 92,
    performanceLabel: 'excellent',
    aiInsight: 'High engagement driven by emotional storytelling',
    aiSuggestion: 'Repurpose this creative for Facebook Stories',
  }

  return c.json({ data })
})

// GET /api/analytics/compare
// Compare 2 campaigns or creatives
analyticsRouter.get('/compare', zValidator('query', compareSchema), async (c) => {
  const { type, ids } = c.req.valid('query')

  // Mock comparison data
  const data = {
    type,
    entities: ids.map((id) => ({
      id,
      name: type === 'campaign' ? `Campaign ${id}` : `Creative ${id}`,
      reach: Math.floor(2000 + Math.random() * 3000),
      engagement: Math.floor(150 + Math.random() * 200),
      ctr: parseFloat((2 + Math.random() * 4).toFixed(1)),
      score: Math.floor(60 + Math.random() * 30),
    })),
  }

  return c.json({ data })
})

// GET /api/analytics/insights
// Returns AI insights list
analyticsRouter.get('/insights', async (c) => {
  const data = [
    {
      id: 'insight-1',
      type: 'alert',
      title: 'Critical Underperformance Detected',
      description: 'Ancient Craft IG Story has CTR of only 0.3%',
      severity: 'critical',
      createdAt: new Date(),
      isRead: false,
    },
    {
      id: 'insight-2',
      type: 'optimization',
      title: 'High Save Rate Opportunity',
      description: 'Spring Collection has 32% higher save rate',
      severity: 'medium',
      createdAt: new Date(),
      isRead: false,
    },
  ]

  return c.json({ data })
})

// POST /api/analytics/insights/generate
// Generate new AI insights (mock)
analyticsRouter.post('/insights/generate', async (c) => {
  // Mock credit deduction
  const creditCost = 2

  // Mock new insight
  const data = {
    id: `insight-${Date.now()}`,
    type: 'trend',
    title: 'Carousel Format Trending',
    description: 'Carousel posts have 2.1x higher save rate',
    severity: 'medium',
    createdAt: new Date(),
    isRead: false,
    creditCost,
  }

  return c.json({ data })
})

// POST /api/analytics/reports/generate
// Generate report (mock)
analyticsRouter.post(
  '/reports/generate',
  zValidator(
    'json',
    z.object({
      templateId: z.string(),
      format: z.enum(['pdf', 'csv']),
      dateRange: z.object({
        start: z.string(),
        end: z.string(),
      }),
    })
  ),
  async (c) => {
    const { templateId, format, dateRange } = c.req.valid('json')

    // Mock report generation
    const data = {
      id: `report-${Date.now()}`,
      templateId,
      format,
      dateRange,
      generatedAt: new Date(),
      downloadUrl: `/reports/mock-report.${format}`,
    }

    return c.json({ data })
  }
)

// GET /api/analytics/reports
// Returns report history
analyticsRouter.get('/reports', zValidator('query', paginationSchema), async (c) => {
  const { page, limit } = c.req.valid('query')

  const allReports = [
    {
      id: 'report-1',
      templateName: 'Weekly Summary',
      dateRange: {
        start: new Date('2026-02-17'),
        end: new Date('2026-02-24'),
      },
      generatedAt: new Date('2026-02-24T09:00:00'),
      format: 'pdf',
      downloadUrl: '/reports/weekly-2026-02-24.pdf',
    },
  ]

  const total = allReports.length
  const start = (page - 1) * limit
  const end = start + limit
  const reports = allReports.slice(start, end)

  return c.json({
    data: reports,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})
