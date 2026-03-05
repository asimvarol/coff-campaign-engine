import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import { generateInsights } from '../lib/openai'

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

function getDateRange(period: string = '30d', start?: string, end?: string) {
  if (start && end) {
    return { gte: new Date(start), lte: new Date(end) }
  }
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const now = new Date()
  return {
    gte: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
    lte: now,
  }
}

// GET /api/analytics/overview - KPI stats + trends
analyticsRouter.get('/overview', zValidator('query', dateRangeSchema), async (c) => {
  const { period = '30d', start, end } = c.req.valid('query')
  const dateRange = getDateRange(period, start, end)

  try {
    const metrics = await prisma.creativePerformance.aggregate({
      where: { recordedAt: dateRange },
      _sum: {
        reach: true,
        impressions: true,
        likes: true,
        comments: true,
        shares: true,
        saves: true,
        clicks: true,
      },
      _avg: {
        engagementRate: true,
        ctr: true,
      },
    })

    const totalEngagement =
      (metrics._sum.likes || 0) +
      (metrics._sum.comments || 0) +
      (metrics._sum.shares || 0) +
      (metrics._sum.saves || 0)

    // Calculate change vs previous period
    const dayCount = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const prevRange = {
      gte: new Date(dateRange.gte.getTime() - dayCount * 24 * 60 * 60 * 1000),
      lte: dateRange.gte,
    }
    const prevMetrics = await prisma.creativePerformance.aggregate({
      where: { recordedAt: prevRange },
      _sum: { reach: true, likes: true, comments: true, shares: true, saves: true, clicks: true },
      _avg: { ctr: true },
    })

    const prevEngagement =
      (prevMetrics._sum.likes || 0) +
      (prevMetrics._sum.comments || 0) +
      (prevMetrics._sum.shares || 0) +
      (prevMetrics._sum.saves || 0)

    const pctChange = (curr: number, prev: number) =>
      prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100)

    return c.json<ApiResponse>({
      data: {
        totalReach: metrics._sum.reach || 0,
        totalReachChange: pctChange(metrics._sum.reach || 0, prevMetrics._sum.reach || 0),
        totalEngagement,
        totalEngagementChange: pctChange(totalEngagement, prevEngagement),
        avgCtr: Math.round((metrics._avg.ctr || 0) * 10) / 10,
        avgCtrChange: pctChange(metrics._avg.ctr || 0, prevMetrics._avg.ctr || 0),
        totalClicks: metrics._sum.clicks || 0,
        totalClicksChange: pctChange(metrics._sum.clicks || 0, prevMetrics._sum.clicks || 0),
        totalSaves: metrics._sum.saves || 0,
        totalSavesChange: pctChange(metrics._sum.saves || 0, prevMetrics._sum.saves || 0),
        period,
      },
    })
  } catch (error) {
    console.error('Error fetching overview:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch analytics overview' }, 500)
  }
})

// GET /api/analytics/reach-trend - Time series data
analyticsRouter.get('/reach-trend', zValidator('query', dateRangeSchema), async (c) => {
  const { period = '30d', start, end } = c.req.valid('query')
  const dateRange = getDateRange(period, start, end)

  try {
    const records = await prisma.creativePerformance.findMany({
      where: { recordedAt: dateRange },
      select: { recordedAt: true, reach: true, likes: true, comments: true, shares: true, saves: true, clicks: true },
      orderBy: { recordedAt: 'asc' },
    })

    // Group by day
    const byDay = new Map<string, { reach: number; engagement: number; clicks: number }>()
    for (const r of records) {
      const day = r.recordedAt.toISOString().split('T')[0]
      const existing = byDay.get(day) || { reach: 0, engagement: 0, clicks: 0 }
      existing.reach += r.reach
      existing.engagement += r.likes + r.comments + r.shares + r.saves
      existing.clicks += r.clicks
      byDay.set(day, existing)
    }

    const data = Array.from(byDay.entries()).map(([date, vals]) => ({ date, ...vals }))

    return c.json<ApiResponse>({ data })
  } catch (error) {
    console.error('Error fetching reach trend:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch reach trend' }, 500)
  }
})

