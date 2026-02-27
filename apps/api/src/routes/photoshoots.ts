import { Hono } from 'hono'
import { z } from 'zod'
import type { ApiResponse, Photoshoot, PhotoshootVariant } from '@repo/types'

export const photoshootsRouter = new Hono()

// Validation schemas
const RemoveBackgroundSchema = z.object({
  imageUrl: z.string().url(),
})

const ProductPhotoshootSchema = z.object({
  productImage: z.string().url(),
  templateId: z.string(),
  brandId: z.string().optional(),
  removeBackground: z.boolean().default(true),
})

const FreeGenerationSchema = z.object({
  prompt: z.string().min(10),
  brandId: z.string().optional(),
  stylePreset: z.string().optional(),
})

// GET /api/photoshoots - List recent photoshoots
photoshootsRouter.get('/', async (c) => {
  try {
    // TODO: Replace with Prisma query when DB model is added
    // For now, return mock data
    const mockPhotoshoots: Photoshoot[] = [
      {
        id: 'ps-001',
        mode: 'product',
        brandId: 'brand-001',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        prompt: null,
        templateId: 'minimalist-studio',
        variants: [
          {
            id: 'var-001',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            prompt: 'Product on white background with soft shadow',
            selected: true,
          },
        ],
        creditCost: 10,
        status: 'completed',
        createdAt: new Date('2026-02-27T10:30:00Z'),
        updatedAt: new Date('2026-02-27T10:30:00Z'),
      },
    ]

    return c.json<ApiResponse<Photoshoot[]>>({ data: mockPhotoshoots })
  } catch (error) {
    console.error('Error fetching photoshoots:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch photoshoots' }, 500)
  }
})

// GET /api/photoshoots/:id - Get single photoshoot
photoshootsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // TODO: Replace with Prisma query
    const mockPhotoshoot: Photoshoot = {
      id,
      mode: 'product',
      brandId: 'brand-001',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      prompt: null,
      templateId: 'minimalist-studio',
      variants: [
        {
          id: 'var-001',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          prompt: 'Product on white background with soft shadow',
          selected: true,
        },
        {
          id: 'var-002',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
          prompt: 'Product on beige background with soft shadow',
          selected: false,
        },
        {
          id: 'var-003',
          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
          prompt: 'Product on grey background with soft shadow',
          selected: true,
        },
        {
          id: 'var-004',
          imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop',
          prompt: 'Product on marble background with soft shadow',
          selected: false,
        },
      ],
      creditCost: 10,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return c.json<ApiResponse<Photoshoot>>({ data: mockPhotoshoot })
  } catch (error) {
    console.error('Error fetching photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch photoshoot' }, 500)
  }
})

// POST /api/photoshoots/remove-bg - Remove background from product image
photoshootsRouter.post('/remove-bg', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = RemoveBackgroundSchema.safeParse(body)

    if (!parsed.success) {
      return c.json<ApiResponse>(
        { error: 'Invalid input', message: parsed.error.message },
        400
      )
    }

    // TODO: Call fal.ai background removal API
    // For now, simulate with delay and return same image
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return c.json<ApiResponse<{ imageUrl: string }>>({
      data: { imageUrl: parsed.data.imageUrl },
    })
  } catch (error) {
    console.error('Error removing background:', error)
    return c.json<ApiResponse>({ error: 'Failed to remove background' }, 500)
  }
})

// POST /api/photoshoots/product - Create product photoshoot
photoshootsRouter.post('/product', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = ProductPhotoshootSchema.safeParse(body)

    if (!parsed.success) {
      return c.json<ApiResponse>(
        { error: 'Invalid input', message: parsed.error.message },
        400
      )
    }

    // TODO: Queue BullMQ job for photoshoot generation
    // TODO: Use fal.ai Nano Banana 2 for image generation
    // TODO: Apply Brand DNA if brandId provided

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 3500))

    // Generate 4 mock variants
    const variants: PhotoshootVariant[] = [
      {
        id: `var-${Date.now()}-1`,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        prompt: 'Product on white background with soft shadow',
        selected: false,
      },
      {
        id: `var-${Date.now()}-2`,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        prompt: 'Product on beige background with soft shadow',
        selected: false,
      },
      {
        id: `var-${Date.now()}-3`,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
        prompt: 'Product on grey background with soft shadow',
        selected: false,
      },
      {
        id: `var-${Date.now()}-4`,
        imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop',
        prompt: 'Product on marble background with soft shadow',
        selected: false,
      },
    ]

    const photoshoot: Photoshoot = {
      id: `ps-${Date.now()}`,
      mode: 'product',
      brandId: parsed.data.brandId || null,
      productImage: parsed.data.productImage,
      prompt: null,
      templateId: parsed.data.templateId,
      variants,
      creditCost: 10,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return c.json<ApiResponse<Photoshoot>>({ data: photoshoot })
  } catch (error) {
    console.error('Error generating product photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate photoshoot' }, 500)
  }
})

// POST /api/photoshoots/free - Free generation
photoshootsRouter.post('/free', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = FreeGenerationSchema.safeParse(body)

    if (!parsed.success) {
      return c.json<ApiResponse>(
        { error: 'Invalid input', message: parsed.error.message },
        400
      )
    }

    // TODO: Queue BullMQ job for free generation
    // TODO: Use fal.ai Nano Banana 2 for image generation
    // TODO: Apply Brand DNA if brandId provided

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 3500))

    // Generate 4 mock variants
    const variants: PhotoshootVariant[] = [
      {
        id: `var-${Date.now()}-1`,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        prompt: parsed.data.prompt,
        selected: false,
      },
      {
        id: `var-${Date.now()}-2`,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        prompt: parsed.data.prompt,
        selected: false,
      },
      {
        id: `var-${Date.now()}-3`,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
        prompt: parsed.data.prompt,
        selected: false,
      },
      {
        id: `var-${Date.now()}-4`,
        imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop',
        prompt: parsed.data.prompt,
        selected: false,
      },
    ]

    const photoshoot: Photoshoot = {
      id: `ps-${Date.now()}`,
      mode: 'free',
      brandId: parsed.data.brandId || null,
      productImage: null,
      prompt: parsed.data.prompt,
      templateId: null,
      variants,
      creditCost: 3,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return c.json<ApiResponse<Photoshoot>>({ data: photoshoot })
  } catch (error) {
    console.error('Error generating free photoshoot:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate photoshoot' }, 500)
  }
})
