import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { brandStore } from '../data-store'
import type { MockBrandDNA } from '../data-store'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const { id } = await context.params
    const brand = brandStore.get(id)
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }
    return NextResponse.json({ data: brand })
  } catch (err) {
    console.error('Error fetching brand:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const { id } = await context.params
    const body = await request.json()

    const existingBrand = brandStore.get(id)
    if (!existingBrand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const updatedBrand: MockBrandDNA = {
      ...existingBrand,
      name: body.name ?? existingBrand.name,
      url: body.url ?? existingBrand.url,
      colors: body.colors ?? existingBrand.colors,
      typography: body.typography ?? existingBrand.typography,
      voice: body.voice ?? existingBrand.voice,
      values: body.values ?? existingBrand.values,
      aesthetic: body.aesthetic ?? existingBrand.aesthetic,
      industry: body.industry ?? existingBrand.industry,
      targetAudience: body.targetAudience ?? existingBrand.targetAudience,
      summary: body.summary ?? existingBrand.summary,
      logo: body.logo ?? existingBrand.logo,
      images: body.images ?? existingBrand.images,
      socialProfiles: body.socialProfiles ?? existingBrand.socialProfiles,
      id,
      updatedAt: new Date().toISOString(),
    }

    brandStore.set(id, updatedBrand)
    return NextResponse.json({ data: updatedBrand })
  } catch (err) {
    console.error('Error updating brand:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const { id } = await context.params
    if (!brandStore.has(id)) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }
    brandStore.delete(id)
    return NextResponse.json({ data: { success: true, message: 'Brand deleted successfully' } })
  } catch (err) {
    console.error('Error deleting brand:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
