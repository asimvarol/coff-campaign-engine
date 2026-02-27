/**
 * Mock data for Publish Hub module
 */

export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'x' | 'pinterest' | 'youtube'

export type PostStatus = 'queued' | 'scheduled' | 'publishing' | 'published' | 'failed'

export interface PlatformDefinition {
  id: Platform
  name: string
  color: string // OKLCH color
  colorClass: string // Tailwind class
  icon: string
}

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

// Mock connected accounts
export const mockConnectedAccounts: ConnectedAccount[] = [
  {
    id: '1',
    platform: 'instagram',
    username: 'brandname.official',
    handle: '@brandname.official',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BO',
    status: 'connected',
    lastUsed: '2026-02-27T10:30:00Z',
    connectedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: '2',
    platform: 'facebook',
    username: 'Brand Name Page',
    handle: '@brandnamepage',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BP',
    status: 'connected',
    lastUsed: '2026-02-26T14:20:00Z',
    connectedAt: '2026-02-01T09:05:00Z',
  },
  {
    id: '3',
    platform: 'tiktok',
    username: 'brandname_official',
    handle: '@brandname_official',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BT',
    status: 'connected',
    lastUsed: '2026-02-25T16:00:00Z',
    connectedAt: '2026-02-05T11:00:00Z',
  },
  {
    id: '4',
    platform: 'linkedin',
    username: 'Brand Name Inc.',
    handle: 'brand-name-inc',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BL',
    status: 'connected',
    lastUsed: '2026-02-24T09:00:00Z',
    connectedAt: '2026-02-03T08:00:00Z',
  },
  {
    id: '5',
    platform: 'x',
    username: 'Brand Name',
    handle: '@BrandName',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BX',
    status: 'connected',
    lastUsed: '2026-02-27T08:15:00Z',
    connectedAt: '2026-02-02T10:30:00Z',
  },
  {
    id: '6',
    platform: 'pinterest',
    username: 'Brand Name Pins',
    handle: '@brandnamepins',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BN',
    status: 'expired',
    lastUsed: '2026-01-15T12:00:00Z',
    connectedAt: '2025-12-01T09:00:00Z',
  },
  {
    id: '7',
    platform: 'youtube',
    username: 'Brand Name Channel',
    handle: '@brandnamechannel',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BY',
    status: 'connected',
    lastUsed: '2026-02-20T15:00:00Z',
    connectedAt: '2026-01-10T14:00:00Z',
  },
]

// Generate mock scheduled posts for next 2 weeks
const now = new Date('2026-02-27T20:00:00Z')
const creativeThumbnails = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1617957743089-7ee7e39f8943?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=200&h=200&fit=crop',
]

