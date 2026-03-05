import type { OAuthConfig, OAuthTokens, PlatformClient, PublishPayload, PublishResult } from './types'

const GRAPH_API = 'https://graph.facebook.com/v21.0'

function getConfig(): OAuthConfig {
  return {
    clientId: process.env.META_APP_ID || '',
    clientSecret: process.env.META_APP_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/auth/callback/meta`,
    scopes: [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_insights',
    ],
  }
}

function isConfigured(): boolean {
  return !!(process.env.META_APP_ID && process.env.META_APP_SECRET)
}

export const instagramClient: PlatformClient = {
  platform: 'instagram',

  getAuthUrl(state: string): string {
    const config = getConfig()
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(','),
      response_type: 'code',
      state: JSON.stringify({ platform: 'instagram', state }),
    })
    return `https://www.facebook.com/v21.0/dialog/oauth?${params}`
  },

  async exchangeCode(code: string): Promise<OAuthTokens> {
    const config = getConfig()

    // Exchange code for short-lived token
    const tokenRes = await fetch(`${GRAPH_API}/oauth/access_token?${new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      code,
    })}`)

    if (!tokenRes.ok) throw new Error('Failed to exchange code')
    const tokenData = await tokenRes.json()

    // Exchange for long-lived token
    const longRes = await fetch(`${GRAPH_API}/oauth/access_token?${new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      fb_exchange_token: tokenData.access_token,
    })}`)

    if (!longRes.ok) throw new Error('Failed to get long-lived token')
    const longData = await longRes.json()

    return {
      accessToken: longData.access_token,
      expiresAt: new Date(Date.now() + (longData.expires_in || 5184000) * 1000),
    }
  },

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch(`${GRAPH_API}/oauth/access_token?${new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      fb_exchange_token: refreshToken,
    })}`)

    if (!res.ok) throw new Error('Failed to refresh token')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
    }
  },

  async publish(tokens: OAuthTokens, payload: PublishPayload): Promise<PublishResult> {
    if (!isConfigured()) {
      return { success: false, error: 'Meta API not configured' }
    }

    try {
      // Get Instagram business account ID
      const accountsRes = await fetch(
        `${GRAPH_API}/me/accounts?fields=instagram_business_account&access_token=${tokens.accessToken}`
      )
      if (!accountsRes.ok) throw new Error('Failed to get accounts')
      const accountsData = await accountsRes.json()
      const igAccountId = accountsData.data?.[0]?.instagram_business_account?.id
      if (!igAccountId) throw new Error('No Instagram business account found')

      // Create media container
      const caption = payload.hashtags?.length
        ? `${payload.caption}\n\n${payload.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
        : payload.caption

      const containerRes = await fetch(`${GRAPH_API}/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: payload.imageUrl,
          caption,
          access_token: tokens.accessToken,
        }),
      })
      if (!containerRes.ok) throw new Error('Failed to create media container')
      const containerData = await containerRes.json()

      // Publish container
      const publishRes = await fetch(`${GRAPH_API}/${igAccountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: tokens.accessToken,
        }),
      })
      if (!publishRes.ok) throw new Error('Failed to publish')
      const publishData = await publishRes.json()

      // Get permalink
      const mediaRes = await fetch(
        `${GRAPH_API}/${publishData.id}?fields=permalink&access_token=${tokens.accessToken}`
      )
      const mediaData = mediaRes.ok ? await mediaRes.json() : {}

      return {
        success: true,
        postId: publishData.id,
        postUrl: mediaData.permalink || `https://www.instagram.com/p/${publishData.id}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Instagram publish failed',
      }
    }
  },

  async deletePost(tokens: OAuthTokens, postId: string): Promise<boolean> {
    const res = await fetch(`${GRAPH_API}/${postId}?access_token=${tokens.accessToken}`, {
      method: 'DELETE',
    })
    return res.ok
  },

  async getMetrics(tokens: OAuthTokens, postId: string): Promise<Record<string, number> | null> {
    try {
      const res = await fetch(
        `${GRAPH_API}/${postId}/insights?metric=impressions,reach,engagement,saved&access_token=${tokens.accessToken}`
      )
      if (!res.ok) return null
      const data = await res.json()

      const metrics: Record<string, number> = {}
      for (const item of data.data || []) {
        metrics[item.name] = item.values?.[0]?.value || 0
      }
      return metrics
    } catch {
      return null
    }
  },
}

export const facebookClient: PlatformClient = {
  platform: 'facebook',

  getAuthUrl(state: string): string {
    const config = getConfig()
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'pages_show_list,pages_manage_posts,pages_read_engagement',
      response_type: 'code',
      state: JSON.stringify({ platform: 'facebook', state }),
    })
    return `https://www.facebook.com/v21.0/dialog/oauth?${params}`
  },

  exchangeCode: instagramClient.exchangeCode,
  refreshAccessToken: instagramClient.refreshAccessToken,

  async publish(tokens: OAuthTokens, payload: PublishPayload): Promise<PublishResult> {
    if (!isConfigured()) {
      return { success: false, error: 'Meta API not configured' }
    }

    try {
      // Get page access token
      const pagesRes = await fetch(
        `${GRAPH_API}/me/accounts?access_token=${tokens.accessToken}`
      )
      if (!pagesRes.ok) throw new Error('Failed to get pages')
      const pagesData = await pagesRes.json()
      const page = pagesData.data?.[0]
      if (!page) throw new Error('No Facebook page found')

      const caption = payload.hashtags?.length
        ? `${payload.caption}\n\n${payload.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
        : payload.caption

      const res = await fetch(`${GRAPH_API}/${page.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: payload.imageUrl,
          message: caption,
          access_token: page.access_token,
        }),
      })

      if (!res.ok) throw new Error('Failed to publish')
      const data = await res.json()

      return {
        success: true,
        postId: data.id,
        postUrl: `https://www.facebook.com/${data.id}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Facebook publish failed',
      }
    }
  },

  async deletePost(tokens: OAuthTokens, postId: string): Promise<boolean> {
    const res = await fetch(`${GRAPH_API}/${postId}?access_token=${tokens.accessToken}`, {
      method: 'DELETE',
    })
    return res.ok
  },

  async getMetrics(tokens: OAuthTokens, postId: string): Promise<Record<string, number> | null> {
    try {
      const res = await fetch(
        `${GRAPH_API}/${postId}?fields=shares,reactions.summary(total_count),comments.summary(total_count)&access_token=${tokens.accessToken}`
      )
      if (!res.ok) return null
      const data = await res.json()
      return {
        reactions: data.reactions?.summary?.total_count || 0,
        comments: data.comments?.summary?.total_count || 0,
        shares: data.shares?.count || 0,
      }
    } catch {
      return null
    }
  },
}
