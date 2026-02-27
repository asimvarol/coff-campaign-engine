import { Hono } from 'hono'
import type { ApiResponse } from '@repo/types'

export const campaignsRouter = new Hono()

// Mock data (temporary - will be replaced with Prisma once DB is ready)
const mockCampaigns = [
  {
    id: 'campaign-1',
    brandId: 'brand-1',
    name: "Mother's Day - Honor Her Story",
    description: 'Celebrating maternal love with our heritage collection',
    objective: 'SEASONAL',
    status: 'PUBLISHED',
    platforms: ['instagram', 'facebook', 'pinterest'],
    concept: {
      name: 'Heritage & Elegance',
      description: 'Celebrate timeless beauty',
      emotion: 'Nostalgic Pride',
    },
    creditsCost: 45,
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-02-25'),
  },
  {
    id: 'campaign-2',
    brandId: 'brand-1',
    name: 'Spring Collection Launch',
    description: 'New spring jewelry line',
    objective: 'PRODUCT_LAUNCH',
    status: 'REVIEW',
    platforms: ['instagram', 'facebook', 'tiktok', 'pinterest'],
    concept: {
      name: 'Spring Awakening',
      description: 'Fresh, vibrant, renewed',
      emotion: 'Joy & Renewal',
    },
    creditsCost: 60,
    createdAt: new Date('2026-02-22'),
    updatedAt: new Date('2026-02-26'),
  },
]

const mockConcepts = [
  {
    name: 'Heritage & Elegance',
    description: 'Celebrate the timeless beauty of traditional craftsmanship with modern elegance.',
    emotion: 'Nostalgic Pride',
    hashtags: ['#TimelessElegance', '#HeritageJewellery', '#CraftsmanshipMatters'],
    colorMood: 'Warm earth tones with gold accents',
    textPosition: 'bottom',
  },
  {
    name: 'Empowered Femininity',
    description: 'Honor the strength and grace of women through bold, statement pieces.',
    emotion: 'Empowerment',
    hashtags: ['#EmpoweredWomen', '#ConfidentStyle', '#StatementJewellery'],
    colorMood: 'Deep blacks with rose gold highlights',
    textPosition: 'top',
  },
  {
    name: 'Sentimental Journey',
    description: 'Every piece tells a story—of love, memory, and cherished moments.',
    emotion: 'Warmth & Nostalgia',
    hashtags: ['#StoriesThatShine', '#SentimentalValue', '#CherishedMoments'],
    colorMood: 'Soft pastels with warm lighting',
    textPosition: 'center',
  },
]

// GET /api/campaigns - List all campaigns
campaignsRouter.get('/', async (c) => {
  try {
    const brandId = c.req.query('brandId')
    let campaigns = mockCampaigns
    
    if (brandId) {
      campaigns = mockCampaigns.filter(c => c.brandId === brandId)
    }

    return c.json<ApiResponse>({
      data: campaigns.map(campaign => ({
        ...campaign,
        _count: { creatives: Math.floor(Math.random() * 15) + 5 },
      }))
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
    const campaign = mockCampaigns.find(c => c.id === id)

    if (!campaign) {
      return c.json<ApiResponse>({ error: 'Campaign not found' }, 404)
    }

    // Mock creatives
    const creatives = Array.from({ length: 12 }, (_, i) => ({
      id: `creative-${id}-${i}`,
      campaignId: id,
      platform: ['instagram', 'facebook', 'tiktok'][i % 3],
      format: ['story', 'feed', 'reels'][i % 3],
      imageUrl: `https://placehold.co/1080x1920?text=Creative+${i + 1}`,
      status: 'PUBLISHED',
      version: 1,
      createdAt: new Date(),
    }))

    return c.json<ApiResponse>({
      data: {
        ...campaign,
        brand: {
          id: 'brand-1',
          name: 'Golden Horn Jewellery',
          logo: { primary: 'https://placehold.co/200x200?text=GH' },
        },
        creatives,
      }
    })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch campaign' }, 500)
  }
})

// POST /api/campaigns - Create new campaign
campaignsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()

    // Simulate creation
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      brandId: body.brandId,
      name: body.name,
      description: body.description || null,
      objective: body.objective,
      status: 'DRAFT',
      platforms: body.platforms || [],
      concept: {},
      creditsCost: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockCampaigns.push(newCampaign)

    return c.json<ApiResponse>({
      data: newCampaign,
      message: 'Campaign created successfully'
    }, 201)
  } catch (error) {
    console.error('Error creating campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to create campaign' }, 500)
  }
})

// PUT /api/campaigns/:id - Update campaign
campaignsRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const campaignIndex = mockCampaigns.findIndex(c => c.id === id)
    if (campaignIndex === -1) {
      return c.json<ApiResponse>({ error: 'Campaign not found' }, 404)
    }

    mockCampaigns[campaignIndex] = {
      ...mockCampaigns[campaignIndex],
      ...body,
      updatedAt: new Date(),
    }

    return c.json<ApiResponse>({
      data: mockCampaigns[campaignIndex],
      message: 'Campaign updated successfully'
    })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to update campaign' }, 500)
  }
})

// DELETE /api/campaigns/:id - Delete campaign
campaignsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const campaignIndex = mockCampaigns.findIndex(c => c.id === id)

    if (campaignIndex === -1) {
      return c.json<ApiResponse>({ error: 'Campaign not found' }, 404)
    }

    mockCampaigns.splice(campaignIndex, 1)

    return c.json<ApiResponse>({
      message: 'Campaign deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return c.json<ApiResponse>({ error: 'Failed to delete campaign' }, 500)
  }
})

// POST /api/campaigns/:id/generate-concepts - Generate AI campaign concepts
campaignsRouter.post('/:id/generate-concepts', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return c.json<ApiResponse>({
      data: {
        concepts: mockConcepts,
        creditsCost: 5,
      },
      message: 'Concepts generated successfully'
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
    const body = await c.req.json()
    const { conceptIndex, platforms } = body

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

    return c.json<ApiResponse>({
      data: {
        creatives,
        creditsCost: creatives.length * 3,
      },
      message: `Generated ${creatives.length} creatives successfully`
    })
  } catch (error) {
    console.error('Error generating creatives:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate creatives' }, 500)
  }
})
