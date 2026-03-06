import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import {
  createCampaignSchema,
  updateCampaignSchema,
  generateCreativesSchema,
  validateBody,
} from '../lib/validators'
import { generateConcepts } from '../lib/openai'
import { generateCampaignCreative } from '../lib/fal'

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

// POST /api/campaigns/generate-concepts - Generate AI concepts without existing campaign
campaignsRouter.post('/generate-concepts', async (c) => {
  try {
    const body = await c.req.json()
    const { brandId, objective, platforms, description } = body

    if (!brandId || !objective || !platforms?.length) {
      return c.json<ApiResponse>({ error: 'brandId, objective, and platforms are required' }, 400)
    }

    const brand = await prisma.brand.findUnique({ where: { id: brandId } })
    if (!brand) {
      return c.json<ApiResponse>({ error: 'Brand not found' }, 404)
    }

    const brandVoice = (brand as Record<string, unknown>).voice as { tone?: string[] } | undefined
    const brandValues = (brand as Record<string, unknown>).values as string[] | undefined

    const concepts = await generateConcepts({
      brandName: brand.name,
      brandVoice: brandVoice?.tone || [],
      brandValues: brandValues || [],
      objective,
      platforms,
      description: description || undefined,
    })

    return c.json<ApiResponse>({
      data: { concepts },
      message: 'Concepts generated successfully',
    })
  } catch (error) {
    console.error('Error generating concepts:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate concepts' }, 500)
  }
})

// POST /api/campaigns/:id/generate-concepts - Generate AI campaign concepts
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

    const brand = campaign.brand
    const brandVoice = (brand as any).voice?.tone || []
    const brandValues = (brand as any).values || []

    const concepts = await generateConcepts({
      brandName: brand.name,
      brandVoice,
      brandValues,
      objective: campaign.objective,
      platforms: campaign.platforms,
      description: campaign.description || undefined,
    })

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
campaignsRouter.post('/:id/generate-creatives', async (c) => {
  try {
    const id = c.req.param('id')

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { brand: true },
    })
    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found', code: 'NOT_FOUND' }, 404)
    }

    const validation = await validateBody(c.req.raw, generateCreativesSchema)
    if (!validation.success) {
      return c.json<ApiResponse>({ error: validation.error, code: validation.code }, 400)
    }

    const { platforms, concept } = validation.data
    const brand = campaign.brand
    const brandColors = (brand as any).colors || { primary: '#000', accent: '#999' }
    const conceptName = concept?.name || campaign.name
    const conceptDesc = concept?.description || campaign.description || ''
    const colorMood = concept?.colorMood || ''

    const sizeMap: Record<string, { w: number; h: number }> = {
      instagram: { w: 1080, h: 1080 },
      facebook: { w: 1200, h: 628 },
      tiktok: { w: 1080, h: 1920 },
      linkedin: { w: 1200, h: 900 },
      x: { w: 1200, h: 628 },
      pinterest: { w: 1000, h: 1500 },
    }

    // Generate images in parallel per platform
    const results = await Promise.allSettled(
      platforms.flatMap((platform: string) => {
        const size = sizeMap[platform] || { w: 1080, h: 1080 }
        return ['feed', 'story'].map(async (format) => {
          const imageUrl = await generateCampaignCreative(
            conceptName,
            conceptDesc,
            colorMood,
            platform,
            { primary: brandColors.primary, accent: brandColors.accent }
          )
          return {
            campaignId: id,
            brandId: campaign.brandId,
            platform,
            format,
            width: format === 'story' ? 1080 : size.w,
            height: format === 'story' ? 1920 : size.h,
            imageUrl,
            imagePrompt: `${platform} ${format} creative for "${conceptName}": ${conceptDesc}`,
          }
        })
      })
    )

    const creativeData = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value)

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
