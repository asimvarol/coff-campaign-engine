/**
 * Performance monitoring and analytics
 * Uses Vercel Analytics for production metrics
 */

export function reportWebVitals(metric: {
  id: string
  name: string
  label: string
  value: number
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value))
  }
  // Vercel Analytics automatically captures Web Vitals via <Analytics /> component
}

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties)
  }
  // Vercel Analytics automatically captures page views via <Analytics /> component
  // For custom events, use: import { track } from '@vercel/analytics'
}

export function trackError(error: Error, context?: Record<string, unknown>) {
  console.error('[Error]', error, context)
}
