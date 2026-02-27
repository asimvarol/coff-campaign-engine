import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const brandsRouter = new Hono()

// GET /api/brands - List all brands
brandsRouter.get('/', async (c) => {
  try {
    // TODO: Add user auth and filter by userId
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return c.json<ApiResponse>({ data: brands })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch brands' }, 500)
  }
})

// GET /api/brands/:id - Get single brand
brandsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        campaigns: { take: 10, orderBy: { createdAt: 'desc' } },
        socialAccounts: true,
      },
    })

    if (!brand) {
      return c.json<ApiResponse>({ error: 'Brand not found' }, 404)
    }

    return c.json<ApiResponse>({ data: brand })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch brand' }, 500)
  }
})

// POST /api/brands - Create brand
brandsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: Validate with Zod
    // TODO: Queue brand DNA analysis job

    const brand = await prisma.brand.create({
      data: {
        userId: body.userId || 'temp-user-id', // TODO: Get from auth
        name: body.name,
        url: body.url,
        logo: { primary: '', variants: [] },
        colors: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#0000ff',
          background: '#ffffff',
          text: '#000000',
          palette: [],
        },
        typography: { heading: 'sans-serif', body: 'sans-serif' },
        voice: { tone: [], personality: [], keywords: [], sampleTexts: [] },
        values: [],
        aesthetic: [],
        images: { scraped: [], uploaded: [], products: [] },
      },
    })

    return c.json<ApiResponse>({ data: brand, message: 'Brand created. DNA analysis queued.' }, 201)
  } catch (error) {
    console.error('Error creating brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to create brand' }, 500)
  }
})

// PUT /api/brands/:id - Update brand
brandsRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const brand = await prisma.brand.update({
      where: { id },
      data: body,
    })

    return c.json<ApiResponse>({ data: brand, message: 'Brand updated' })
  } catch (error) {
    console.error('Error updating brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to update brand' }, 500)
  }
})

// DELETE /api/brands/:id - Delete brand
brandsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    await prisma.brand.delete({
      where: { id },
    })

    return c.json<ApiResponse>({ message: 'Brand deleted' })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to delete brand' }, 500)
  }
})
