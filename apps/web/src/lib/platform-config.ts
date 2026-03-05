/**
 * Platform configuration — formats, labels, colors, and type definitions
 */
import type { CreativeFormat } from '@repo/types'

// ── Platform types ──────────────────────────────────────────────────

export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'x' | 'pinterest' | 'youtube'

export type PostStatus = 'queued' | 'scheduled' | 'publishing' | 'published' | 'failed'

export interface PlatformDefinition {
  id: Platform
  name: string
  color: string // OKLCH color
  colorClass: string // Tailwind class
  icon: string
}

export interface ConnectedAccount {
  id: string
  platform: Platform
  username: string
  handle: string
  avatar: string
  status: 'connected' | 'expired'
  lastUsed: string
  connectedAt: string
}

export interface ScheduledPost {
  id: string
  creativeId: string
  creativeThumbnail: string
  platform: Platform
  scheduledFor: string
  caption: string
  status: PostStatus
  postUrl?: string
  error?: string
}

export interface BestTimeSlot {
  platform: Platform
  time: string
  score: number // 0-100
  reason: string
}

// ── Platform definitions ────────────────────────────────────────────

export const platforms: PlatformDefinition[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: 'oklch(0.66 0.21 354)',
    colorClass: 'bg-[oklch(0.66_0.21_354)]',
    icon: '📷',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: 'oklch(0.55 0.18 240)',
    colorClass: 'bg-[oklch(0.55_0.18_240)]',
    icon: '👥',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'oklch(0.2 0 0)',
    colorClass: 'bg-[oklch(0.2_0_0)]',
    icon: '🎵',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'oklch(0.48 0.14 240)',
    colorClass: 'bg-[oklch(0.48_0.14_240)]',
    icon: '💼',
  },
  {
    id: 'x',
    name: 'X',
    color: 'oklch(0.4 0 0)',
    colorClass: 'bg-[oklch(0.4_0_0)]',
    icon: '𝕏',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: 'oklch(0.52 0.20 360)',
    colorClass: 'bg-[oklch(0.52_0.20_360)]',
    icon: '📌',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: 'oklch(0.54 0.22 30)',
    colorClass: 'bg-[oklch(0.54_0.22_30)]',
    icon: '▶️',
  },
]

/** Get platform definition by id */
export function getPlatform(id: Platform): PlatformDefinition | undefined {
  return platforms.find((p) => p.id === id)
}

// ── Creative format specifications ──────────────────────────────────

export const PLATFORM_FORMATS: Record<string, Record<string, CreativeFormat>> = {
  instagram: {
    feed: { width: 1080, height: 1080, label: 'Feed (1:1)' },
    feedPortrait: { width: 1080, height: 1350, label: 'Feed (4:5)' },
    story: { width: 1080, height: 1920, label: 'Story (9:16)' },
    reels: { width: 1080, height: 1920, label: 'Reels (9:16)' },
    carousel: { width: 1080, height: 1080, label: 'Carousel', maxSlides: 10 },
  },
  facebook: {
    feed: { width: 1200, height: 630, label: 'Feed' },
    story: { width: 1080, height: 1920, label: 'Story' },
    cover: { width: 820, height: 312, label: 'Cover' },
    ad: { width: 1200, height: 628, label: 'Ad' },
  },
  tiktok: {
    video: { width: 1080, height: 1920, label: 'Video (9:16)' },
    photo: { width: 1080, height: 1920, label: 'Photo' },
  },
  linkedin: {
    post: { width: 1200, height: 627, label: 'Post' },
    carousel: { width: 1080, height: 1080, label: 'Carousel' },
    banner: { width: 1584, height: 396, label: 'Banner' },
  },
  x: {
    post: { width: 1600, height: 900, label: 'Post (16:9)' },
    header: { width: 1500, height: 500, label: 'Header' },
  },
  pinterest: {
    pin: { width: 1000, height: 1500, label: 'Pin (2:3)' },
    ideaPin: { width: 1080, height: 1920, label: 'Idea Pin' },
  },
  youtube: {
    thumbnail: { width: 1280, height: 720, label: 'Thumbnail' },
    short: { width: 1080, height: 1920, label: 'Short' },
  },
  googleAds: {
    leaderboard: { width: 728, height: 90, label: 'Leaderboard' },
    mediumRect: { width: 300, height: 250, label: 'Medium Rectangle' },
    largeRect: { width: 336, height: 280, label: 'Large Rectangle' },
    responsive: { width: 1200, height: 628, label: 'Responsive Display' },
  },
}

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  pinterest: 'Pinterest',
  youtube: 'YouTube',
  googleAds: 'Google Ads',
}

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  tiktok: '#000000',
  linkedin: '#0A66C2',
  x: '#000000',
  pinterest: '#E60023',
  youtube: '#FF0000',
  googleAds: '#4285F4',
}

export function getAllFormatsForPlatforms(platformIds: string[]): Array<{
  platform: string
  format: string
} & CreativeFormat> {
  const formats: Array<{ platform: string; format: string } & CreativeFormat> = []

  platformIds.forEach(platform => {
    const platformFormats = PLATFORM_FORMATS[platform]
    if (platformFormats) {
      Object.entries(platformFormats).forEach(([formatKey, formatData]) => {
        formats.push({
          platform,
          format: formatKey,
          ...formatData,
        })
      })
    }
  })

  return formats
}
