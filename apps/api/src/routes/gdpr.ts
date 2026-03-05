import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const gdprRouter = new Hono()

// GET /api/gdpr/export/:userId - Export all user data (GDPR Article 20)
gdprRouter.get('/export/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        brands: {
          include: {
            campaigns: {
              include: {
                creatives: {
                  select: {
                    id: true,
                    platform: true,
                    format: true,
                    imageUrl: true,
                    createdAt: true,
                  },
                },
              },
            },
            socialAccounts: {
              select: {
                id: true,
                platform: true,
                accountName: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return c.json<ApiResponse>({ error: 'User not found' }, 404)
    }

    // Get activity logs
    const activity = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // Get comments
    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      brands: user.brands.map((b) => ({
        id: b.id,
        name: b.name,
        url: b.url,
        industry: b.industry,
        createdAt: b.createdAt,
        campaigns: b.campaigns.map((c) => ({
          id: c.id,
          name: c.name,
          objective: c.objective,
          status: c.status,
          platforms: c.platforms,
          creativeCount: c.creatives.length,
          createdAt: c.createdAt,
        })),
        socialAccounts: b.socialAccounts,
      })),
      activity: activity.map((a) => ({
        action: a.action,
        entityType: a.entityType,
        entityId: a.entityId,
        createdAt: a.createdAt,
      })),
      comments: comments.map((c) => ({
        id: c.id,
        entityType: c.entityType,
        content: c.content,
        createdAt: c.createdAt,
      })),
    }

    c.header('Content-Disposition', `attachment; filename="coff-data-export-${userId}.json"`)
    c.header('Content-Type', 'application/json')

    return c.json<ApiResponse>({ data: exportData })
  } catch (error) {
    console.error('Error exporting user data:', error)
    return c.json<ApiResponse>({ error: 'Failed to export data' }, 500)
  }
})

// DELETE /api/gdpr/delete/:userId - Delete all user data (GDPR Article 17)
gdprRouter.delete('/delete/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const confirm = c.req.query('confirm')

    if (confirm !== 'true') {
      return c.json<ApiResponse>({
        error: 'Add ?confirm=true to permanently delete all user data',
      }, 400)
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return c.json<ApiResponse>({ error: 'User not found' }, 404)
    }

    // Delete in order to respect foreign key constraints
    // Brands cascade-delete campaigns, creatives, social accounts, etc.
    await prisma.$transaction([
      prisma.activityLog.deleteMany({ where: { userId } }),
      prisma.comment.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    return c.json<ApiResponse>({
      message: 'All user data has been permanently deleted',
      data: { userId, deletedAt: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Error deleting user data:', error)
    return c.json<ApiResponse>({ error: 'Failed to delete user data' }, 500)
  }
})

// GET /api/gdpr/consent/:userId - Get consent status
gdprRouter.get('/consent/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    })

    if (!user) {
      return c.json<ApiResponse>({ error: 'User not found' }, 404)
    }

    return c.json<ApiResponse>({
      data: {
        userId: user.id,
        dataProcessing: true,
        analytics: true,
        marketing: false,
        consentDate: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Error fetching consent:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch consent' }, 500)
  }
})
