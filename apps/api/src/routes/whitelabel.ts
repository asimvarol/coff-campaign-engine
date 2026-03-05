import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const whitelabelRouter = new Hono()

const updateConfigSchema = z.object({
  appName: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  customDomain: z.string().max(255).optional().nullable(),
  customCss: z.string().max(10000).optional().nullable(),
  footerText: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
})

// GET /api/whitelabel/:agencyId - Get white-label config
whitelabelRouter.get('/:agencyId', async (c) => {
  try {
    const agencyId = c.req.param('agencyId')

    const config = await prisma.whiteLabelConfig.findUnique({
      where: { agencyId },
    })

    if (!config) {
      return c.json<ApiResponse>({
        data: {
          agencyId,
          appName: 'Campaign Engine',
          primaryColor: '#e11d48',
          accentColor: '#f43f5e',
          isActive: false,
        },
      })
    }

    return c.json<ApiResponse>({ data: config })
  } catch (error) {
    console.error('Error fetching white-label config:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch config' }, 500)
  }
})

// PUT /api/whitelabel/:agencyId - Update white-label config
whitelabelRouter.put(
  '/:agencyId',
  zValidator('json', updateConfigSchema),
  async (c) => {
    try {
      const agencyId = c.req.param('agencyId')
      const body = c.req.valid('json')

      // Verify agency exists
      const agency = await prisma.agency.findUnique({ where: { id: agencyId } })
      if (!agency) {
        return c.json<ApiResponse>({ error: 'Agency not found' }, 404)
      }

      // Check custom domain uniqueness
      if (body.customDomain) {
        const existing = await prisma.whiteLabelConfig.findUnique({
          where: { customDomain: body.customDomain },
        })
        if (existing && existing.agencyId !== agencyId) {
          return c.json<ApiResponse>({ error: 'Custom domain already in use' }, 409)
        }
      }

      const config = await prisma.whiteLabelConfig.upsert({
        where: { agencyId },
        update: {
          ...(body.appName && { appName: body.appName }),
          ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
          ...(body.faviconUrl !== undefined && { faviconUrl: body.faviconUrl }),
          ...(body.primaryColor && { primaryColor: body.primaryColor }),
          ...(body.accentColor && { accentColor: body.accentColor }),
          ...(body.customDomain !== undefined && { customDomain: body.customDomain }),
          ...(body.customCss !== undefined && { customCss: body.customCss }),
          ...(body.footerText !== undefined && { footerText: body.footerText }),
          ...(body.isActive !== undefined && { isActive: body.isActive }),
        },
        create: {
          agencyId,
          appName: body.appName || 'Campaign Engine',
          logoUrl: body.logoUrl,
          faviconUrl: body.faviconUrl,
          primaryColor: body.primaryColor || '#e11d48',
          accentColor: body.accentColor || '#f43f5e',
          customDomain: body.customDomain,
          customCss: body.customCss,
          footerText: body.footerText,
          isActive: body.isActive ?? false,
        },
      })

      return c.json<ApiResponse>({
        data: config,
        message: 'White-label config updated',
      })
    } catch (error) {
      console.error('Error updating white-label config:', error)
      return c.json<ApiResponse>({ error: 'Failed to update config' }, 500)
    }
  }
)

// GET /api/whitelabel/resolve/:domain - Resolve custom domain to agency config
whitelabelRouter.get('/resolve/:domain', async (c) => {
  try {
    const domain = c.req.param('domain')

    const config = await prisma.whiteLabelConfig.findUnique({
      where: { customDomain: domain, isActive: true },
    })

    if (!config) {
      return c.json<ApiResponse>({ error: 'Domain not configured' }, 404)
    }

    // Return public config (no sensitive data)
    return c.json<ApiResponse>({
      data: {
        appName: config.appName,
        logoUrl: config.logoUrl,
        faviconUrl: config.faviconUrl,
        primaryColor: config.primaryColor,
        accentColor: config.accentColor,
        footerText: config.footerText,
        customCss: config.customCss,
      },
    })
  } catch (error) {
    console.error('Error resolving domain:', error)
    return c.json<ApiResponse>({ error: 'Failed to resolve domain' }, 500)
  }
})
