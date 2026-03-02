/**
 * Analytics event tracking
 * Centralized event definitions
 */

export const events = {
  // Page views
  pageView: (page: string) => ({
    event: 'page_view',
    page,
  }),

  // User actions
  userSignIn: (method: string) => ({
    event: 'user_sign_in',
    method,
  }),

  userSignOut: () => ({
    event: 'user_sign_out',
  }),

  // Campaign actions
  campaignCreate: (campaignId: string) => ({
    event: 'campaign_create',
    campaign_id: campaignId,
  }),

  campaignPublish: (campaignId: string) => ({
    event: 'campaign_publish',
    campaign_id: campaignId,
  }),

  // Brand actions
  brandCreate: (brandId: string) => ({
    event: 'brand_create',
    brand_id: brandId,
  }),

  brandAnalyze: (brandId: string) => ({
    event: 'brand_analyze',
    brand_id: brandId,
  }),

  // Photoshoot actions
  photoshootCreate: (templateId: string) => ({
    event: 'photoshoot_create',
    template_id: templateId,
  }),

  photoshootGenerate: (photoshootId: string) => ({
    event: 'photoshoot_generate',
    photoshoot_id: photoshootId,
  }),

  // Publishing actions
  postSchedule: (platform: string) => ({
    event: 'post_schedule',
    platform,
  }),

  // Error tracking
  error: (message: string, context?: Record<string, unknown>) => ({
    event: 'error',
    message,
    ...context,
  }),
} as const

export type AnalyticsEvent = ReturnType<typeof events[keyof typeof events]>
