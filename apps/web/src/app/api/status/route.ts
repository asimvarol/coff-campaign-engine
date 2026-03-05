import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const { error } = await requireAuth()
  if (error) return error

  const status = {
    system: {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    },
    features: {
      analytics: true,
      agency: true,
      autopilot: true,
      photoshoot: true,
      publishing: true,
    },
  }

  return NextResponse.json(status, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

export const dynamic = 'force-dynamic'
