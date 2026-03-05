import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import { analyzeBrand } from '../lib/brand-analyzer'
import { cacheGet, cacheSet, cacheDel, buildCacheKey } from '../lib/redis'

export const brandsRouter = new Hono()

// GET /api/brands - List all brands
brandsRouter.get('/', async (c) => {
  try {
    // TODO: Add user auth and filter by userId
    const cacheKey = buildCacheKey('brands', 'list')
    const cached = await cacheGet<unknown[]>(cacheKey)
    if (cached) return c.json<ApiResponse>({ data: cached })

    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    await cacheSet(cacheKey, brands, 120)
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
    const cacheKey = buildCacheKey('brands', id)
    const cached = await cacheGet(cacheKey)
    if (cached) return c.json<ApiResponse>({ data: cached })

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

    await cacheSet(cacheKey, brand, 300)
    return c.json<ApiResponse>({ data: brand })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch brand' }, 500)
  }
})

// POST /api/brands/analyze - Analyze URL and create brand
brandsRouter.post('/analyze', async (c) => {
  try {
    const body = await c.req.json()
    const { url } = body
    
    if (!url) {
      return c.json<ApiResponse>({ error: 'URL is required' }, 400)
    }

    // Analyze brand DNA (mock implementation with delay)
    const brandDNA = await analyzeBrand(url)

    // Create brand in database
    const brand = await prisma.brand.create({
      data: {
        userId: body.userId || 'temp-user-id', // TODO: Get from auth
        name: brandDNA.name,
        url: brandDNA.url,
        logo: brandDNA.logo,
        colors: brandDNA.colors,
        typography: brandDNA.typography,
        voice: brandDNA.voice,
        values: brandDNA.values,
        aesthetic: brandDNA.aesthetic,
        industry: brandDNA.industry,
        targetAudience: brandDNA.targetAudience,
        summary: brandDNA.summary,
        images: brandDNA.images,
        socialProfiles: brandDNA.socialProfiles || {},
      },
    })

    await cacheDel(buildCacheKey('brands', 'list'))
    return c.json<ApiResponse>({
      data: brand,
      message: 'Brand DNA analyzed successfully'
    }, 201)
  } catch (error) {
    console.error('Error analyzing brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to analyze brand' }, 500)
  }
})

// POST /api/brands - Create brand manually
brandsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const brand = await prisma.brand.create({
      data: {
        userId: body.userId || 'temp-user-id', // TODO: Get from auth
        name: body.name,
        url: body.url || '',
        logo: body.logo || { primary: '', variants: [] },
        colors: body.colors || {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#0000ff',
          background: '#ffffff',
          text: '#000000',
          palette: [],
        },
        typography: body.typography || { heading: 'sans-serif', body: 'sans-serif' },
        voice: body.voice || { tone: [], personality: [], keywords: [], sampleTexts: [] },
        values: body.values || [],
        aesthetic: body.aesthetic || [],
        industry: body.industry,
        targetAudience: body.targetAudience,
        summary: body.summary,
        images: body.images || { scraped: [], uploaded: [], products: [] },
        socialProfiles: body.socialProfiles || {},
      },
    })

    await cacheDel(buildCacheKey('brands', 'list'))
    return c.json<ApiResponse>({ data: brand, message: 'Brand created' }, 201)
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

    await cacheDel(buildCacheKey('brands', id))
    await cacheDel(buildCacheKey('brands', 'list'))
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

    await cacheDel(buildCacheKey('brands', id))
    await cacheDel(buildCacheKey('brands', 'list'))
    return c.json<ApiResponse>({ message: 'Brand deleted' })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to delete brand' }, 500)
  }
})

// POST /api/brands/:id/analyze - Re-analyze existing brand
brandsRouter.post('/:id/analyze', async (c) => {
  try {
    const id = c.req.param('id')
    
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    })

    if (!existingBrand || !existingBrand.url) {
      return c.json<ApiResponse>({ error: 'Brand not found or no URL' }, 404)
    }

    // Re-analyze
    const brandDNA = await analyzeBrand(existingBrand.url)

    // Update brand
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: brandDNA.name,
        logo: brandDNA.logo,
        colors: brandDNA.colors,
        typography: brandDNA.typography,
        voice: brandDNA.voice,
        values: brandDNA.values,
        aesthetic: brandDNA.aesthetic,
        industry: brandDNA.industry,
        targetAudience: brandDNA.targetAudience,
        summary: brandDNA.summary,
        images: brandDNA.images,
        socialProfiles: brandDNA.socialProfiles || {},
      },
    })

    return c.json<ApiResponse>({ 
      data: brand, 
      message: 'Brand DNA re-analyzed successfully' 
    })
  } catch (error) {
    console.error('Error re-analyzing brand:', error)
    return c.json<ApiResponse>({ error: 'Failed to re-analyze brand' }, 500)
  }
})
