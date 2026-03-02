/**
 * Application constants
 */

export const APP_NAME = 'Coff'
export const APP_DESCRIPTION = 'AI-powered marketing campaign management platform'
export const APP_URL = 'https://coff.app'

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'twitter', name: 'X (Twitter)', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
  { id: 'pinterest', name: 'Pinterest', color: '#E60023' },
] as const

export const CAMPAIGN_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'muted' },
  { value: 'scheduled', label: 'Scheduled', color: 'info' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'paused', label: 'Paused', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'default' },
] as const

export const PHOTOSHOOT_TEMPLATES = [
  { id: 'product', name: 'Product Photography', description: 'Clean studio shots' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Real-world scenarios' },
  { id: 'minimal', name: 'Minimalist', description: 'Simple, elegant' },
  { id: 'vibrant', name: 'Vibrant Colors', description: 'Bold and colorful' },
  { id: 'monochrome', name: 'Monochrome', description: 'Black & white' },
] as const

export const DATE_FORMATS = {
  short: 'MMM d',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  full: 'EEEE, MMMM d, yyyy',
  time: 'h:mm a',
  datetime: 'MMM d, yyyy h:mm a',
} as const

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const

export const LIMITS = {
  maxCampaignsPerBrand: 100,
  maxCreativesPerCampaign: 50,
  maxPhotoshootsPerBrand: 50,
  maxImagesPerPhotoshoot: 100,
  maxFileSize: 10 * 1024 * 1024, // 10MB
} as const