// GET /api/analytics/platform-breakdown - Per-platform metrics
analyticsRouter.get('/platform-breakdown', zValidator('query', dateRangeSchema), async (c) => {
  const { period = '30d', start, end } = c.req.valid('query')
  const dateRange = getDateRange(period, start, end)

  try {
    const creatives = await prisma.creative.findMany({
      where: {
        performance: { some: { recordedAt: dateRange } },
      },
      select: {
        platform: true,
        performance: {
          where: { recordedAt: dateRange },
          select: { reach: true, likes: true, comments: true, shares: true, saves: true, clicks: true },
        },
      },
    })

    // Aggregate by platform
    const platformMap = new Map<string, { reach: number; engagement: number; clicks: number }>()
    for (const cr of creatives) {
      const existing = platformMap.get(cr.platform) || { reach: 0, engagement: 0, clicks: 0 }
      for (const p of cr.performance) {
        existing.reach += p.reach
        existing.engagement += p.likes + p.comments + p.shares + p.saves
        existing.clicks += p.clicks
      }
      platformMap.set(cr.platform, existing)
    }

    const totalReach = Array.from(platformMap.values()).reduce((sum, v) => sum + v.reach, 0)

    const data = Array.from(platformMap.entries()).map(([platform, vals]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      ...vals,
      percentage: totalReach > 0 ? Math.round((vals.reach / totalReach) * 100) : 0,
    }))

    return c.json<ApiResponse>({ data })
  } catch (error) {
    console.error('Error fetching platform breakdown:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch platform breakdown' }, 500)
  }
})

// GET /api/analytics/campaigns - Campaign-level metrics
analyticsRouter.get(
  '/campaigns',
  zValidator('query', z.object({ ...paginationSchema.shape, ...sortSchema.shape })),
  async (c) => {
    const { page, limit, sortBy = 'score', sortOrder = 'desc' } = c.req.valid('query')

    try {
      const campaigns = await prisma.campaign.findMany({
        include: {
          brand: { select: { name: true } },
          creatives: {
            include: {
              performance: {
                orderBy: { recordedAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      })

      // Compute metrics per campaign
      const campaignMetrics = campaigns.map((camp) => {
        let reach = 0, engagement = 0, clicks = 0, totalCtr = 0, totalScore = 0, count = 0
        for (const cr of camp.creatives) {
          if (cr.performance.length > 0) {
            const p = cr.performance[0]
            reach += p.reach
            engagement += p.likes + p.comments + p.shares + p.saves
            clicks += p.clicks
            totalCtr += p.ctr || 0
            totalScore += cr.performanceScore || 0
            count++
          }
        }
        return {
          campaignId: camp.id,
          campaignName: camp.name,
          brandName: camp.brand.name,
          reach,
          engagement,
          ctr: count > 0 ? Math.round((totalCtr / count) * 10) / 10 : 0,
          clicks,
          score: count > 0 ? Math.round(totalScore / count) : 0,
        }
      })

      // Sort
      campaignMetrics.sort((a, b) => {
        const key = sortBy as keyof typeof a
        const aVal = a[key] ?? 0
        const bVal = b[key] ?? 0
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
      })

      const total = campaignMetrics.length
      const start = (page - 1) * limit
      const paged = campaignMetrics.slice(start, start + limit)

      return c.json<ApiResponse>({
        data: paged,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    } catch (error) {
      console.error('Error fetching campaign analytics:', error)
      return c.json<ApiResponse>({ error: 'Failed to fetch campaign analytics' }, 500)
    }
  }
)

// GET /api/analytics/campaigns/:id - Single campaign detailed metrics
analyticsRouter.get('/campaigns/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: { select: { name: true } },
        creatives: {
          include: {
            performance: { orderBy: { recordedAt: 'desc' }, take: 1 },
          },
        },
      },
    })

    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found' }, 404)
    }

    let reach = 0, engagement = 0, clicks = 0, totalCtr = 0, totalScore = 0, count = 0
    const creativeMetrics = campaign.creatives.map((cr) => {
      const p = cr.performance[0]
      const crReach = p?.reach || 0
      const crCtr = p?.ctr || 0
      const crScore = cr.performanceScore || 0
      reach += crReach
      engagement += (p?.likes || 0) + (p?.comments || 0) + (p?.shares || 0) + (p?.saves || 0)
      clicks += p?.clicks || 0
      totalCtr += crCtr
      totalScore += crScore
      if (p) count++
      return {
        creativeId: cr.id,
        platform: cr.platform,
        format: cr.format,
        reach: crReach,
        ctr: crCtr,
        score: crScore,
      }
    })

    return c.json<ApiResponse>({
      data: {
        campaignId: campaign.id,
        campaignName: campaign.name,
        brandName: campaign.brand.name,
        reach,
        engagement,
        ctr: count > 0 ? Math.round((totalCtr / count) * 10) / 10 : 0,
        clicks,
        score: count > 0 ? Math.round(totalScore / count) : 0,
        creatives: creativeMetrics,
      },
    })
  } catch (error) {
    console.error('Error fetching campaign detail:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch campaign detail' }, 500)
  }
})

