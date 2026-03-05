export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'x'

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
}

export interface PublishResult {
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
}

export interface PublishPayload {
  imageUrl: string
  caption: string
  hashtags?: string[]
}

export interface PlatformClient {
  platform: SocialPlatform
  getAuthUrl(state: string): string
  exchangeCode(code: string): Promise<OAuthTokens>
  refreshAccessToken(refreshToken: string): Promise<OAuthTokens>
  publish(tokens: OAuthTokens, payload: PublishPayload): Promise<PublishResult>
  deletePost(tokens: OAuthTokens, postId: string): Promise<boolean>
  getMetrics(tokens: OAuthTokens, postId: string): Promise<Record<string, number> | null>
}
