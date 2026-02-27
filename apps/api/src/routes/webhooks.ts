import { Hono } from 'hono'
import type { ApiResponse } from '@repo/types'

export const webhooksRouter = new Hono()

// POST /api/webhooks/social/instagram - Instagram webhook
webhooksRouter.post('/social/instagram', async (c) => {
  try {
    const body = await c.req.json()
    // TODO: Handle Instagram webhook events (post updates, metrics, etc.)
    console.log('Instagram webhook:', body)

    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling Instagram webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})

// POST /api/webhooks/social/facebook - Facebook webhook
webhooksRouter.post('/social/facebook', async (c) => {
  try {
    const body = await c.req.json()
    console.log('Facebook webhook:', body)

    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling Facebook webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})

// POST /api/webhooks/social/tiktok - TikTok webhook
webhooksRouter.post('/social/tiktok', async (c) => {
  try {
    const body = await c.req.json()
    console.log('TikTok webhook:', body)

    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling TikTok webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})
