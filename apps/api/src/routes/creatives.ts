import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import {
  updateCreativeSchema,
  regenerateCreativeSchema,
  validateBody,
} from '../lib/validators'

export const creativesRouter = new Hono()

// GET /api/creatives/:id - Get single creative with details
creativesRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const creative = await prisma.creative.findUnique({
      where: { id },
      include: {
        campaign: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        performance: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!creative) {
      return c.json<ApiResponse>({ error: 'Creative not found', code: 'NOT_FOUND' }, 404)
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

    const validation = await validateBody(c.req.raw, updateCreativeSchema)
    if (!validation.success) {
      return c.json<ApiResponse>({ error: validation.error, code: validation.code }, 400)
    }

    const body = validation.data

    const existing = await prisma.creative.findUnique({ where: { id } })
    if (!existing) {
      return c.json<ApiResponse>({ error: 'Creative not found', code: 'NOT_FOUND' }, 404)
    }

    const creative = await prisma.creative.update({
      where: { id },
      data: {
        ...(body.header && { header: body.header }),
        ...(body.description && { description: body.description }),
        ...(body.cta && { cta: body.cta }),
        ...(body.overlay && { overlay: body.overlay }),
      },
    })

    return c.json<ApiResponse>({ data: creative, message: 'Creative updated successfully' })
  } catch (error) {
    console.error('Error updating creative:', error)
    return c.json<ApiResponse>({ error: 'Failed to update creative' }, 500)
  }
})

// POST /api/creatives/:id/regenerate - Regenerate creative image
// Note: AI integration is Phase 3. Creates a new version in DB.
creativesRouter.post('/:id/regenerate', async (c) => {
  try {
    const id = c.req.param('id')

    const validation = await validateBody(c.req.raw, regenerateCreativeSchema)
    if (!validation.success) {
      return c.json<ApiResponse>({ error: validation.error, code: validation.code }, 400)
    }

    const { strategy, prompt } = validation.data

    const original = await prisma.creative.findUnique({ where: { id } })
    if (!original) {
      return c.json<ApiResponse>({ error: 'Creative not found', code: 'NOT_FOUND' }, 404)
    }

    // Create new version (Phase 3: replace with AI-generated image)
    const newCreative = await prisma.creative.create({
      data: {
        campaignId: original.campaignId,
        brandId: original.brandId,
        platform: original.platform,
        format: original.format,
        width: original.width,
        height: original.height,
        imageUrl: `https://placehold.co/${original.width}x${original.height}/1c1b1b/e6d3c1?text=v${original.version + 1}`,
        imagePrompt: prompt || original.imagePrompt,
        header: original.header as any,
        description: original.description as any,
        cta: original.cta as any,
        overlay: original.overlay as any,
        version: original.version + 1,
        parentId: id,
      },
    })

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

    const creative = await prisma.creative.findUnique({ where: { id } })
    if (!creative) {
      return c.json<ApiResponse>({ error: 'Creative not found', code: 'NOT_FOUND' }, 404)
    }

    // Find all versions: same campaign + platform + format chain
    const versions = await prisma.creative.findMany({
      where: {
        OR: [
          { id },
          { parentId: id },
          // Walk the parent chain
          ...(creative.parentId ? [{ id: creative.parentId }, { parentId: creative.parentId }] : []),
        ],
      },
      select: {
        id: true,
        version: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: { version: 'desc' },
    })

    return c.json<ApiResponse>({ data: versions })
  } catch (error) {
    console.error('Error fetching versions:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch versions' }, 500)
  }
})