export const mockScheduledPosts: ScheduledPost[] = [
  // Published posts (last 5 days)
  {
    id: '1',
    creativeId: 'cr-1',
    creativeThumbnail: creativeThumbnails[0],
    platform: 'instagram',
    scheduledFor: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    caption: '✨ New collection drop! Link in bio.',
    status: 'published',
    postUrl: 'https://instagram.com/p/abc123',
  },
  {
    id: '2',
    creativeId: 'cr-2',
    creativeThumbnail: creativeThumbnails[1],
    platform: 'facebook',
    scheduledFor: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Introducing our latest innovation! 🚀',
    status: 'published',
    postUrl: 'https://facebook.com/posts/xyz789',
  },
  {
    id: '3',
    creativeId: 'cr-3',
    creativeThumbnail: creativeThumbnails[2],
    platform: 'x',
    scheduledFor: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Big news coming tomorrow! Stay tuned 👀',
    status: 'published',
    postUrl: 'https://x.com/brandname/status/123456',
  },
  {
    id: '4',
    creativeId: 'cr-4',
    creativeThumbnail: creativeThumbnails[3],
    platform: 'linkedin',
    scheduledFor: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Excited to share our Q1 achievements with the team.',
    status: 'published',
    postUrl: 'https://linkedin.com/posts/activity-123',
  },
  {
    id: '5',
    creativeId: 'cr-5',
    creativeThumbnail: creativeThumbnails[4],
    platform: 'tiktok',
    scheduledFor: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Behind the scenes of our creative process 🎬 #BTS',
    status: 'published',
    postUrl: 'https://tiktok.com/@brand/video/987654',
  },

  // Failed post
  {
    id: '6',
    creativeId: 'cr-1',
    creativeThumbnail: creativeThumbnails[0],
    platform: 'pinterest',
    scheduledFor: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    caption: 'Design inspiration for minimalist spaces',
    status: 'failed',
    error: 'Authentication expired. Please reconnect your Pinterest account.',
  },

  // Scheduled posts (next 2 weeks)
  {
    id: '7',
    creativeId: 'cr-2',
    creativeThumbnail: creativeThumbnails[1],
    platform: 'instagram',
    scheduledFor: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    caption: 'Weekend vibes ☀️ #WeekendMode',
    status: 'scheduled',
  },
  {
    id: '8',
    creativeId: 'cr-3',
    creativeThumbnail: creativeThumbnails[2],
    platform: 'facebook',
    scheduledFor: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    caption: 'Join us for our exclusive webinar this Tuesday!',
    status: 'scheduled',
  },
  {
    id: '9',
    creativeId: 'cr-4',
    creativeThumbnail: creativeThumbnails[3],
    platform: 'instagram',
    scheduledFor: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Monday motivation 💪',
    status: 'scheduled',
  },
  {
    id: '10',
    creativeId: 'cr-5',
    creativeThumbnail: creativeThumbnails[4],
    platform: 'linkedin',
    scheduledFor: new Date(now.getTime() + 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Thought leadership: The future of sustainable business practices',
    status: 'scheduled',
  },
  {
    id: '11',
    creativeId: 'cr-1',
    creativeThumbnail: creativeThumbnails[0],
    platform: 'tiktok',
    scheduledFor: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Quick tutorial: How to get the look 🎨 #Tutorial',
    status: 'scheduled',
  },
  {
    id: '12',
    creativeId: 'cr-2',
    creativeThumbnail: creativeThumbnails[1],
    platform: 'x',
    scheduledFor: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Throwback to our launch event! 🎉 #TBT',
    status: 'scheduled',
  },
  {
    id: '13',
    creativeId: 'cr-3',
    creativeThumbnail: creativeThumbnails[2],
    platform: 'instagram',
    scheduledFor: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Behind every great product is an even greater team 👥',
    status: 'scheduled',
  },
  {
    id: '14',
    creativeId: 'cr-4',
    creativeThumbnail: creativeThumbnails[3],
    platform: 'facebook',
    scheduledFor: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Customer testimonials that warm our hearts ❤️',
    status: 'scheduled',
  },
  {
    id: '15',
    creativeId: 'cr-5',
    creativeThumbnail: creativeThumbnails[4],
    platform: 'linkedin',
    scheduledFor: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    caption: "We're hiring! Join our growing team of innovators.",
    status: 'scheduled',
  },
  {
    id: '16',
    creativeId: 'cr-1',
    creativeThumbnail: creativeThumbnails[0],
    platform: 'instagram',
    scheduledFor: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Sunday reset with our favorite products ✨',
    status: 'scheduled',
  },
  {
    id: '17',
    creativeId: 'cr-2',
    creativeThumbnail: creativeThumbnails[1],
    platform: 'tiktok',
    scheduledFor: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'POV: You just discovered the perfect... #POV #Relatable',
    status: 'scheduled',
  },
  {
    id: '18',
    creativeId: 'cr-3',
    creativeThumbnail: creativeThumbnails[2],
    platform: 'x',
    scheduledFor: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Hot take: Quality > Quantity. Always. 🔥',
    status: 'scheduled',
  },
  {
    id: '19',
    creativeId: 'cr-4',
    creativeThumbnail: creativeThumbnails[3],
    platform: 'instagram',
    scheduledFor: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'New blog post: 10 tips for better productivity 📝',
    status: 'scheduled',
  },
  {
    id: '20',
    creativeId: 'cr-5',
    creativeThumbnail: creativeThumbnails[4],
    platform: 'facebook',
    scheduledFor: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    caption: 'Flash sale alert! 24 hours only 🔥',
    status: 'scheduled',
  },
]

// Best time suggestions
export const mockBestTimes: BestTimeSlot[] = [
  {
    platform: 'instagram',
    time: '10:00',
    score: 92,
    reason: 'Highest engagement for lifestyle brands on weekdays',
  },
  {
    platform: 'instagram',
    time: '14:00',
    score: 88,
    reason: 'Secondary peak during lunch hours',
  },
  {
    platform: 'instagram',
    time: '19:00',
    score: 85,
    reason: 'Evening scroll peak',
  },
  {
    platform: 'facebook',
    time: '12:00',
    score: 90,
    reason: 'Peak lunch break browsing',
  },
  {
    platform: 'facebook',
    time: '15:00',
    score: 86,
    reason: 'Afternoon engagement spike',
  },
  {
    platform: 'tiktok',
    time: '07:00',
    score: 93,
    reason: 'Morning commute peak',
  },
  {
    platform: 'tiktok',
    time: '18:00',
    score: 95,
    reason: 'After-work highest engagement',
  },
  {
    platform: 'linkedin',
    time: '08:00',
    score: 91,
    reason: 'Start of business day',
  },
  {
    platform: 'linkedin',
    time: '12:00',
    score: 87,
    reason: 'Lunch break professional browsing',
  },
  {
    platform: 'x',
    time: '09:00',
    score: 89,
    reason: 'Morning news cycle',
  },
  {
    platform: 'x',
    time: '17:00',
    score: 91,
    reason: 'End of workday engagement',
  },
  {
    platform: 'pinterest',
    time: '20:00',
    score: 88,
    reason: 'Evening inspiration browsing',
  },
  {
    platform: 'youtube',
    time: '19:00',
    score: 94,
    reason: 'Prime video viewing time',
  },
]

// Helper to get platform definition
export function getPlatform(id: Platform): PlatformDefinition | undefined {
  return platforms.find((p) => p.id === id)
}

// Stats for dashboard
export function getPublishStats() {
  const total = mockScheduledPosts.length
  const scheduled = mockScheduledPosts.filter((p) => p.status === 'scheduled').length
  const published = mockScheduledPosts.filter((p) => p.status === 'published').length
  const failed = mockScheduledPosts.filter((p) => p.status === 'failed').length

  return {
    total,
    scheduled,
    published,
    failed,
  }
}

// Recent activity (last 10 posts)
export function getRecentActivity() {
  return [...mockScheduledPosts]
    .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())
    .slice(0, 10)
}
