import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { ApiResponse } from '@repo/types'

// Import mock data (will use DB once schema is ready)
const mockConnectedAccounts = [
  {
    id: '1',
    platform: 'instagram',
    username: 'brandname.official',
    handle: '@brandname.official',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BO',
    status: 'connected',
    lastUsed: new Date().toISOString(),
    connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    platform: 'facebook',
    username: 'Brand Name Page',
    handle: '@brandnamepage',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BP',
    status: 'connected',
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockScheduledPosts = [
  {
    id: '1',
    creativeId: 'cr-1',
    creativeThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    platform: 'instagram',
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    caption: '✨ New collection drop! Link in bio.',
    status: 'scheduled',
  },
]

const mockBestTimes = [
  { platform: 'instagram', time: '10:00', score: 92, reason: 'Highest engagement for lifestyle brands' },
  { platform: 'facebook', time: '12:00', score: 90, reason: 'Peak lunch break browsing' },
  { platform: 'tiktok', time: '18:00', score: 95, reason: 'After-work highest engagement' },
]

export const publishRouter = new Hono()

// Validation schemas
const connectAccountSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'pinterest', 'youtube']),
  code: z.string().optional(), // OAuth code
})

const schedulePostSchema = z.object({
  creativeId: z.string(),
  platforms: z.array(z.string()),
  scheduledFor: z.string(),
  caption: z.string(),
  captions: z.record(z.string()).optional(), // Per-platform captions
  timezone: z.string().default('UTC'),
})

const updateScheduleSchema = z.object({
  scheduledFor: z.string().optional(),
  caption: z.string().optional(),
  status: z.enum(['queued', 'scheduled', 'publishing', 'published', 'failed']).optional(),
})

// GET /api/publish/accounts — List connected accounts
publishRouter.get('/accounts', async (c) => {
  try {
    // TODO: Replace with actual DB query
    // const accounts = await prisma.socialAccount.findMany({
    //   orderBy: { lastUsed: 'desc' },
    // })
    
    return c.json<ApiResponse>({ data: mockConnectedAccounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch accounts' }, 500)
  }
})

// POST /api/publish/accounts/connect — Connect account (mock OAuth)
publishRouter.post(
  '/accounts/connect',
  zValidator('json', connectAccountSchema),
  async (c) => {
    try {
      const { platform } = c.req.valid('json')
      
      // TODO: Real OAuth flow
      // 1. Generate OAuth URL
      // 2. Redirect user
      // 3. Handle callback
      // 4. Store encrypted tokens

      // Mock: Just create a connected account
      const newAccount = {
        id: `${Date.now()}`,
        platform,
        username: `${platform}_user`,
        handle: `@${platform}_user`,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${platform}`,
        status: 'connected',
        lastUsed: new Date().toISOString(),
        connectedAt: new Date().toISOString(),
      }

      return c.json<ApiResponse>({ 
        data: newAccount, 
        message: `${platform} account connected successfully` 
      }, 201)
    } catch (error) {
      console.error('Error connecting account:', error)
      return c.json<ApiResponse>({ error: 'Failed to connect account' }, 500)
    }
  }
)

// DELETE /api/publish/accounts/:id — Disconnect account
publishRouter.delete('/accounts/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // TODO: Delete from DB
    // await prisma.socialAccount.delete({ where: { id } })

    return c.json<ApiResponse>({ message: 'Account disconnected successfully' })
  } catch (error) {
    console.error('Error disconnecting account:', error)
    return c.json<ApiResponse>({ error: 'Failed to disconnect account' }, 500)
  }
})

// POST /api/publish/accounts/:id/test — Test post (mock)
publishRouter.post('/accounts/:id/test', async (c) => {
  try {
    const id = c.req.param('id')
    
    // TODO: Send actual test post to platform
    
    return c.json<ApiResponse>({ 
      message: 'Test post sent successfully',
      data: { postUrl: `https://example.com/test-post-${id}` }
    })
  } catch (error) {
    console.error('Error sending test post:', error)
    return c.json<ApiResponse>({ error: 'Failed to send test post' }, 500)
  }
})

// GET /api/publish/calendar — Get scheduled posts for date range
publishRouter.get('/calendar', async (c) => {
  try {
    const from = c.req.query('from')
    const to = c.req.query('to')
    
    // TODO: Filter by date range from DB
    // const posts = await prisma.scheduledPost.findMany({
    //   where: {
    //     scheduledFor: {
    //       gte: from ? new Date(from) : undefined,
    //       lte: to ? new Date(to) : undefined,
    //     },
    //   },
    //   orderBy: { scheduledFor: 'asc' },
    // })

    return c.json<ApiResponse>({ data: mockScheduledPosts })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch calendar' }, 500)
  }
})

// POST /api/publish/schedule — Schedule post(s)
publishRouter.post(
  '/schedule',
  zValidator('json', schedulePostSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')
      
      // TODO: Create scheduled posts in DB
      // const scheduledPosts = await Promise.all(
      //   body.platforms.map(platform =>
      //     prisma.scheduledPost.create({
      //       data: {
      //         creativeId: body.creativeId,
      //         platform,
      //         scheduledFor: new Date(body.scheduledFor),
      //         caption: body.captions?.[platform] || body.caption,
      //         status: 'scheduled',
      //       },
      //     })
      //   )
      // )

      const creditsUsed = body.platforms.length
      
      return c.json<ApiResponse>({ 
        data: { 
          scheduled: body.platforms.length,
          creditsUsed,
        },
        message: `Scheduled ${body.platforms.length} post(s) for ${body.scheduledFor}` 
      }, 201)
    } catch (error) {
      console.error('Error scheduling posts:', error)
      return c.json<ApiResponse>({ error: 'Failed to schedule posts' }, 500)
    }
  }
)

