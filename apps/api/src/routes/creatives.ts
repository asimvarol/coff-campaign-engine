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

// Mock creative storage (temporary)
const mockCreatives = new Map<string, any>()

// GET /api/creatives/:id - Get single creative with details
// TODO: Add auth middleware to verify user owns this creative
creativesRouter.get('/:id', async (c) => {
  try {
    // TODO: Verify user has access to this creative's campaign
    const id = c.req.param('id')
    
    // TODO: Fetch from database with Prisma
    // Mock creative data
    const creative = {
      id,
      campaignId: 'campaign-1',
      brandId: 'brand-1',
      platform: 'instagram',
      format: 'story',
      width: 1080,
      height: 1920,
      imageUrl: `https://placehold.co/1080x1920?text=Creative`,
      imagePrompt: 'Elegant jewelry photography with warm lighting',
      header: {
        text: 'HONOR HER STORY',
        font: 'Playfair Display',
        size: 48,
        color: '#ffffff',
        position: { x: 50, y: 200 },
        visible: true,
      },
      description: {
        text: 'Celebrating the women who inspire us',
        font: 'Outfit',
        size: 18,
        color: '#e6d3c1',
        position: { x: 50, y: 280 },
        visible: true,
      },
      cta: {
        text: 'Shop Now',
        style: 'primary',
        url: 'https://example.com',
        visible: true,
      },
      overlay: {
        color: '#000000',
        opacity: 0.4,
      },
      version: 1,
      parentId: null,
      publishStatus: 'DRAFT',
      publishedAt: null,
      postUrl: null,
      postId: null,
      performanceScore: null,
      autopilotStatus: null,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const existingCreative = mockCreatives.get(id) || {}
    const updatedCreative = {
      ...existingCreative,
      ...body,
      updatedAt: new Date(),
    }
    mockCreatives.set(id, updatedCreative)

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
    // SELECT * FROM creatives WHERE parentId = id OR id = id ORDER BY version DESC
    
    // Mock version history
    const versions = [
      {
        id: `${id}-v3`,
        version: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
        isCurrent: true,
      },
      {
        id: `${id}-v2`,
        version: 2,
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        isCurrent: false,
      },
      {
        id: `${id}-v1`,
        version: 1,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        isCurrent: false,
      },
    ]

    return c.json<ApiResponse>({ data: versions })
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
