import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const activityRouter = new Hono()

// GET /api/activity - List activity log with filters
activityRouter.get('/', async (c) => {
  try {
    const userId = c.req.query('userId')
    const entityType = c.req.query('entityType')
    const entityId = c.req.query('entityId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100)
    const skip = (page - 1) * limit

    const where = {
      ...(userId && { userId }),
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ])

    return c.json<ApiResponse>({
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch activity' }, 500)
  }
})

// GET /api/activity/recent - Recent activity across all entities
activityRouter.get('/recent', async (c) => {
  try {
    const hours = parseInt(c.req.query('hours') || '24')
    const since = new Date(Date.now() - hours * 3600000)

    const logs = await prisma.activityLog.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return c.json<ApiResponse>({ data: logs })
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch recent activity' }, 500)
  }
})
