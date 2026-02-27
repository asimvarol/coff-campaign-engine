import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const campaignsRouter = new Hono()

// GET /api/campaigns - List campaigns
campaignsRouter.get('/', async (c) => {
  try {
    const brandId = c.req.query('brandId')
    const campaigns = await prisma.campaign.findMany({
      where: brandId ? { brandId } : undefined,
      include: { brand: true, _count: { select: { creatives: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return c.json<ApiResponse>({ data: campaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch campaigns' }, 500)
  }
})

// GET /api/campaigns/:id - Get campaign
campaignsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: true,
        creatives: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found' }, 404)
    }

    return c.json<ApiResponse>({ data: campaign })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch campaign' }, 500)
  }
})

// POST /api/campaigns - Create campaign
campaignsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: Validate with Zod
    // TODO: Queue concept generation job

    const campaign = await prisma.campaign.create({
      data: {
        brandId: body.brandId,
        name: body.name,
        description: body.description,
        objective: body.objective,
        platforms: body.platforms || [],
        concept: {},
        status: 'GENERATING',
      },
    })

    return c.json<ApiResponse>({ data: campaign, message: 'Campaign created. Generating concepts...' }, 201)
  } catch (error) {
    console.error('Error creating campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to create campaign' }, 500)
  }
})

// POST /api/campaigns/:id/generate-concepts - Generate AI concepts
campaignsRouter.post('/:id/generate-concepts', async (c) => {
  try {
    const id = c.req.param('id')
    // TODO: Queue AI concept generation job
    // TODO: Call OpenAI/Claude for concept ideas

    return c.json<ApiResponse>({ message: 'Concept generation queued' })
  } catch (error) {
    console.error('Error generating concepts:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate concepts' }, 500)
  }
})

// POST /api/campaigns/:id/generate-creatives - Generate creatives from concept
campaignsRouter.post('/:id/generate-creatives', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    // TODO: Queue creative generation (fal.ai image gen)
    // TODO: Generate for each platform/format

    return c.json<ApiResponse>({ message: 'Creative generation queued' })
  } catch (error) {
    console.error('Error generating creatives:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate creatives' }, 500)
  }
})
