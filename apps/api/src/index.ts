import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initSentry } from './lib/sentry'
import { rateLimiter, securityHeaders, errorHandler, requestTimer } from './lib/middleware'
import { brandsRouter } from './routes/brands'
import { campaignsRouter } from './routes/campaigns'
import { creativesRouter } from './routes/creatives'
import { photoshootRouter } from './routes/photoshoot'
import { publishRouter } from './routes/publish'
import { analyticsRouter } from './routes/analytics'
import { autopilotRouter } from './routes/autopilot'
import { webhooksRouter } from './routes/webhooks'
import { socialAuthRouter } from './routes/social-auth'
import { commentsRouter } from './routes/comments'
import { approvalsRouter } from './routes/approvals'
import { activityRouter } from './routes/activity'
import { whitelabelRouter } from './routes/whitelabel'
import { gdprRouter } from './routes/gdpr'

// Initialize Sentry
initSentry()

const app = new Hono()

// Middleware
app.use('*', errorHandler)
app.use('*', securityHeaders)
app.use('*', requestTimer)
app.use('*', logger())
app.use('*', rateLimiter(100, 60000))
app.use(
  '*',
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  })
)

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Coff Campaign Engine API', version: '0.2.0', status: 'healthy' })
})

// Routes
app.route('/api/brands', brandsRouter)
app.route('/api/campaigns', campaignsRouter)
app.route('/api/creatives', creativesRouter)
app.route('/api/photoshoot', photoshootRouter)
app.route('/api/publish', publishRouter)
app.route('/api/analytics', analyticsRouter)
app.route('/api/autopilot', autopilotRouter)
app.route('/api/webhooks', webhooksRouter)
app.route('/api/auth/social', socialAuthRouter)
app.route('/api/comments', commentsRouter)
app.route('/api/approvals', approvalsRouter)
app.route('/api/activity', activityRouter)
app.route('/api/whitelabel', whitelabelRouter)
app.route('/api/gdpr', gdprRouter)

const port = process.env.API_PORT || 3002

console.log(`Coff Campaign Engine API running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})

export default app