// GET /api/publish/queue — List queue with filters + pagination
publishRouter.get('/queue', async (c) => {
  try {
    const platform = c.req.query('platform')
    const status = c.req.query('status')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const skip = (page - 1) * limit

    // TODO: Query with filters and pagination
    // const [posts, total] = await Promise.all([
    //   prisma.scheduledPost.findMany({
    //     where: {
    //       platform: platform || undefined,
    //       status: status || undefined,
    //     },
    //     orderBy: { scheduledFor: 'asc' },
    //     skip,
    //     take: limit,
    //   }),
    //   prisma.scheduledPost.count({
    //     where: {
    //       platform: platform || undefined,
    //       status: status || undefined,
    //     },
    //   }),
    // ])

    const filteredPosts = mockScheduledPosts
    const total = filteredPosts.length

    return c.json<ApiResponse>({ 
      data: filteredPosts.slice(skip, skip + limit),
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

// PUT /api/publish/queue/:id — Update scheduled post (reschedule)
publishRouter.put(
  '/queue/:id',
  zValidator('json', updateScheduleSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const updates = c.req.valid('json')
      
      // TODO: Update in DB
      // const updated = await prisma.scheduledPost.update({
      //   where: { id },
      //   data: {
      //     scheduledFor: updates.scheduledFor ? new Date(updates.scheduledFor) : undefined,
      //     caption: updates.caption,
      //     status: updates.status,
      //   },
      // })

      return c.json<ApiResponse>({ 
        message: 'Scheduled post updated successfully',
        data: { id, ...updates },
      })
    } catch (error) {
      console.error('Error updating post:', error)
      return c.json<ApiResponse>({ error: 'Failed to update post' }, 500)
    }
  }
)

// DELETE /api/publish/queue/:id — Cancel scheduled post
publishRouter.delete('/queue/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // TODO: Delete from DB or mark as cancelled
    // await prisma.scheduledPost.delete({ where: { id } })

    return c.json<ApiResponse>({ message: 'Scheduled post cancelled' })
  } catch (error) {
    console.error('Error cancelling post:', error)
    return c.json<ApiResponse>({ error: 'Failed to cancel post' }, 500)
  }
})

// POST /api/publish/queue/:id/retry — Retry failed post
publishRouter.post('/queue/:id/retry', async (c) => {
  try {
    const id = c.req.param('id')
    
    // TODO: Retry publishing
    // await prisma.scheduledPost.update({
    //   where: { id },
    //   data: { status: 'queued' },
    // })
    // Queue publishing job

    return c.json<ApiResponse>({ message: 'Post queued for retry' })
  } catch (error) {
    console.error('Error retrying post:', error)
    return c.json<ApiResponse>({ error: 'Failed to retry post' }, 500)
  }
})

// GET /api/publish/best-time — AI best time suggestion (mock)
publishRouter.get('/best-time', async (c) => {
  try {
    const platform = c.req.query('platform')
    
    // TODO: Real AI analysis based on:
    // - Historical engagement data
    // - Industry benchmarks
    // - Audience timezone
    // - Day of week patterns

    const suggestions = platform 
      ? mockBestTimes.filter(t => t.platform === platform)
      : mockBestTimes

    return c.json<ApiResponse>({ data: suggestions })
  } catch (error) {
    console.error('Error fetching best times:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch best times' }, 500)
  }
})
