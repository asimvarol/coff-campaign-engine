/**
 * Feature flags for gradual rollout
 */

import { env } from './env'
import { ReactNode } from 'react'

export const features = {
  // Core features
  autopilot: env.enableAutopilot,
  agencyMode: env.enableAgencyMode,

  // Upcoming features (disabled by default)
  realTimeCollaboration: false,
  aiCampaignGeneration: false,
  socialPlatformIntegration: false,
  advancedAnalytics: false,
  whiteLabelMode: false,
  multiLanguage: false,

  // Experimental features
  webSocket: false,
  voiceCommands: false,
  darkMode: true, // Always enabled
} as const

export type FeatureFlag = keyof typeof features

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag]
}

// Helper for conditional rendering
export function FeatureGate({
  feature,
  children,
  fallback,
}: {
  feature: FeatureFlag
  children: ReactNode
  fallback?: ReactNode
}) {
  if (!isFeatureEnabled(feature)) {
    return fallback || null
  }
  
  return <>{children}</>
}
