import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const { error } = await requireAuth()
  if (error) return error

  const metrics = {
    system_uptime_seconds: process.uptime(),
    system_memory_usage_bytes: process.memoryUsage().heapUsed,
    system_memory_total_bytes: process.memoryUsage().heapTotal,
    app_version: '1.0.0',
    app_environment: process.env.NODE_ENV || 'development',
    feature_analytics_enabled: 1,
    feature_agency_enabled: 1,
    feature_autopilot_enabled: 1,
    timestamp: Date.now(),
  }

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
