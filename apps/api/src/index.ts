import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { brandsRouter } from './routes/brands'
import { campaignsRouter } from './routes/campaigns'
import { creativesRouter } from './routes/creatives'
import { photoshootsRouter } from './routes/photoshoots'
import { publishRouter } from './routes/publish'
import { analyticsRouter } from './routes/analytics'
import { autopilotRouter } from './routes/autopilot'
import { webhooksRouter } from './routes/webhooks'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  })
)

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Coff Campaign Engine API', version: '0.1.0', status: 'healthy' })
})

// Routes
app.route('/api/brands', brandsRouter)
app.route('/api/campaigns', campaignsRouter)
app.route('/api/creatives', creativesRouter)
app.route('/api/photoshoots', photoshootsRouter)
app.route('/api/publish', publishRouter)
app.route('/api/analytics', analyticsRouter)
app.route('/api/autopilot', autopilotRouter)
app.route('/api/webhooks', webhooksRouter)

const port = process.env.API_PORT || 3002

console.log(`🚀 Coff Campaign Engine API running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})

export default app