// GET /api/analytics/creatives - Creative-level metrics
analyticsRouter.get(
  '/creatives',
  zValidator(
    'query',
    z.object({
      ...paginationSchema.shape,
      ...sortSchema.shape,
      performanceLabel: z.enum(['excellent', 'good', 'average', 'poor', 'critical']).optional(),
    })
  ),
  async (c) => {
    const { page, limit, sortBy = 'score', sortOrder = 'desc', performanceLabel } = c.req.valid('query')

    try {
      const creatives = await prisma.creative.findMany({
        include: {
          campaign: { select: { name: true } },
          performance: { orderBy: { recordedAt: 'desc' }, take: 1 },
        },
      })

      let metrics = creatives.map((cr) => {
        const p = cr.performance[0]
        const score = cr.performanceScore || 0
        const label = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 50 ? 'average' : score >= 25 ? 'poor' : 'critical'
        return {
          creativeId: cr.id,
          platform: cr.platform,
          format: cr.format,
          campaignName: cr.campaign.name,
          reach: p?.reach || 0,
          ctr: p?.ctr || 0,
          score,
          performanceLabel: label,
        }
      })

      if (performanceLabel) {
        metrics = metrics.filter((m) => m.performanceLabel === performanceLabel)
      }

      metrics.sort((a, b) => {
        const key = sortBy as keyof typeof a
        const aVal = a[key] ?? 0
        const bVal = b[key] ?? 0
        return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
      })

      const total = metrics.length
      const start = (page - 1) * limit
      const paged = metrics.slice(start, start + limit)

      return c.json<ApiResponse>({
        data: paged,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    } catch (error) {
      console.error('Error fetching creative analytics:', error)
      return c.json<ApiResponse>({ error: 'Failed to fetch creative analytics' }, 500)
    }
  }
)

// GET /api/analytics/creatives/:id - Single creative full metrics
analyticsRouter.get('/creatives/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const creative = await prisma.creative.findUnique({
      where: { id },
      include: {
        campaign: { select: { name: true } },
        performance: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    })

    if (!creative) {
      return c.json<ApiResponse>({ error: 'Creative not found' }, 404)
    }

    const p = creative.performance[0]
    const score = creative.performanceScore || 0
    const label = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 50 ? 'average' : score >= 25 ? 'poor' : 'critical'

    return c.json<ApiResponse>({
      data: {
        creativeId: creative.id,
        campaignName: creative.campaign.name,
        platform: creative.platform,
        format: creative.format,
        imageUrl: creative.imageUrl,
        publishedAt: creative.publishedAt,
        postUrl: creative.postUrl,
        reach: p?.reach || 0,
        impressions: p?.impressions || 0,
        likes: p?.likes || 0,
        comments: p?.comments || 0,
        shares: p?.shares || 0,
        saves: p?.saves || 0,
        engagementRate: p?.engagementRate || 0,
        clicks: p?.clicks || 0,
        ctr: p?.ctr || 0,
        videoViews: p?.videoViews,
        avgWatchTime: p?.avgWatchTime,
        spend: p?.spend,
        cpc: p?.cpc,
        cpm: p?.cpm,
        roas: p?.roas,
        performanceScore: score,
        performanceLabel: label,
      },
    })
  } catch (error) {
    console.error('Error fetching creative detail:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch creative detail' }, 500)
  }
})

// GET /api/analytics/compare - Compare 2 campaigns or creatives
analyticsRouter.get('/compare', zValidator('query', compareSchema), async (c) => {
  const { type, ids } = c.req.valid('query')

  try {
    if (type === 'campaign') {
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: ids } },
        include: {
          creatives: {
            include: { performance: { orderBy: { recordedAt: 'desc' }, take: 1 } },
          },
        },
      })

      const entities = campaigns.map((camp) => {
        let reach = 0, engagement = 0, totalCtr = 0, totalScore = 0, count = 0
        for (const cr of camp.creatives) {
          if (cr.performance.length > 0) {
            const p = cr.performance[0]
            reach += p.reach
            engagement += p.likes + p.comments + p.shares + p.saves
            totalCtr += p.ctr || 0
            totalScore += cr.performanceScore || 0
            count++
          }
        }
        return {
          id: camp.id,
          name: camp.name,
          reach,
          engagement,
          ctr: count > 0 ? Math.round((totalCtr / count) * 10) / 10 : 0,
          score: count > 0 ? Math.round(totalScore / count) : 0,
        }
      })

      return c.json<ApiResponse>({ data: { type, entities } })
    }

    // Creative comparison
    const creatives = await prisma.creative.findMany({
      where: { id: { in: ids } },
      include: { performance: { orderBy: { recordedAt: 'desc' }, take: 1 } },
    })

    const entities = creatives.map((cr) => {
      const p = cr.performance[0]
      return {
        id: cr.id,
        name: `${cr.platform} ${cr.format}`,
        reach: p?.reach || 0,
        engagement: (p?.likes || 0) + (p?.comments || 0) + (p?.shares || 0) + (p?.saves || 0),
        ctr: p?.ctr || 0,
        score: cr.performanceScore || 0,
      }
    })

    return c.json<ApiResponse>({ data: { type, entities } })
  } catch (error) {
    console.error('Error comparing:', error)
    return c.json<ApiResponse>({ error: 'Failed to compare' }, 500)
  }
})

