import { Hono } from 'hono'
import type { ApiResponse } from '@repo/types'

export const creativesRouter = new Hono()

// Mock creative storage (temporary)
const mockCreatives = new Map<string, any>()

// GET /api/creatives/:id - Get single creative with details
creativesRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
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
    return c.json<ApiResponse>({ error: 'Failed to fetch creative' }, 500)
  }
})

// PUT /api/creatives/:id - Update creative (text, overlay, etc.)
creativesRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    // Store updates in mock storage
    mockCreatives.set(id, {
      ...mockCreatives.get(id),
      ...body,
      updatedAt: new Date(),
    })

    return c.json<ApiResponse>({
      data: mockCreatives.get(id),
      message: 'Creative updated successfully'
    })
  } catch (error) {
    console.error('Error updating creative:', error)
    return c.json<ApiResponse>({ error: 'Failed to update creative' }, 500)
  }
})

// POST /api/creatives/:id/regenerate - Regenerate creative image
creativesRouter.post('/:id/regenerate', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { strategy } = body // 'regenerate' | 'next_variant' | 'best_performing_clone'

    // Simulate regeneration delay
    await new Promise(resolve => setTimeout(resolve, 3000))

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
    return c.json<ApiResponse>({ error: 'Failed to regenerate creative' }, 500)
  }
})

// GET /api/creatives/:id/versions - Get version history
creativesRouter.get('/:id/versions', async (c) => {
  try {
    const id = c.req.param('id')

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
    return c.json<ApiResponse>({ error: 'Failed to fetch versions' }, 500)
  }
})
