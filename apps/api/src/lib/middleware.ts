import type { Context, Next } from 'hono'
import { captureError } from './sentry'

// Rate limiting (in-memory, simple)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    const now = Date.now()

    const entry = requestCounts.get(ip)
    if (!entry || now > entry.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
    } else {
      entry.count++
      if (entry.count > maxRequests) {
        c.header('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
        return c.json({ error: 'Too many requests' }, 429)
      }
    }

    await next()
  }
}

// Security headers
export async function securityHeaders(c: Context, next: Next) {
  await next()

  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '0')
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
}

// Error handler with Sentry
export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    captureError(error, {
      method: c.req.method,
      path: c.req.path,
      query: c.req.query(),
    })

    const status = error instanceof Error && 'status' in error ? (error as any).status : 500
    return c.json(
      { error: 'Internal server error' },
      status
    )
  }
}

// Request logging with timing
export async function requestTimer(c: Context, next: Next) {
  const start = performance.now()
  await next()
  const duration = Math.round(performance.now() - start)

  c.header('X-Response-Time', `${duration}ms`)

  if (duration > 5000) {
    console.warn(`Slow request: ${c.req.method} ${c.req.path} took ${duration}ms`)
  }
}

// GDPR: sanitize PII from logs
export function sanitizePII(data: Record<string, unknown>): Record<string, unknown> {
  const sensitive = ['email', 'password', 'accessToken', 'refreshToken', 'secret', 'token']
  const sanitized = { ...data }

  for (const key of Object.keys(sanitized)) {
    if (sensitive.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]'
    }
  }

  return sanitized
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requestCounts.entries()) {
    if (now > entry.resetAt) {
      requestCounts.delete(key)
    }
  }
}, 60000)
