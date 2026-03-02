import { NextResponse } from 'next/server'

/**
 * System status endpoint
 * Returns detailed system information
 */
export async function GET() {
  const status = {
    system: {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    },
    services: {
      database: {
        status: process.env.DATABASE_URL ? 'configured' : 'not_configured',
        type: 'postgresql',
      },
      redis: {
        status: process.env.REDIS_URL ? 'configured' : 'not_configured',
      },
      auth: {
        status: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
        providers: ['google'],
      },
    },
    features: {
      analytics: true,
      agency: true,
      autopilot: true,
      photoshoot: true,
      publishing: true,
    },
    stats: {
      pages: 30,
      routes: 24,
      components: '50+',
    },
  }

  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export const dynamic = 'force-dynamic'
