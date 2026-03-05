import { Hono } from 'hono'
import type { ApiResponse } from '@repo/types'
import {
  updateCreativeSchema,
  regenerateCreativeSchema,
  validateBody,
} from '../lib/validators'

export const creativesRouter = new Hono()

// TODO: Add auth middleware
// import { authMiddleware } from '../middleware/auth'
// creativesRouter.use('*', authMiddleware)

// In-memory storage (temporary — will be replaced with Prisma)
const creativeStore = new Map<string, Record<string, unknown>>()

// GET /api/creatives/:id - Get single creative with details
// TODO: Add auth middleware to verify user owns this creative
creativesRouter.get('/:id', async (c) => {
  try {
    // TODO: Verify user has access to this creative's campaign
    const id = c.req.param('id')
    
    // TODO: Fetch from database with Prisma
    const creative = creativeStore.get(id)

    if (!creative) {
      return c.json<ApiResponse>(
        { error: 'Creative not found', code: 'NOT_FOUND' },
        404
      )
    }

    return c.json<ApiResponse>({ data: creative })
  } catch (error) {
    console.error('Error fetching creative:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to fetch creative',
        code: 'FETCH_ERROR',
      },
      500
    )
  }
})

// PUT /api/creatives/:id - Update creative (text, overlay, etc.)
// TODO: Add auth middleware to verify user owns this creative
creativesRouter.put('/:id', async (c) => {
  try {
    // TODO: Verify user has access to this creative's campaign
    const id = c.req.param('id')
    
    // Validate input
    const validation = await validateBody(c.req.raw, updateCreativeSchema)
    if (!validation.success) {
      return c.json<ApiResponse>(
        {
          error: validation.error,
          code: validation.code,
        },
        400
      )
    }

    const body = validation.data

    // TODO: Check if creative exists in database
    // TODO: Update with Prisma
    
    // Store updates in mock storage
    const existingCreative = creativeStore.get(id) || {}
    const updatedCreative = {
      ...existingCreative,
      ...body,
      updatedAt: new Date(),
    }
    creativeStore.set(id, updatedCreative)

    return c.json<ApiResponse>({
      data: updatedCreative,
      message: 'Creative updated successfully'
    })
  } catch (error) {
    console.error('Error updating creative:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to update creative',
        code: 'UPDATE_ERROR',
      },
      500
    )
  }
})

// POST /api/creatives/:id/regenerate - Regenerate creative image
// TODO: Add auth middleware + credits check (3 credits)
creativesRouter.post('/:id/regenerate', async (c) => {
  try {
    // TODO: Verify user has access to this creative
    // TODO: Check user has enough credits (3 credits required)
    const id = c.req.param('id')
    
    // Validate input
    const validation = await validateBody(c.req.raw, regenerateCreativeSchema)
    if (!validation.success) {
      return c.json<ApiResponse>(
        {
          error: validation.error,
          code: validation.code,
        },
        400
      )
    }

    const { strategy, prompt } = validation.data

    // TODO: Fetch original creative from database
    // TODO: Verify creative exists
    
    // Simulate regeneration delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // TODO: Call AI service based on strategy
    // TODO: Deduct 3 credits from user
    // TODO: Save new creative version to database

    const newCreative = {
      id: `${id}-v${Date.now()}`,
      parentId: id,
      version: 2,
      imageUrl: `https://placehold.co/1080x1920?text=Regenerated`,
      status: 'DRAFT',
      createdAt: new Date(),
    }

    return c.json<ApiResponse>({
      data: newCreative,
      message: `Creative regenerated using ${strategy} strategy`,
    })
  } catch (error) {
    console.error('Error regenerating creative:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to regenerate creative',
        code: 'REGENERATION_ERROR',
      },
      500
    )
  }
})

// GET /api/creatives/:id/versions - Get version history
// TODO: Add auth middleware to verify user owns this creative
creativesRouter.get('/:id/versions', async (c) => {
  try {
    // TODO: Verify user has access to this creative's campaign
    const id = c.req.param('id')

    // TODO: Fetch versions from database with Prisma
    return c.json<ApiResponse>({ data: [] })
  } catch (error) {
    console.error('Error fetching versions:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to fetch versions',
        code: 'FETCH_ERROR',
      },
      500
    )
  }
})
