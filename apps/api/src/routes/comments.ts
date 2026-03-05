import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const commentsRouter = new Hono()

const createCommentSchema = z.object({
  userId: z.string().min(1),
  entityType: z.enum(['campaign', 'creative', 'photoshoot']),
  entityId: z.string().min(1),
  content: z.string().min(1).max(5000),
  parentId: z.string().optional(),
  mentions: z.array(z.string()).optional(),
})

const updateCommentSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  resolved: z.boolean().optional(),
  resolvedBy: z.string().optional(),
})

// GET /api/comments - List comments for an entity
commentsRouter.get('/', async (c) => {
  try {
    const entityType = c.req.query('entityType')
    const entityId = c.req.query('entityId')

    if (!entityType || !entityId) {
      return c.json<ApiResponse>({ error: 'entityType and entityId are required' }, 400)
    }

    const comments = await prisma.comment.findMany({
      where: {
        entityType,
        entityId,
        parentId: null, // Top-level only
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return c.json<ApiResponse>({ data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch comments' }, 500)
  }
})

// POST /api/comments - Create comment
commentsRouter.post(
  '/',
  zValidator('json', createCommentSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      const comment = await prisma.comment.create({
        data: {
          userId: body.userId,
          entityType: body.entityType,
          entityId: body.entityId,
          content: body.content,
          parentId: body.parentId,
          mentions: body.mentions || [],
        },
        include: {
          replies: true,
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: body.userId,
          action: 'commented',
          entityType: body.entityType,
          entityId: body.entityId,
          metadata: { commentId: comment.id, isReply: !!body.parentId },
        },
      })

      return c.json<ApiResponse>({
        data: comment,
        message: 'Comment added',
      }, 201)
    } catch (error) {
      console.error('Error creating comment:', error)
      return c.json<ApiResponse>({ error: 'Failed to create comment' }, 500)
    }
  }
)

// PUT /api/comments/:id - Update comment
commentsRouter.put(
  '/:id',
  zValidator('json', updateCommentSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const body = c.req.valid('json')

      const existing = await prisma.comment.findUnique({ where: { id } })
      if (!existing) {
        return c.json<ApiResponse>({ error: 'Comment not found' }, 404)
      }

      const comment = await prisma.comment.update({
        where: { id },
        data: {
          ...(body.content && { content: body.content }),
          ...(body.resolved !== undefined && {
            resolved: body.resolved,
            resolvedBy: body.resolved ? body.resolvedBy : null,
            resolvedAt: body.resolved ? new Date() : null,
          }),
        },
      })

      return c.json<ApiResponse>({ data: comment, message: 'Comment updated' })
    } catch (error) {
      console.error('Error updating comment:', error)
      return c.json<ApiResponse>({ error: 'Failed to update comment' }, 500)
    }
  }
)

// DELETE /api/comments/:id
commentsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    await prisma.comment.delete({ where: { id } })

    return c.json<ApiResponse>({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return c.json<ApiResponse>({ error: 'Failed to delete comment' }, 500)
  }
})

// GET /api/comments/count - Get comment counts for entities
commentsRouter.get('/count', async (c) => {
  try {
    const entityType = c.req.query('entityType')
    const entityIds = c.req.query('entityIds')

    if (!entityType || !entityIds) {
      return c.json<ApiResponse>({ error: 'entityType and entityIds are required' }, 400)
    }

    const ids = entityIds.split(',')
    const counts = await prisma.comment.groupBy({
      by: ['entityId'],
      where: { entityType, entityId: { in: ids } },
      _count: true,
    })

    const countMap: Record<string, number> = {}
    for (const c of counts) {
      countMap[c.entityId] = c._count
    }

    return c.json<ApiResponse>({ data: countMap })
  } catch (error) {
    console.error('Error fetching comment counts:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch comment counts' }, 500)
  }
})
