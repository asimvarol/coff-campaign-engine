import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import {
  createCampaignSchema,
  updateCampaignSchema,
  generateCreativesSchema,
  validateBody,
} from '../lib/validators'

export const campaignsRouter = new Hono()

// GET /api/campaigns - List all campaigns
campaignsRouter.get('/', async (c) => {
  try {
    const brandId = c.req.query('brandId')
    const status = c.req.query('status')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    const skip = (page - 1) * limit

    const where = {
      ...(brandId && { brandId }),
      ...(status && { status: status as any }),
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          brand: { select: { id: true, name: true, logo: true } },
          _count: { select: { creatives: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.campaign.count({ where }),
    ])

    return c.json<ApiResponse>({
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch campaigns' }, 500)
  }
})

// GET /api/campaigns/:id - Get single campaign with creatives
campaignsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, name: true, logo: true } },
        creatives: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found', code: 'NOT_FOUND' }, 404)
    }

    return c.json<ApiResponse>({ data: campaign })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch campaign' }, 500)
  }
})

// POST /api/campaigns - Create new campaign
campaignsRouter.post('/', async (c) => {
  try {
    const validation = await validateBody(c.req.raw, createCampaignSchema)
    if (!validation.success) {
      return c.json<ApiResponse>({ error: validation.error, code: validation.code }, 400)
    }

    const body = validation.data

    // Verify brand exists
    const brand = await prisma.brand.findUnique({ where: { id: body.brandId } })
    if (!brand) {
      return c.json<ApiResponse>({ error: 'Brand not found', code: 'NOT_FOUND' }, 404)
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: body.brandId,
        name: body.name,
        description: body.description || '',
        objective: body.objective as any,
        platforms: body.platforms,
        concept: {},
      },
      include: {
        brand: { select: { id: true, name: true, logo: true } },
      },
    })

    return c.json<ApiResponse>({ data: campaign, message: 'Campaign created successfully' }, 201)
  } catch (error) {
    console.error('Error creating campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to create campaign' }, 500)
  }
})

// PUT /api/campaigns/:id - Update campaign
campaignsRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const validation = await validateBody(c.req.raw, updateCampaignSchema)
    if (!validation.success) {
      return c.json<ApiResponse>({ error: validation.error, code: validation.code }, 400)
    }

    const body = validation.data

    const existing = await prisma.campaign.findUnique({ where: { id } })
    if (!existing) {
      return c.json<ApiResponse>({ error: 'Campaign not found', code: 'NOT_FOUND' }, 404)
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.objective && { objective: body.objective as any }),
        ...(body.platforms && { platforms: body.platforms }),
        ...(body.status && { status: body.status as any }),
        ...(body.concept && { concept: body.concept }),
      },
    })

    return c.json<ApiResponse>({ data: campaign, message: 'Campaign updated successfully' })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to update campaign' }, 500)
  }
})

// DELETE /api/campaigns/:id
campaignsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const existing = await prisma.campaign.findUnique({ where: { id } })
    if (!existing) {
      return c.json<ApiResponse>({ error: 'Campaign not found', code: 'NOT_FOUND' }, 404)
    }

    await prisma.campaign.delete({ where: { id } })

    return c.json<ApiResponse>({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to delete campaign' }, 500)
  }
})

// POST /api/campaigns/:id/generate-concepts - Generate AI campaign concepts
// Note: AI integration is Phase 3. Returns placeholder concepts for now.
campaignsRouter.post('/:id/generate-concepts', async (c) => {
  try {
    const id = c.req.param('id')

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { brand: true },
    })
    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found', code: 'NOT_FOUND' }, 404)
    }

    // Phase 3: Replace with real AI generation
    const concepts = [
      {
        name: 'Heritage & Elegance',
        description: 'Celebrate the timeless beauty of traditional craftsmanship with modern elegance.',
        emotion: 'Nostalgic Pride',
        hashtags: ['#TimelessElegance', '#Craftsmanship'],
        colorMood: 'Warm earth tones with gold accents',
        textPosition: 'bottom',
      },
      {
        name: 'Empowered Femininity',
        description: 'Honor the strength and grace through bold, statement pieces.',
        emotion: 'Empowerment',
        hashtags: ['#EmpoweredWomen', '#ConfidentStyle'],
        colorMood: 'Deep blacks with rose gold highlights',
        textPosition: 'top',
      },
      {
        name: 'Sentimental Journey',
        description: 'Every piece tells a story of love, memory, and cherished moments.',
        emotion: 'Warmth & Nostalgia',
        hashtags: ['#StoriesThatShine', '#CherishedMoments'],
        colorMood: 'Soft pastels with warm lighting',
        textPosition: 'center',
      },
    ]

    // Update campaign status
    await prisma.campaign.update({
      where: { id },
      data: { status: 'GENERATING', creditsCost: { increment: 5 } },
    })

    return c.json<ApiResponse>({
      data: { concepts, creditsCost: 5 },
      message: 'Concepts generated successfully',
    })
  } catch (error) {
    console.error('Error generating concepts:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate concepts' }, 500)
  }
})

// POST /api/campaigns/:id/generate-creatives - Generate creatives from selected concept
// Note: AI integration is Phase 3. Creates placeholder creatives in DB.
campaignsRouter.post('/:id/generate-creatives', async (c) => {
  try {
    const id = c.req.param('id')

    const campaign = await prisma.campaign.findUnique({ where: { id } })
    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found', code: 'NOT_FOUND' }, 404)
    }

    const validation = await validateBody(c.req.raw, generateCreativesSchema)
    if (!validation.success) {
      return c.json<ApiResponse>({ error: validation.error, code: validation.code }, 400)
    }

    const { platforms } = validation.data

    // Create placeholder creatives in DB (Phase 3: replace with AI-generated images)
    const creativeData = platforms.flatMap((platform: string) => [
      {
        campaignId: id,
        brandId: campaign.brandId,
        platform,
        format: 'story',
        width: 1080,
        height: 1920,
        imageUrl: `https://placehold.co/1080x1920/1c1b1b/e6d3c1?text=${platform}+Story`,
        imagePrompt: `${platform} story creative for ${campaign.name}`,
      },
      {
        campaignId: id,
        brandId: campaign.brandId,
        platform,
        format: 'feed',
        width: 1080,
        height: 1080,
        imageUrl: `https://placehold.co/1080x1080/1c1b1b/e6d3c1?text=${platform}+Feed`,
        imagePrompt: `${platform} feed creative for ${campaign.name}`,
      },
    ])

    const creatives = await prisma.$transaction(
      creativeData.map((data) => prisma.creative.create({ data }))
    )

    const creditsCost = creatives.length * 3
    await prisma.campaign.update({
      where: { id },
      data: { status: 'REVIEW', creditsCost: { increment: creditsCost } },
    })

    return c.json<ApiResponse>({
      data: { creatives, creditsCost },
      message: `Generated ${creatives.length} creatives successfully`,
    })
  } catch (error) {
    console.error('Error generating creatives:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate creatives' }, 500)
  }
})
