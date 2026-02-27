import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const publishRouter = new Hono()

// GET /api/publish/accounts - List connected accounts
publishRouter.get('/accounts', async (c) => {
  try {
    const brandId = c.req.query('brandId')
    const accounts = await prisma.socialAccount.findMany({
      where: brandId ? { brandId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return c.json<ApiResponse>({ data: accounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch accounts' }, 500)
  }
})

// POST /api/publish/accounts - Connect new account
publishRouter.post('/accounts', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: OAuth flow for platform
    // TODO: Store encrypted tokens

    return c.json<ApiResponse>({ message: 'Account connection started' })
  } catch (error) {
    console.error('Error connecting account:', error)
    return c.json<ApiResponse>({ error: 'Failed to connect account' }, 500)
  }
})

// GET /api/publish/schedule - List scheduled posts
publishRouter.get('/schedule', async (c) => {
  try {
    const campaignId = c.req.query('campaignId')
    const schedules = await prisma.publishSchedule.findMany({
      where: campaignId ? { campaignId } : undefined,
      include: { account: true },
      orderBy: { scheduledAt: 'asc' },
    })
    return c.json<ApiResponse>({ data: schedules })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch schedules' }, 500)
  }
})

// POST /api/publish/schedule - Schedule post
publishRouter.post('/schedule', async (c) => {
  try {
    const body = await c.req.json()

    const schedule = await prisma.publishSchedule.create({
      data: {
        creativeId: body.creativeId,
        campaignId: body.campaignId,
        accountId: body.accountId,
        scheduledAt: new Date(body.scheduledAt),
        caption: body.caption,
        hashtags: body.hashtags || [],
      },
    })

    return c.json<ApiResponse>({ data: schedule, message: 'Post scheduled' }, 201)
  } catch (error) {
    console.error('Error scheduling post:', error)
    return c.json<ApiResponse>({ error: 'Failed to schedule post' }, 500)
  }
})

// POST /api/publish/now - Publish immediately
publishRouter.post('/now', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: Queue immediate publishing job
    // TODO: Call platform API

    return c.json<ApiResponse>({ message: 'Publishing queued' })
  } catch (error) {
    console.error('Error publishing:', error)
    return c.json<ApiResponse>({ error: 'Failed to publish' }, 500)
  }
})
