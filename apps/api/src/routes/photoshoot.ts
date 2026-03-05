import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const photoshootRouter = new Hono()

// GET /api/photoshoot - List all photoshoots with pagination
photoshootRouter.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '10'), 100)
    const status = c.req.query('status')
    const brandId = c.req.query('brandId')
    const skip = (page - 1) * limit

    const where = {
      ...(status && { status: status as any }),
      ...(brandId && { brandId }),
    }

    const [photoshoots, total] = await Promise.all([
      prisma.photoshoot.findMany({
        where,
        include: {
          variants: true,
          brand: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.photoshoot.count({ where }),
    ])

    return c.json<ApiResponse>({
      data: photoshoots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching photoshoots:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch photoshoots' }, 500)
  }
})

// GET /api/photoshoot/:id - Get single photoshoot by ID
photoshootRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const photoshoot = await prisma.photoshoot.findUnique({
      where: { id },
      include: {
        variants: true,
        brand: { select: { id: true, name: true } },
      },
    })

    if (!photoshoot) {
      return c.json<ApiResponse>({ error: 'Photoshoot not found' }, 404)
    }

    return c.json<ApiResponse>({ data: photoshoot })
  } catch (error) {
    console.error('Error fetching photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch photoshoot' }, 500)
  }
})

// POST /api/photoshoot/remove-background - Remove background from product image
// Note: fal.ai integration is Phase 3. Returns placeholder for now.
photoshootRouter.post('/remove-background', async (c) => {
  try {
    const body = await c.req.json()
    const { imageUrl } = body

    if (!imageUrl || typeof imageUrl !== 'string') {
      return c.json<ApiResponse>({ error: 'Image URL is required' }, 400)
    }

    // Phase 3: Call fal.ai background removal API
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

// POST /api/photoshoot/generate - Generate product photoshoot
photoshootRouter.post('/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { productImageUrl, brandId, templates } = body

    if (!productImageUrl) {
      return c.json<ApiResponse>({ error: 'Product image URL is required' }, 400)
    }
    if (!brandId) {
      return c.json<ApiResponse>({ error: 'Brand ID is required' }, 400)
    }
    if (!templates || !Array.isArray(templates) || templates.length === 0) {
      return c.json<ApiResponse>({ error: 'At least one template must be selected' }, 400)
    }
    if (templates.length > 8) {
      return c.json<ApiResponse>({ error: 'Maximum 8 templates allowed' }, 400)
    }

    // Verify brand exists
    const brand = await prisma.brand.findUnique({ where: { id: brandId } })
    if (!brand) {
      return c.json<ApiResponse>({ error: 'Brand not found' }, 404)
    }

    // Create photoshoot with placeholder variants (Phase 3: replace with AI generation)
    const photoshoot = await prisma.photoshoot.create({
      data: {
        brandId,
        name: `Photoshoot ${new Date().toLocaleDateString()}`,
        productImageUrl,
        status: 'GENERATING',
        creditCost: templates.length * 3,
        variants: {
          create: templates.map((template: string) => ({
            template,
            imageUrl: `https://placehold.co/1080x1080/1c1b1b/e6d3c1?text=${encodeURIComponent(template)}`,
            prompt: `Product photoshoot with ${template} style for ${brand.name}`,
          })),
        },
      },
      include: { variants: true },
    })

    // Simulate completion (Phase 3: replace with async job queue)
    await prisma.photoshoot.update({
      where: { id: photoshoot.id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    })

    return c.json<ApiResponse>({
      data: {
        photoshootId: photoshoot.id,
        status: 'COMPLETED',
        creditCost: photoshoot.creditCost,
        variants: photoshoot.variants,
      },
      message: 'Photoshoot generated successfully',
    }, 201)
  } catch (error) {
    console.error('Error generating photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate photoshoot' }, 500)
  }
})

// POST /api/photoshoot/:id/select - Update selected variants
photoshootRouter.post('/:id/select', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { variantIds } = body

    if (!Array.isArray(variantIds)) {
      return c.json<ApiResponse>({ error: 'variantIds must be an array' }, 400)
    }

    // Reset all variants, then select the chosen ones
    await prisma.$transaction([
      prisma.photoshootVariant.updateMany({
        where: { photoshootId: id },
        data: { selected: false },
      }),
      prisma.photoshootVariant.updateMany({
        where: { id: { in: variantIds }, photoshootId: id },
        data: { selected: true },
      }),
      prisma.photoshoot.update({
        where: { id },
        data: { selectedVariantIds: variantIds },
      }),
    ])

    return c.json<ApiResponse>({ message: 'Selected variants updated successfully' })
  } catch (error) {
    console.error('Error updating selected variants:', error)
    return c.json<ApiResponse>({ error: 'Failed to update selected variants' }, 500)
  }
})
