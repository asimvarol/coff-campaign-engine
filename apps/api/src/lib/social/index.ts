import type { PlatformClient, SocialPlatform } from './types'
import { instagramClient, facebookClient } from './meta'
import { xClient } from './x'
import { linkedinClient } from './linkedin'
import { tiktokClient } from './tiktok'

export type { SocialPlatform, OAuthTokens, PublishResult, PublishPayload, PlatformClient } from './types'

const clients: Record<SocialPlatform, PlatformClient> = {
  instagram: instagramClient,
  facebook: facebookClient,
  x: xClient,
  linkedin: linkedinClient,
  tiktok: tiktokClient,
}

export function getSocialClient(platform: string): PlatformClient | null {
  return clients[platform as SocialPlatform] || null
}

export function getSupportedPlatforms(): SocialPlatform[] {
  return Object.keys(clients) as SocialPlatform[]
}
