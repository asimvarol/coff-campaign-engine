import { NextResponse } from 'next/server'

/**
 * Metrics endpoint for Prometheus/monitoring
 */
export async function GET() {
  const metrics = {
    // System
    system_uptime_seconds: process.uptime(),
    system_memory_usage_bytes: process.memoryUsage().heapUsed,
    system_memory_total_bytes: process.memoryUsage().heapTotal,
    
    // Application
    app_version: '1.0.0',
    app_environment: process.env.NODE_ENV || 'development',
    
    // Features (enabled = 1, disabled = 0)
    feature_analytics_enabled: 1,
    feature_agency_enabled: 1,
    feature_autopilot_enabled: 1,
    
    // Database
    db_configured: process.env.DATABASE_URL ? 1 : 0,
    redis_configured: process.env.REDIS_URL ? 1 : 0,
    
    // Auth
    auth_configured: process.env.NEXTAUTH_SECRET ? 1 : 0,
    oauth_google_configured: process.env.GOOGLE_CLIENT_ID ? 1 : 0,
    
    timestamp: Date.now(),
  }

  // Prometheus format
  const prometheus = Object.entries(metrics)
    .map(([key, value]) => `${key} ${value}`)
    .join('\n')

  return new NextResponse(prometheus, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store',
    },
  })
}

export const dynamic = 'force-dynamic'
