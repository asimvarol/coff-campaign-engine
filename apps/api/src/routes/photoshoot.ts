import { Hono } from 'hono'

import type { ApiResponse, PaginatedResponse, Photoshoot, PhotoshootGenerateRequest } from '@repo/types'

import { MOCK_DELAYS, mockDelay } from '../lib/constants'
import { validateImageUrl, validatePagination } from '../lib/validation'

export const photoshootRouter = new Hono()

/**
 * GET /api/photoshoot - List all photoshoots with pagination
 */
photoshootRouter.get('/', async (c) => {
  try {
    const page = c.req.query('page')
    const limit = c.req.query('limit')
    const status = c.req.query('status')

    const { page: validPage, limit: validLimit, error } = validatePagination(page, limit)

    if (error) {
      return c.json<ApiResponse>({ error }, 400)
    }

    await mockDelay(MOCK_DELAYS.SHORT)

    // Import mock data dynamically to avoid build-time issues
    const { getPhotoshoots } = await import('../../../web/src/lib/mock-data/photoshoots')

    const result = getPhotoshoots({
      page: validPage,
      limit: validLimit,
      status: status as any,
    })

    return c.json<PaginatedResponse<Photoshoot>>(result)
  } catch (error) {
    console.error('Error fetching photoshoots:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch photoshoots' }, 500)
  }
})

/**
 * GET /api/photoshoot/:id - Get single photoshoot by ID
 */
photoshootRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    await mockDelay(MOCK_DELAYS.SHORT)

    const { getPhotoshootById } = await import('../../../web/src/lib/mock-data/photoshoots')
    const photoshoot = getPhotoshootById(id)

    if (!photoshoot) {
      return c.json<ApiResponse>({ error: 'Photoshoot not found' }, 404)
    }

    return c.json<ApiResponse<Photoshoot>>({ data: photoshoot })
  } catch (error) {
    console.error('Error fetching photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch photoshoot' }, 500)
  }
})

/**
 * POST /api/photoshoot/remove-background - Remove background from product image
 */
photoshootRouter.post('/remove-background', async (c) => {
  try {
    const body = await c.req.json()
    const { imageUrl } = body

    // Validate image URL
    const validation = validateImageUrl(imageUrl)
    if (!validation.valid) {
      return c.json<ApiResponse>({ error: validation.error }, 400)
    }

    await mockDelay(MOCK_DELAYS.LONG)

    // TODO: Call fal.ai background removal API
    // For now, return mock response
    return c.json<ApiResponse>({
      data: {
        originalUrl: imageUrl,
        processedUrl: `${imageUrl}?bg=transparent`,
      },
      message: 'Background removed successfully',
    })
  } catch (error) {
    console.error('Error removing background:', error)
    return c.json<ApiResponse>({ error: 'Failed to remove background' }, 500)
  }
})

/**
 * POST /api/photoshoot/generate - Generate product photoshoot
 */
photoshootRouter.post('/generate', async (c) => {
  try {
    const body: PhotoshootGenerateRequest = await c.req.json()
    const { productImageUrl, brandDnaId, templates } = body

    // Validate product image URL
    const validation = validateImageUrl(productImageUrl)
    if (!validation.valid) {
      return c.json<ApiResponse>({ error: validation.error }, 400)
    }

    // Validate templates
    if (!templates || templates.length === 0) {
      return c.json<ApiResponse>({ error: 'At least one template must be selected' }, 400)
    }

    if (templates.length > 8) {
      return c.json<ApiResponse>({ error: 'Maximum 8 templates allowed' }, 400)
    }

    await mockDelay(MOCK_DELAYS.EXTRA_LONG)

    // TODO: Queue photoshoot generation job
    // TODO: Generate 4 variants with different templates using Brand DNA
    // For now, return mock response
    return c.json<ApiResponse>({
      data: {
        photoshootId: `ps-${Date.now()}`,
        status: 'GENERATING',
        creditCost: 10,
        estimatedCompletionTime: '2-3 minutes',
      },
      message: 'Photoshoot generation queued successfully',
    })
  } catch (error) {
    console.error('Error generating photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate photoshoot' }, 500)
  }
})

/**
 * POST /api/photoshoot/:id/select - Update selected variants
 */
photoshootRouter.post('/:id/select', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { variantIds } = body

    if (!Array.isArray(variantIds)) {
      return c.json<ApiResponse>({ error: 'variantIds must be an array' }, 400)
    }

    await mockDelay(MOCK_DELAYS.SHORT)

    // TODO: Update photoshoot in database
    return c.json<ApiResponse>({
      message: 'Selected variants updated successfully',
    })
  } catch (error) {
    console.error('Error updating selected variants:', error)
    return c.json<ApiResponse>({ error: 'Failed to update selected variants' }, 500)
  }
})
