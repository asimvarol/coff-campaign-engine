import type { OAuthTokens, PlatformClient, PublishPayload, PublishResult } from './types'

const LINKEDIN_API = 'https://api.linkedin.com/v2'

function getConfig() {
  return {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/auth/callback/linkedin`,
  }
}

function isConfigured(): boolean {
  return !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
}

export const linkedinClient: PlatformClient = {
  platform: 'linkedin',

  getAuthUrl(state: string): string {
    const config = getConfig()
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'openid profile w_member_social r_organization_social w_organization_social',
      state: JSON.stringify({ platform: 'linkedin', state }),
    })
    return `https://www.linkedin.com/oauth/v2/authorization?${params}`
  },

  async exchangeCode(code: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    })

    if (!res.ok) throw new Error('Failed to exchange code')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
    }
  },

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = getConfig()
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    })

    if (!res.ok) throw new Error('Failed to refresh token')
    const data = await res.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
    }
  },

  async publish(tokens: OAuthTokens, payload: PublishPayload): Promise<PublishResult> {
    if (!isConfigured()) {
      return { success: false, error: 'LinkedIn API not configured' }
    }

    try {
      // Get user profile URN
      const profileRes = await fetch(`${LINKEDIN_API}/userinfo`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })
      if (!profileRes.ok) throw new Error('Failed to get profile')
      const profile = await profileRes.json()
      const authorUrn = `urn:li:person:${profile.sub}`

      // Register image upload
      const registerRes = await fetch(`${LINKEDIN_API}/assets?action=registerUpload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: authorUrn,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            }],
          },
        }),
      })

      let mediaAsset: string | undefined
      if (registerRes.ok) {
        const registerData = await registerRes.json()
        const uploadUrl = registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
        mediaAsset = registerData.value?.asset

        if (uploadUrl) {
          // Download image and upload to LinkedIn
          const imageRes = await fetch(payload.imageUrl)
          const imageBlob = await imageRes.blob()
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
              'Content-Type': 'image/png',
            },
            body: imageBlob,
          })
        }
      }

      const text = payload.hashtags?.length
        ? `${payload.caption}\n\n${payload.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
        : payload.caption

      const postBody: Record<string, unknown> = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: mediaAsset ? 'IMAGE' : 'NONE',
            ...(mediaAsset && {
              media: [{
                status: 'READY',
                media: mediaAsset,
              }],
            }),
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }

      const res = await fetch(`${LINKEDIN_API}/ugcPosts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postBody),
      })

      if (!res.ok) throw new Error('Failed to publish')
      const postId = res.headers.get('x-restli-id') || ''

      return {
        success: true,
        postId,
        postUrl: `https://www.linkedin.com/feed/update/${postId}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'LinkedIn publish failed',
      }
    }
  },

  async deletePost(tokens: OAuthTokens, postId: string): Promise<boolean> {
    const res = await fetch(`${LINKEDIN_API}/ugcPosts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    })
    return res.ok
  },

  async getMetrics(_tokens: OAuthTokens, _postId: string): Promise<Record<string, number> | null> {
    // LinkedIn analytics require organization-level access
    return null
  },
}