// GET /api/analytics/insights - AI-generated insights from performance data
analyticsRouter.get('/insights', async (c) => {
  try {
    const period = c.req.query('period') || '30d'

    const daysBack = period === '7d' ? 7 : period === '90d' ? 90 : 30
    const since = new Date()
    since.setDate(since.getDate() - daysBack)

    const performances = await prisma.creativePerformance.findMany({
      where: { recordedAt: { gte: since } },
      include: { creative: { select: { platform: true } } },
    })

    if (performances.length === 0) {
      return c.json<ApiResponse>({ data: [] })
    }

    let totalReach = 0
    let totalEngagement = 0
    let totalCtr = 0
    const platformReach: Record<string, number> = {}

    for (const p of performances) {
      totalReach += p.reach
      totalEngagement += p.likes + p.comments + p.shares + p.saves
      totalCtr += p.ctr || 0
      const plat = p.creative.platform
      platformReach[plat] = (platformReach[plat] || 0) + p.reach
    }

    const topPlatform = Object.entries(platformReach).sort((a, b) => b[1] - a[1])[0]?.[0] || 'instagram'
    const avgCtr = Math.round((totalCtr / performances.length) * 10) / 10
    const campaignCount = await prisma.campaign.count({ where: { status: { not: 'DRAFT' } } })

    const insights = await generateInsights({
      totalReach,
      totalEngagement,
      avgCtr,
      topPlatform,
      campaignCount,
      period,
    })

    return c.json<ApiResponse>({ data: insights })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch insights' }, 500)
  }
})

// POST /api/analytics/insights/generate - Force regenerate AI insights
analyticsRouter.post('/insights/generate', async (c) => {
  try {
    const performances = await prisma.creativePerformance.findMany({
      where: { recordedAt: { gte: new Date(Date.now() - 30 * 86400000) } },
      include: { creative: { select: { platform: true } } },
    })

    let totalReach = 0
    let totalEngagement = 0
    let totalCtr = 0
    const platformReach: Record<string, number> = {}

    for (const p of performances) {
      totalReach += p.reach
      totalEngagement += p.likes + p.comments + p.shares + p.saves
      totalCtr += p.ctr || 0
      const plat = p.creative.platform
      platformReach[plat] = (platformReach[plat] || 0) + p.reach
    }

    const topPlatform = Object.entries(platformReach).sort((a, b) => b[1] - a[1])[0]?.[0] || 'instagram'
    const avgCtr = performances.length > 0 ? Math.round((totalCtr / performances.length) * 10) / 10 : 0
    const campaignCount = await prisma.campaign.count({ where: { status: { not: 'DRAFT' } } })

    const insights = await generateInsights({
      totalReach,
      totalEngagement,
      avgCtr,
      topPlatform,
      campaignCount,
      period: '30d',
    })

    return c.json<ApiResponse>({
      data: insights,
      message: 'Insights generated successfully',
    })
  } catch (error) {
    console.error('Error generating insights:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate insights' }, 500)
  }
})

// POST /api/analytics/reports/generate - Generate report (placeholder)
analyticsRouter.post(
  '/reports/generate',
  zValidator(
    'json',
    z.object({
      templateId: z.string(),
      format: z.enum(['pdf', 'csv']),
      dateRange: z.object({ start: z.string(), end: z.string() }),
    })
  ),
  async (c) => {
    const { templateId, format, dateRange } = c.req.valid('json')

    return c.json<ApiResponse>({
      data: {
        id: `report-${Date.now()}`,
        templateId,
        format,
        dateRange,
        generatedAt: new Date(),
        downloadUrl: null,
      },
      message: 'Report generation queued',
    })
  }
)

// GET /api/analytics/reports - Report history (placeholder)
analyticsRouter.get('/reports', zValidator('query', paginationSchema), async (c) => {
  const { page, limit } = c.req.valid('query')

  return c.json<ApiResponse>({
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
  })
})
