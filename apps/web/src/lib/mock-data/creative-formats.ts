import type { CreativeFormat } from '@repo/types'

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

export function getAllFormatsForPlatforms(platforms: string[]): Array<{
  platform: string
  format: string
} & CreativeFormat> {
  const formats: Array<{ platform: string; format: string } & CreativeFormat> = []
  
  platforms.forEach(platform => {
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
