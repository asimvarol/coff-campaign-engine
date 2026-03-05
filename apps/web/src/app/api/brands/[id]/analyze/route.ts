import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { brandStore } from '../../data-store'
import type { MockBrandDNA } from '../../data-store'
import { analyzeBrand } from '@/lib/brand-analyzer'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const { id } = await context.params
    const existingBrand = brandStore.get(id)

    if (!existingBrand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const result = await analyzeBrand(existingBrand.url)

    const updatedBrand: MockBrandDNA = {
      ...existingBrand,
      name: result.name,
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
      products: result.products || existingBrand.products || [],
      id: existingBrand.id,
      url: existingBrand.url,
      createdAt: existingBrand.createdAt,
      updatedAt: new Date().toISOString(),
    }

    brandStore.set(id, updatedBrand)
    return NextResponse.json({ data: updatedBrand })
  } catch (err) {
    console.error('Error re-analyzing brand:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
