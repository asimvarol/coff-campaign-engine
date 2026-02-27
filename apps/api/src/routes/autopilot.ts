import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const autopilotRouter = new Hono()

// GET /api/autopilot/rules - List rules
autopilotRouter.get('/rules', async (c) => {
  try {
    const brandId = c.req.query('brandId')
    const rules = await prisma.autopilotRule.findMany({
      where: brandId ? { brandId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return c.json<ApiResponse>({ data: rules })
  } catch (error) {
    console.error('Error fetching rules:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch rules' }, 500)
  }
})

// POST /api/autopilot/rules - Create rule
autopilotRouter.post('/rules', async (c) => {
  try {
    const body = await c.req.json()

    const rule = await prisma.autopilotRule.create({
      data: {
        brandId: body.brandId,
        name: body.name,
        isActive: body.isActive ?? true,
        conditions: body.conditions,
        conditionLogic: body.conditionLogic || 'AND',
        actions: body.actions,
        maxActionsPerDay: body.maxActionsPerDay || 5,
        cooldownMinutes: body.cooldownMinutes || 360,
      },
    })

    return c.json<ApiResponse>({ data: rule, message: 'Autopilot rule created' }, 201)
  } catch (error) {
    console.error('Error creating rule:', error)
    return c.json<ApiResponse>({ error: 'Failed to create rule' }, 500)
  }
})

// GET /api/autopilot/logs - Execution logs
autopilotRouter.get('/logs', async (c) => {
  try {
    const brandId = c.req.query('brandId')
    // TODO: Join with rules and filter by brand
    const logs = await prisma.autopilotLog.findMany({
      include: { rule: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return c.json<ApiResponse>({ data: logs })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return c.json<ApiResponse>({ error: 'Failed to fetch logs' }, 500)
  }
})

// POST /api/autopilot/check - Manually trigger check
autopilotRouter.post('/check', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: Queue autopilot check job for creative

    return c.json<ApiResponse>({ message: 'Autopilot check queued' })
  } catch (error) {
    console.error('Error checking autopilot:', error)
    return c.json<ApiResponse>({ error: 'Failed to check autopilot' }, 500)
  }
})

// POST /api/autopilot/execute - Execute action
autopilotRouter.post('/execute', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: Execute autopilot action (pause, replace, notify, etc.)

    return c.json<ApiResponse>({ message: 'Action execution queued' })
  } catch (error) {
    console.error('Error executing action:', error)
    return c.json<ApiResponse>({ error: 'Failed to execute action' }, 500)
  }
})
