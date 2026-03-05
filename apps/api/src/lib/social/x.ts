import type { OAuthTokens, PlatformClient, PublishPayload, PublishResult } from './types'

const X_API = 'https://api.x.com/2'

function getConfig() {
  return {
    clientId: process.env.X_CLIENT_ID || '',
    clientSecret: process.env.X_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/auth/callback/x`,
  }
}

function isConfigured(): boolean {
  return !!(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET)
}

export const xClient: PlatformClient = {
  platform: 'x',

  getAuthUrl(state: string): string {
    const config = getConfig()
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: JSON.stringify({ platform: 'x', state }),
      code_challenge: 'challenge',
      code_challenge_method: 'plain',
    })
    return `https://x.com/i/oauth2/authorize?${params}`
  },

  async exchangeCode(code: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
        code_verifier: 'challenge',
      }),
    })

    if (!res.ok) throw new Error('Failed to exchange code')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 7200) * 1000),
    }
  },

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!res.ok) throw new Error('Failed to refresh token')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 7200) * 1000),
    }
  },

  async publish(tokens: OAuthTokens, payload: PublishPayload): Promise<PublishResult> {
    if (!isConfigured()) {
      return { success: false, error: 'X API not configured' }
    }

    try {
      // Upload media first
      const mediaRes = await fetch('https://upload.x.com/1.1/media/upload.json', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        body: (() => {
          const form = new FormData()
          form.append('media_data', payload.imageUrl)
          return form
        })(),
      })

      let mediaId: string | undefined
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json()
        mediaId = mediaData.media_id_string
      }

      const text = payload.hashtags?.length
        ? `${payload.caption}\n\n${payload.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
        : payload.caption

      const tweetBody: Record<string, unknown> = { text }
      if (mediaId) {
        tweetBody.media = { media_ids: [mediaId] }
      }

      const res = await fetch(`${X_API}/tweets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tweetBody),
      })

      if (!res.ok) throw new Error('Failed to create tweet')
      const data = await res.json()

      return {
        success: true,
        postId: data.data?.id,
        postUrl: `https://x.com/i/status/${data.data?.id}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'X publish failed',
      }
    }
  },

  async deletePost(tokens: OAuthTokens, postId: string): Promise<boolean> {
    const res = await fetch(`${X_API}/tweets/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    })
    return res.ok
  },

  async getMetrics(tokens: OAuthTokens, postId: string): Promise<Record<string, number> | null> {
    try {
      const res = await fetch(
        `${X_API}/tweets/${postId}?tweet.fields=public_metrics`,
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      )
      if (!res.ok) return null
      const data = await res.json()
      return data.data?.public_metrics || null
    } catch {
      return null
    }
  },
}
