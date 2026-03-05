import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import { generateBestPostingTimes } from '../lib/openai'
import { publishToSocial, fetchPostMetrics } from '../lib/social/publisher'

export const publishRouter = new Hono()

// Validation schemas
const connectAccountSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'pinterest', 'youtube']),
  brandId: z.string().min(1),
  accountId: z.string().min(1),
  accountName: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
})

const schedulePostSchema = z.object({
  creativeId: z.string(),
  campaignId: z.string(),
  accountId: z.string(),
  scheduledAt: z.string(),
  caption: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
})

const updateScheduleSchema = z.object({
  scheduledAt: z.string().optional(),
  caption: z.string().optional(),
  status: z.enum(['PENDING', 'QUEUED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED']).optional(),
})

// GET /api/publish/accounts - List connected accounts
publishRouter.get('/accounts', async (c) => {
  try {
    const brandId = c.req.query('brandId')

    const accounts = await prisma.socialAccount.findMany({
      where: brandId ? { brandId, isActive: true } : { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return c.json<ApiResponse>({ data: accounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch accounts' }, 500)
  }
})

// POST /api/publish/accounts/connect - Connect account
publishRouter.post(
  '/accounts/connect',
  zValidator('json', connectAccountSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      const account = await prisma.socialAccount.upsert({
        where: {
          brandId_platform_accountId: {
            brandId: body.brandId,
            platform: body.platform,
            accountId: body.accountId,
          },
        },
        update: {
          accountName: body.accountName,
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
          isActive: true,
        },
        create: {
          brandId: body.brandId,
          platform: body.platform,
          accountId: body.accountId,
          accountName: body.accountName,
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
        },
      })

      return c.json<ApiResponse>({
        data: account,
        message: `${body.platform} account connected successfully`,
      }, 201)
    } catch (error) {
      console.error('Error connecting account:', error)
      return c.json<ApiResponse>({ error: 'Failed to connect account' }, 500)
    }
  }
)

// DELETE /api/publish/accounts/:id - Disconnect account
publishRouter.delete('/accounts/:id', async (c) => {
  try {
    const id = c.req.param('id')

    await prisma.socialAccount.update({
      where: { id },
      data: { isActive: false },
    })

    return c.json<ApiResponse>({ message: 'Account disconnected successfully' })
  } catch (error) {
    console.error('Error disconnecting account:', error)
    return c.json<ApiResponse>({ error: 'Failed to disconnect account' }, 500)
  }
})

// POST /api/publish/accounts/:id/test - Send test post to verify connection
publishRouter.post('/accounts/:id/test', async (c) => {
  try {
    const id = c.req.param('id')

    const account = await prisma.socialAccount.findUnique({ where: { id } })
    if (!account) {
      return c.json<ApiResponse>({ error: 'Account not found' }, 404)
    }

    const { getSocialClient } = await import('../lib/social')
    const client = getSocialClient(account.platform)
    if (!client) {
      return c.json<ApiResponse>({ error: `Unsupported platform: ${account.platform}` }, 400)
    }

    const result = await client.publish(
      { accessToken: account.accessToken, refreshToken: account.refreshToken || undefined },
      {
        imageUrl: 'https://placehold.co/1080x1080/1c1b1b/e6d3c1?text=Coff+Test+Post',
        caption: 'Test post from Coff Campaign Engine. This post will be deleted shortly.',
      }
    )

    if (result.success && result.postId) {
      // Delete the test post after a short delay
      setTimeout(async () => {
        try {
          await client.deletePost(
            { accessToken: account.accessToken },
            result.postId!
          )
        } catch {
          // Test post cleanup is best-effort
        }
      }, 5000)
    }

    return c.json<ApiResponse>({
      message: result.success ? 'Test post sent successfully' : 'Test post failed',
      data: { success: result.success, postUrl: result.postUrl, error: result.error },
    })
  } catch (error) {
    console.error('Error sending test post:', error)
    return c.json<ApiResponse>({ error: 'Failed to send test post' }, 500)
  }
})

// GET /api/publish/calendar - Get scheduled posts for date range
publishRouter.get('/calendar', async (c) => {
  try {
    const from = c.req.query('from')
    const to = c.req.query('to')

    const schedules = await prisma.publishSchedule.findMany({
      where: {
        scheduledAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      },
      include: {
        account: { select: { platform: true, accountName: true } },
        campaign: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    })

    return c.json<ApiResponse>({ data: schedules })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch calendar' }, 500)
  }
})

// POST /api/publish/schedule - Schedule a post
publishRouter.post(
  '/schedule',
  zValidator('json', schedulePostSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      const schedule = await prisma.publishSchedule.create({
        data: {
          creativeId: body.creativeId,
          campaignId: body.campaignId,
          accountId: body.accountId,
          scheduledAt: new Date(body.scheduledAt),
          caption: body.caption,
          hashtags: body.hashtags || [],
        },
        include: {
          account: { select: { platform: true, accountName: true } },
        },
      })

      return c.json<ApiResponse>({
        data: schedule,
        message: `Post scheduled for ${body.scheduledAt}`,
      }, 201)
    } catch (error) {
      console.error('Error scheduling post:', error)
      return c.json<ApiResponse>({ error: 'Failed to schedule post' }, 500)
    }
  }
)

// GET /api/publish/queue - List queue with filters + pagination
publishRouter.get('/queue', async (c) => {
  try {
    const status = c.req.query('status')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const skip = (page - 1) * limit

    const where = {
      ...(status && { status: status as any }),
    }

    const [schedules, total] = await Promise.all([
      prisma.publishSchedule.findMany({
        where,
        include: {
          account: { select: { platform: true, accountName: true } },
          campaign: { select: { id: true, name: true } },
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.publishSchedule.count({ where }),
    ])

    return c.json<ApiResponse>({
      data: schedules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching queue:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch queue' }, 500)
  }
})

// PUT /api/publish/queue/:id - Update scheduled post
publishRouter.put(
  '/queue/:id',
  zValidator('json', updateScheduleSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const updates = c.req.valid('json')

      const schedule = await prisma.publishSchedule.update({
        where: { id },
        data: {
          ...(updates.scheduledAt && { scheduledAt: new Date(updates.scheduledAt) }),
          ...(updates.caption !== undefined && { caption: updates.caption }),
          ...(updates.status && { status: updates.status as any }),
        },
      })

      return c.json<ApiResponse>({
        data: schedule,
        message: 'Scheduled post updated successfully',
      })
    } catch (error) {
      console.error('Error updating post:', error)
      return c.json<ApiResponse>({ error: 'Failed to update post' }, 500)
    }
  }
)

// DELETE /api/publish/queue/:id - Cancel scheduled post
publishRouter.delete('/queue/:id', async (c) => {
  try {
    const id = c.req.param('id')

    await prisma.publishSchedule.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return c.json<ApiResponse>({ message: 'Scheduled post cancelled' })
  } catch (error) {
    console.error('Error cancelling post:', error)
    return c.json<ApiResponse>({ error: 'Failed to cancel post' }, 500)
  }
})

// POST /api/publish/queue/:id/retry - Retry failed post
publishRouter.post('/queue/:id/retry', async (c) => {
  try {
    const id = c.req.param('id')

    const schedule = await prisma.publishSchedule.update({
      where: { id },
      data: { status: 'QUEUED', retryCount: { increment: 1 }, error: null },
    })

    // Attempt to publish
    const result = await publishToSocial(id)

    return c.json<ApiResponse>({
      data: { schedule, publishResult: result },
      message: result.success ? 'Post published successfully' : 'Post queued for retry',
    })
  } catch (error) {
    console.error('Error retrying post:', error)
    return c.json<ApiResponse>({ error: 'Failed to retry post' }, 500)
  }
})

// POST /api/publish/queue/:id/publish-now - Immediately publish a scheduled post
publishRouter.post('/queue/:id/publish-now', async (c) => {
  try {
    const id = c.req.param('id')

    const schedule = await prisma.publishSchedule.findUnique({ where: { id } })
    if (!schedule) {
      return c.json<ApiResponse>({ error: 'Schedule not found' }, 404)
    }

    if (schedule.status === 'PUBLISHED') {
      return c.json<ApiResponse>({ error: 'Already published' }, 400)
    }

    const result = await publishToSocial(id)

    return c.json<ApiResponse>({
      data: result,
      message: result.success ? 'Published successfully' : `Publishing failed: ${result.error}`,
    })
  } catch (error) {
    console.error('Error publishing now:', error)
    return c.json<ApiResponse>({ error: 'Failed to publish' }, 500)
  }
})

// POST /api/publish/fetch-metrics/:creativeId - Fetch latest metrics from platform
publishRouter.post('/fetch-metrics/:creativeId', async (c) => {
  try {
    const creativeId = c.req.param('creativeId')
    await fetchPostMetrics(creativeId)
    return c.json<ApiResponse>({ message: 'Metrics fetched successfully' })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch metrics' }, 500)
  }
})

// GET /api/publish/best-time - AI best time suggestion based on historical data
publishRouter.get('/best-time', async (c) => {
  try {
    const platform = c.req.query('platform') || 'instagram'

    // Fetch historical engagement data grouped by hour
    const performances = await prisma.creativePerformance.findMany({
      where: {
        creative: { platform },
        recordedAt: { gte: new Date(Date.now() - 90 * 86400000) },
      },
      select: { recordedAt: true, likes: true, comments: true, shares: true, saves: true },
    })

    const hourlyData: { hour: number; engagement: number }[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      engagement: 0,
    }))

    for (const p of performances) {
      const hour = new Date(p.recordedAt).getHours()
      hourlyData[hour]!.engagement += p.likes + p.comments + p.shares + p.saves
    }

    const suggestions = await generateBestPostingTimes(platform, hourlyData)

    return c.json<ApiResponse>({
      data: suggestions.map((s) => ({ ...s, platform })),
    })
  } catch (error) {
    console.error('Error fetching best times:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch best times' }, 500)
  }
})
