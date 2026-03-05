import { Hono } from 'hono'
import type { ApiResponse } from '@repo/types'
import {
  createCampaignSchema,
  updateCampaignSchema,
  generateCreativesSchema,
  validateBody,
} from '../lib/validators'

export const campaignsRouter = new Hono()

// TODO: Add auth middleware
// import { authMiddleware } from '../middleware/auth'
// campaignsRouter.use('*', authMiddleware)

// In-memory store (temporary - will be replaced with Prisma once DB is ready)
const campaigns: Record<string, unknown>[] = []

// GET /api/campaigns - List all campaigns
// TODO: Add auth middleware to verify user access
campaignsRouter.get('/', async (c) => {
  try {
    // TODO: Get user from auth context
    // const user = c.get('user')
    // TODO: Filter campaigns by user's clinic/organization
    
    const brandId = c.req.query('brandId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    
    let campaigns = campaigns
    
    if (brandId) {
      campaigns = campaigns.filter(c => c.brandId === brandId)
    }

    // Pagination
    const total = campaigns.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCampaigns = campaigns.slice(startIndex, endIndex)

    return c.json<ApiResponse>({
      data: paginatedCampaigns.map(campaign => ({
        ...campaign,
        _count: { creatives: 0 },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return c.json<ApiResponse>(
      { 
        error: 'Failed to fetch campaigns',
        code: 'FETCH_ERROR',
      },
      500
    )
  }
})

// GET /api/campaigns/:id - Get single campaign with creatives
// TODO: Add auth middleware to verify user owns this campaign
campaignsRouter.get('/:id', async (c) => {
  try {
    // TODO: Verify user has access to this campaign
    const id = c.req.param('id')
    const campaign = campaigns.find(c => c.id === id)

    if (!campaign) {
      return c.json<ApiResponse>(
        { 
          error: 'Campaign not found',
          code: 'NOT_FOUND',
        },
        404
      )
    }

    // TODO: Fetch creatives from DB
    return c.json<ApiResponse>({
      data: {
        ...campaign,
        creatives: [],
      }
    })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return c.json<ApiResponse>(
      { 
        error: 'Failed to fetch campaign',
        code: 'FETCH_ERROR',
      },
      500
    )
  }
})

// POST /api/campaigns - Create new campaign
// TODO: Add auth middleware - only authenticated users can create
campaignsRouter.post('/', async (c) => {
  try {
    // TODO: Get authenticated user
    // const user = c.get('user')
    
    // Validate input
    const validation = await validateBody(c.req.raw, createCampaignSchema)
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

    // TODO: Verify user has access to this brand
    // TODO: Check user has enough credits
    
    // Simulate creation
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      brandId: body.brandId,
      name: body.name,
      description: body.description || '',
      objective: body.objective,
      status: 'DRAFT',
      platforms: body.platforms,
      concept: {
        name: '',
        description: '',
        emotion: '',
      },
      creditsCost: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    campaigns.push(newCampaign)

    return c.json<ApiResponse>(
      {
        data: newCampaign,
        message: 'Campaign created successfully'
      },
      201
    )
  } catch (error) {
    console.error('Error creating campaign:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to create campaign',
        code: 'CREATE_ERROR',
      },
      500
    )
  }
})

// PUT /api/campaigns/:id - Update campaign
// TODO: Add auth middleware to verify user owns this campaign
campaignsRouter.put('/:id', async (c) => {
  try {
    // TODO: Verify user has access to this campaign
    const id = c.req.param('id')
    
    // Validate input
    const validation = await validateBody(c.req.raw, updateCampaignSchema)
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

    const campaignIndex = campaigns.findIndex(c => c.id === id)
    if (campaignIndex === -1) {
      return c.json<ApiResponse>(
        {
          error: 'Campaign not found',
          code: 'NOT_FOUND',
        },
        404
      )
    }

    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...body,
      updatedAt: new Date(),
    }

    return c.json<ApiResponse>({
      data: campaigns[campaignIndex],
      message: 'Campaign updated successfully'
    })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to update campaign',
        code: 'UPDATE_ERROR',
      },
      500
    )
  }
})

// DELETE /api/campaigns/:id - Delete campaign (soft delete)
// TODO: Add auth middleware + admin role check
campaignsRouter.delete('/:id', async (c) => {
  try {
    // TODO: Verify user has access and admin rights
    // TODO: Implement soft delete instead of hard delete
    const id = c.req.param('id')
    const campaignIndex = campaigns.findIndex(c => c.id === id)

    if (campaignIndex === -1) {
      return c.json<ApiResponse>(
        {
          error: 'Campaign not found',
          code: 'NOT_FOUND',
        },
        404
      )
    }

    // TODO: Replace with soft delete: { deletedAt: new Date() }
    campaigns.splice(campaignIndex, 1)

    return c.json<ApiResponse>({
      data: { success: true },
      message: 'Campaign deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to delete campaign',
        code: 'DELETE_ERROR',
      },
      500
    )
  }
})

// POST /api/campaigns/:id/generate-concepts - Generate AI campaign concepts
// TODO: Add auth middleware + credits check
campaignsRouter.post('/:id/generate-concepts', async (c) => {
  try {
    // TODO: Verify user has access to this campaign
    // TODO: Check user has enough credits (5 credits required)
    const id = c.req.param('id')
    
    const campaign = campaigns.find(c => c.id === id)
    if (!campaign) {
      return c.json<ApiResponse>(
        {
          error: 'Campaign not found',
          code: 'NOT_FOUND',
        },
        404
      )
    }
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // TODO: Deduct 5 credits from user
    // TODO: Call AI service to generate concepts

    // TODO: Call AI service to generate real concepts
    return c.json<ApiResponse>({
      data: {
        concepts: [],
        creditsCost: 5,
      },
      message: 'Concepts generated successfully'
    })
  } catch (error) {
    console.error('Error generating concepts:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to generate concepts',
        code: 'GENERATION_ERROR',
      },
      500
    )
  }
})

// POST /api/campaigns/:id/generate-creatives - Generate creatives from selected concept
// TODO: Add auth middleware + credits check
campaignsRouter.post('/:id/generate-creatives', async (c) => {
  try {
    // TODO: Verify user has access to this campaign
    // TODO: Check user has enough credits (3 credits per creative)
    const id = c.req.param('id')
    
    const campaign = campaigns.find(c => c.id === id)
    if (!campaign) {
      return c.json<ApiResponse>(
        {
          error: 'Campaign not found',
          code: 'NOT_FOUND',
        },
        404
      )
    }
    
    // Validate input
    const validation = await validateBody(c.req.raw, generateCreativesSchema)
    if (!validation.success) {
      return c.json<ApiResponse>(
        {
          error: validation.error,
          code: validation.code,
        },
        400
      )
    }

    const { conceptIndex, platforms } = validation.data

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const creatives = platforms.flatMap((platform: string, idx: number) => 
      Array.from({ length: 2 }, (_, i) => ({
        id: `creative-${Date.now()}-${idx}-${i}`,
        campaignId: id,
        platform,
        format: ['story', 'feed', 'reels'][i % 3],
        width: 1080,
        height: platform === 'facebook' ? 630 : 1920,
        imageUrl: `https://placehold.co/1080x1920?text=${platform}+${i}`,
        status: 'DRAFT',
        version: 1,
        createdAt: new Date(),
      }))
    )

    // TODO: Deduct (creatives.length * 3) credits from user
    // TODO: Call AI service to generate creatives

    return c.json<ApiResponse>({
      data: {
        creatives,
        creditsCost: creatives.length * 3,
      },
      message: `Generated ${creatives.length} creatives successfully`
    })
  } catch (error) {
    console.error('Error generating creatives:', error)
    return c.json<ApiResponse>(
      {
        error: 'Failed to generate creatives',
        code: 'GENERATION_ERROR',
      },
      500
    )
  }
})
