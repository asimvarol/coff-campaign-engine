/**
 * Application-wide constants
 */

export const APP_NAME = 'Coff Campaign Engine'
export const APP_DESCRIPTION = 'AI-powered marketing campaign management platform'
export const APP_URL = 'https://coff.app'

export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'twitter', name: 'Twitter/X', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
] as const

export const CAMPAIGN_STATUSES = [
  { id: 'draft', label: 'Draft', color: 'gray' },
  { id: 'active', label: 'Active', color: 'green' },
  { id: 'paused', label: 'Paused', color: 'yellow' },
  { id: 'completed', label: 'Completed', color: 'blue' },
] as const

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  campaigns: '/campaigns',
  brand: '/brand',
  photoshoot: '/photoshoot',
  publish: '/publish',
  analytics: '/analytics',
  autopilot: '/autopilot',
  agency: '/agency',
} as const
