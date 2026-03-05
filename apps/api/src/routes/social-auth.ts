import { Hono } from 'hono'
import { prisma } from '@repo/db'
import type { ApiResponse } from '@repo/types'
import { getSocialClient, getSupportedPlatforms } from '../lib/social'

export const socialAuthRouter = new Hono()

// GET /api/auth/social/platforms - List available platforms
socialAuthRouter.get('/platforms', (c) => {
  const platforms = getSupportedPlatforms().map((p) => ({
    id: p,
    configured: (() => {
      switch (p) {
        case 'instagram':
        case 'facebook':
          return !!(process.env.META_APP_ID && process.env.META_APP_SECRET)
        case 'x':
          return !!(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET)
        case 'linkedin':
          return !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
        case 'tiktok':
          return !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET)
        default:
          return false
      }
    })(),
  }))

  return c.json<ApiResponse>({ data: platforms })
})

// GET /api/auth/social/connect/:platform - Get OAuth URL
socialAuthRouter.get('/connect/:platform', async (c) => {
  try {
    const platform = c.req.param('platform')
    const brandId = c.req.query('brandId')

    if (!brandId) {
      return c.json<ApiResponse>({ error: 'brandId is required' }, 400)
    }

    const client = getSocialClient(platform)
    if (!client) {
      return c.json<ApiResponse>({ error: `Unsupported platform: ${platform}` }, 400)
    }

    const state = btoa(JSON.stringify({ brandId, platform }))
    const authUrl = client.getAuthUrl(state)

    return c.json<ApiResponse>({
      data: { authUrl, platform },
    })
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return c.json<ApiResponse>({ error: 'Failed to generate auth URL' }, 500)
  }
})

// GET /api/auth/callback/:platform - OAuth callback
socialAuthRouter.get('/callback/:platform', async (c) => {
  try {
    const platform = c.req.param('platform')
    const code = c.req.query('code')
    const stateParam = c.req.query('state')
    const error = c.req.query('error')

    if (error) {
      const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'
      return c.redirect(`${webUrl}/publish/accounts?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      return c.json<ApiResponse>({ error: 'Authorization code is required' }, 400)
    }

    // Handle Meta callback (shared for instagram/facebook)
    const effectivePlatform = platform === 'meta' ? 'instagram' : platform
    const client = getSocialClient(effectivePlatform)
    if (!client) {
      return c.json<ApiResponse>({ error: `Unsupported platform: ${platform}` }, 400)
    }

    // Exchange code for tokens
    const tokens = await client.exchangeCode(code)

    // Parse state to get brandId
    let brandId = ''
    if (stateParam) {
      try {
        const parsed = JSON.parse(atob(stateParam))
        brandId = parsed.brandId || ''
      } catch {
        // Try parsing state directly from JSON
        try {
          const parsed = JSON.parse(stateParam)
          brandId = parsed.brandId || ''
        } catch {
          // State parsing failed
        }
      }
    }

    if (!brandId) {
      return c.json<ApiResponse>({ error: 'Brand ID not found in state' }, 400)
    }

    // Get account info (platform-specific)
    let accountId = `${effectivePlatform}-${Date.now()}`
    let accountName = effectivePlatform

    // Try to get user info from the platform
    try {
      if (effectivePlatform === 'instagram' || effectivePlatform === 'facebook') {
        const meRes = await fetch(`https://graph.facebook.com/v21.0/me?fields=name,id&access_token=${tokens.accessToken}`)
        if (meRes.ok) {
          const meData = await meRes.json()
          accountId = meData.id
          accountName = meData.name
        }
      } else if (effectivePlatform === 'x') {
        const meRes = await fetch('https://api.x.com/2/users/me', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        if (meRes.ok) {
          const meData = await meRes.json()
          accountId = meData.data?.id || accountId
          accountName = meData.data?.username || accountName
        }
      } else if (effectivePlatform === 'linkedin') {
        const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        if (meRes.ok) {
          const meData = await meRes.json()
          accountId = meData.sub || accountId
          accountName = meData.name || accountName
        }
      }
    } catch {
      // Use defaults if user info fetch fails
    }

    // Upsert social account
    await prisma.socialAccount.upsert({
      where: {
        brandId_platform_accountId: {
          brandId,
          platform: effectivePlatform,
          accountId,
        },
      },
      update: {
        accountName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
        isActive: true,
      },
      create: {
        brandId,
        platform: effectivePlatform,
        accountId,
        accountName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
      },
    })

    // Redirect back to accounts page
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'
    return c.redirect(`${webUrl}/publish/accounts?connected=${effectivePlatform}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'
    return c.redirect(`${webUrl}/publish/accounts?error=callback_failed`)
  }
})

// POST /api/auth/social/refresh/:accountId - Refresh token
socialAuthRouter.post('/refresh/:accountId', async (c) => {
  try {
    const accountId = c.req.param('accountId')

    const account = await prisma.socialAccount.findUnique({ where: { id: accountId } })
    if (!account) {
      return c.json<ApiResponse>({ error: 'Account not found' }, 404)
    }

    if (!account.refreshToken) {
      return c.json<ApiResponse>({ error: 'No refresh token available' }, 400)
    }

    const client = getSocialClient(account.platform)
    if (!client) {
      return c.json<ApiResponse>({ error: `Unsupported platform: ${account.platform}` }, 400)
    }

    const tokens = await client.refreshAccessToken(account.refreshToken)

    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || account.refreshToken,
        tokenExpiresAt: tokens.expiresAt,
      },
    })

    return c.json<ApiResponse>({ message: 'Token refreshed successfully' })
  } catch (error) {
    console.error('Token refresh error:', error)
    return c.json<ApiResponse>({ error: 'Failed to refresh token' }, 500)
  }
})
