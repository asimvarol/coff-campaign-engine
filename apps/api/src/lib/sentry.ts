import * as Sentry from '@sentry/node'

const DSN = process.env.SENTRY_DSN

export function initSentry() {
  if (!DSN) return

  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // Strip sensitive data
      if (event.request?.headers) {
        delete event.request.headers.authorization
        delete event.request.headers.cookie
      }
      return event
    },
  })
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (!DSN) {
    console.error('Error:', error)
    return
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional', context)
    }
    Sentry.captureException(error)
  })
}

export { Sentry }
