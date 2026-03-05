import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const approvalsRouter = new Hono()

const createApprovalSchema = z.object({
  entityType: z.enum(['campaign', 'creative']),
  entityId: z.string().min(1),
  entityName: z.string().optional(),
  requestedBy: z.string().min(1),
  reviewers: z.array(z.string().min(1)).min(1),
  dueDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
})

const reviewSchema = z.object({
  reviewerId: z.string().min(1),
  decision: z.enum(['APPROVED', 'REJECTED']),
  comment: z.string().max(2000).optional(),
})

// GET /api/approvals - List approval requests
approvalsRouter.get('/', async (c) => {
  try {
    const status = c.req.query('status')
    const requestedBy = c.req.query('requestedBy')
    const reviewerId = c.req.query('reviewerId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    const skip = (page - 1) * limit

    const where = {
      ...(status && { status: status as any }),
      ...(requestedBy && { requestedBy }),
      ...(reviewerId && { reviewers: { has: reviewerId } }),
    }

    const [requests, total] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        include: {
          reviews: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.approvalRequest.count({ where }),
    ])

    return c.json<ApiResponse>({
      data: requests,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch approvals' }, 500)
  }
})

// GET /api/approvals/:id
approvalsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const request = await prisma.approvalRequest.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!request) {
      return c.json<ApiResponse>({ error: 'Approval request not found' }, 404)
    }

    return c.json<ApiResponse>({ data: request })
  } catch (error) {
    console.error('Error fetching approval:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch approval' }, 500)
  }
})

// POST /api/approvals - Create approval request
approvalsRouter.post(
  '/',
  zValidator('json', createApprovalSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      const request = await prisma.approvalRequest.create({
        data: {
          entityType: body.entityType,
          entityId: body.entityId,
          entityName: body.entityName,
          requestedBy: body.requestedBy,
          reviewers: body.reviewers,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
          notes: body.notes,
        },
        include: { reviews: true },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: body.requestedBy,
          action: 'requested_approval',
          entityType: body.entityType,
          entityId: body.entityId,
          entityName: body.entityName,
          metadata: { approvalId: request.id, reviewers: body.reviewers },
        },
      })

      return c.json<ApiResponse>({
        data: request,
        message: 'Approval request created',
      }, 201)
    } catch (error) {
      console.error('Error creating approval:', error)
      return c.json<ApiResponse>({ error: 'Failed to create approval request' }, 500)
    }
  }
)

// POST /api/approvals/:id/review - Submit a review
approvalsRouter.post(
  '/:id/review',
  zValidator('json', reviewSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const body = c.req.valid('json')

      const request = await prisma.approvalRequest.findUnique({
        where: { id },
        include: { reviews: true },
      })

      if (!request) {
        return c.json<ApiResponse>({ error: 'Approval request not found' }, 404)
      }

      if (request.status !== 'PENDING') {
        return c.json<ApiResponse>({ error: 'Request is no longer pending' }, 400)
      }

      if (!request.reviewers.includes(body.reviewerId)) {
        return c.json<ApiResponse>({ error: 'Not authorized to review this request' }, 403)
      }

      // Create review
      const review = await prisma.approvalReview.create({
        data: {
          requestId: id,
          reviewerId: body.reviewerId,
          decision: body.decision as any,
          comment: body.comment,
        },
      })

      // Check if all reviewers have responded
      const allReviews = [...request.reviews, review]
      const allReviewed = request.reviewers.every((r) =>
        allReviews.some((rev) => rev.reviewerId === r)
      )

      let newStatus: string = request.status
      if (body.decision === 'REJECTED') {
        newStatus = 'REJECTED'
      } else if (allReviewed) {
        newStatus = 'APPROVED'
      }

      if (newStatus !== request.status) {
        await prisma.approvalRequest.update({
          where: { id },
          data: { status: newStatus as any },
        })

        // Update entity status if approved
        if (newStatus === 'APPROVED') {
          if (request.entityType === 'campaign') {
            await prisma.campaign.update({
              where: { id: request.entityId },
              data: { status: 'APPROVED' },
            })
          } else if (request.entityType === 'creative') {
            await prisma.creative.update({
              where: { id: request.entityId },
              data: { publishStatus: 'SCHEDULED' },
            })
          }
        }
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: body.reviewerId,
          action: body.decision === 'APPROVED' ? 'approved' : 'rejected',
          entityType: request.entityType,
          entityId: request.entityId,
          entityName: request.entityName,
          metadata: { approvalId: id, comment: body.comment },
        },
      })

      const updated = await prisma.approvalRequest.findUnique({
        where: { id },
        include: { reviews: true },
      })

      return c.json<ApiResponse>({
        data: updated,
        message: `Review submitted: ${body.decision}`,
      })
    } catch (error) {
      console.error('Error submitting review:', error)
      return c.json<ApiResponse>({ error: 'Failed to submit review' }, 500)
    }
  }
)

// POST /api/approvals/:id/cancel - Cancel approval request
approvalsRouter.post('/:id/cancel', async (c) => {
  try {
    const id = c.req.param('id')

    const request = await prisma.approvalRequest.findUnique({ where: { id } })
    if (!request) {
      return c.json<ApiResponse>({ error: 'Approval request not found' }, 404)
    }

    if (request.status !== 'PENDING') {
      return c.json<ApiResponse>({ error: 'Only pending requests can be cancelled' }, 400)
    }

    await prisma.approvalRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return c.json<ApiResponse>({ message: 'Approval request cancelled' })
  } catch (error) {
    console.error('Error cancelling approval:', error)
    return c.json<ApiResponse>({ error: 'Failed to cancel approval' }, 500)
  }
})
