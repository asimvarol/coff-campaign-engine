import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'

export const webhooksRouter = new Hono()

// GET /api/webhooks/social/instagram - Instagram webhook verification (challenge)
webhooksRouter.get('/social/instagram', (c) => {
  const mode = c.req.query('hub.mode')
  const token = c.req.query('hub.verify_token')
  const challenge = c.req.query('hub.challenge')

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'coff-webhook-verify'

  if (mode === 'subscribe' && token === verifyToken) {
    return c.text(challenge || '')
  }
  return c.text('Forbidden', 403)
})

// POST /api/webhooks/social/instagram - Instagram webhook events
webhooksRouter.post('/social/instagram', async (c) => {
  try {
    const body = await c.req.json()

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'mentions' || change.field === 'comments') {
          console.log(`Instagram ${change.field} event:`, change.value)
        }
      }

      // Media insights update
      if (entry.id && entry.media) {
        for (const media of entry.media) {
          const creative = await prisma.creative.findFirst({
            where: { postId: media.media_id },
          })
          if (creative) {
            await prisma.creativePerformance.create({
              data: {
                creativeId: creative.id,
                reach: media.reach || 0,
                impressions: media.impressions || 0,
                likes: media.likes || 0,
                comments: media.comments || 0,
                shares: media.shares || 0,
                saves: media.saved || 0,
              },
            })
          }
        }
      }
    }

    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling Instagram webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})

// GET /api/webhooks/social/facebook - Facebook webhook verification
webhooksRouter.get('/social/facebook', (c) => {
  const mode = c.req.query('hub.mode')
  const token = c.req.query('hub.verify_token')
  const challenge = c.req.query('hub.challenge')

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'coff-webhook-verify'

  if (mode === 'subscribe' && token === verifyToken) {
    return c.text(challenge || '')
  }
  return c.text('Forbidden', 403)
})

// POST /api/webhooks/social/facebook - Facebook webhook events
webhooksRouter.post('/social/facebook', async (c) => {
  try {
    const body = await c.req.json()

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'feed') {
          const postId = change.value?.post_id
          if (postId) {
            const creative = await prisma.creative.findFirst({
              where: { postId },
            })
            if (creative && change.value?.verb === 'remove') {
              await prisma.creative.update({
                where: { id: creative.id },
                data: { publishStatus: 'REMOVED' },
              })
            }
          }
        }
      }
    }

    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling Facebook webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})

// POST /api/webhooks/social/tiktok - TikTok webhook events
webhooksRouter.post('/social/tiktok', async (c) => {
  try {
    const body = await c.req.json()

    // TikTok sends publish status updates
    if (body.event === 'content.publish.complete') {
      const publishId = body.publish_id
      const status = body.publish_status

      if (publishId) {
        const creative = await prisma.creative.findFirst({
          where: { postId: publishId },
        })
        if (creative) {
          await prisma.creative.update({
            where: { id: creative.id },
            data: {
              publishStatus: status === 'SUCCESS' ? 'PUBLISHED' : 'FAILED',
            },
          })
        }
      }
    }

    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling TikTok webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})

// POST /api/webhooks/social/linkedin - LinkedIn webhook events
webhooksRouter.post('/social/linkedin', async (c) => {
  try {
    const body = await c.req.json()
    console.log('LinkedIn webhook:', JSON.stringify(body).substring(0, 200))
    return c.json<ApiResponse>({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error handling LinkedIn webhook:', error)
    return c.json<ApiResponse>({ error: 'Failed to handle webhook' }, 500)
  }
})
