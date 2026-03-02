import { NextRequest, NextResponse } from 'next/server'
import { brandStore } from '../data-store'
import { analyzeBrand } from '@/lib/brand-analyzer'
import type { MockBrandDNA } from '../data-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try { new URL(url) } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Use the full brand analyzer (deterministic mock based on domain)
    const result = await analyzeBrand(url)
    const id = brandStore.generateId()
    const now = new Date().toISOString()

    const brand: MockBrandDNA = {
      id,
      name: result.name,
      url: result.url,
      logo: result.logo,
      colors: result.colors,
      typography: result.typography,
      voice: result.voice,
      values: result.values,
      aesthetic: result.aesthetic,
      industry: result.industry,
      targetAudience: result.targetAudience,
      summary: result.summary,
      images: result.images,
      socialProfiles: result.socialProfiles,
      competitors: [],
      createdAt: now,
      updatedAt: now,
    }

    brandStore.set(id, brand)
    return NextResponse.json({ data: brand }, { status: 201 })
  } catch (error) {
    console.error('Error analyzing brand:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
