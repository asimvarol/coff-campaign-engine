import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const creativesRouter = new Hono()

// GET /api/creatives/:id - Get creative
creativesRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const creative = await prisma.creative.findUnique({
      where: { id },
      include: { campaign: true, brand: true, performance: { orderBy: { recordedAt: 'desc' }, take: 10 } },
    })

    if (!creative) {
      return c.json<ApiResponse>({ error: 'Creative not found' }, 404)
    }

    return c.json<ApiResponse>({ data: creative })
  } catch (error) {
    console.error('Error fetching creative:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch creative' }, 500)
  }
})

// PUT /api/creatives/:id - Update creative
creativesRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const creative = await prisma.creative.update({
      where: { id },
      data: {
        header: body.header,
        description: body.description,
        cta: body.cta,
        overlay: body.overlay,
      },
    })

    return c.json<ApiResponse>({ data: creative, message: 'Creative updated' })
  } catch (error) {
    console.error('Error updating creative:', error)
    return c.json<ApiResponse>({ error: 'Failed to update creative' }, 500)
  }
})

// POST /api/creatives/:id/regenerate - Regenerate creative image
creativesRouter.post('/:id/regenerate', async (c) => {
  try {
    const id = c.req.param('id')
    // TODO: Queue image regeneration job (fal.ai)

    return c.json<ApiResponse>({ message: 'Regeneration queued' })
  } catch (error) {
    console.error('Error regenerating creative:', error)
    return c.json<ApiResponse>({ error: 'Failed to regenerate creative' }, 500)
  }
})
