/**
 * Performance monitoring and analytics
 */

export function reportWebVitals(metric: {
  id: string
  name: string
  label: string
  value: number
}) {
  // In production, send to analytics service
  // For now, log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value))
  }

  // TODO: Send to analytics service (Vercel Analytics, GA4, etc.)
  // Example:
  // window.gtag?.('event', metric.name, {
  //   value: Math.round(metric.value),
  //   metric_id: metric.id,
  //   metric_label: metric.label,
  // })
}

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties)
  }

  // TODO: Send to analytics service
}

export function trackError(error: Error, context?: Record<string, unknown>) {
  console.error('[Error]', error, context)

  // TODO: Send to error tracking service (Sentry, etc.)
}
