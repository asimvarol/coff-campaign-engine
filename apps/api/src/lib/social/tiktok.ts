import type { OAuthTokens, PlatformClient, PublishPayload, PublishResult } from './types'

const TIKTOK_API = 'https://open.tiktokapis.com/v2'

function getConfig() {
  return {
    clientKey: process.env.TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/auth/callback/tiktok`,
  }
}

function isConfigured(): boolean {
  return !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET)
}

export const tiktokClient: PlatformClient = {
  platform: 'tiktok',

  getAuthUrl(state: string): string {
    const config = getConfig()
    const params = new URLSearchParams({
      client_key: config.clientKey,
      redirect_uri: config.redirectUri,
      scope: 'user.info.basic,video.publish,video.list',
      response_type: 'code',
      state: JSON.stringify({ platform: 'tiktok', state }),
    })
    return `https://www.tiktok.com/v2/auth/authorize/?${params}`
  },

  async exchangeCode(code: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch(`${TIKTOK_API}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: config.clientKey,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      }),
    })

    if (!res.ok) throw new Error('Failed to exchange code')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 86400) * 1000),
    }
  },

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch(`${TIKTOK_API}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: config.clientKey,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!res.ok) throw new Error('Failed to refresh token')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 86400) * 1000),
    }
  },

  async publish(tokens: OAuthTokens, payload: PublishPayload): Promise<PublishResult> {
    if (!isConfigured()) {
      return { success: false, error: 'TikTok API not configured' }
    }

    try {
      const text = payload.hashtags?.length
        ? `${payload.caption} ${payload.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
        : payload.caption

      // TikTok photo post via Content Posting API
      const res = await fetch(`${TIKTOK_API}/post/publish/content/init/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_info: {
            title: text,
            privacy_level: 'PUBLIC_TO_EVERYONE',
          },
          source_info: {
            source: 'PULL_FROM_URL',
            photo_images: [payload.imageUrl],
          },
          post_mode: 'DIRECT_POST',
          media_type: 'PHOTO',
        }),
      })

      if (!res.ok) throw new Error('Failed to init publish')
      const data = await res.json()

      return {
        success: true,
        postId: data.data?.publish_id,
        postUrl: `https://www.tiktok.com/@user/photo/${data.data?.publish_id}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'TikTok publish failed',
      }
    }
  },

  async deletePost(_tokens: OAuthTokens, _postId: string): Promise<boolean> {
    // TikTok doesn't support programmatic deletion via API
    return false
  },

  async getMetrics(tokens: OAuthTokens, postId: string): Promise<Record<string, number> | null> {
    try {
      const res = await fetch(`${TIKTOK_API}/video/query/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: { video_ids: [postId] },
          fields: ['like_count', 'comment_count', 'share_count', 'view_count'],
        }),
      })

      if (!res.ok) return null
      const data = await res.json()
      const video = data.data?.videos?.[0]
      if (!video) return null

      return {
        likes: video.like_count || 0,
        comments: video.comment_count || 0,
        shares: video.share_count || 0,
        views: video.view_count || 0,
      }
    } catch {
      return null
    }
  },
}
