import { NextRequest, NextResponse } from 'next/server'
import { brandStore, generateMockBrandDNA } from '../../data-store'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const existingBrand = brandStore.get(id)

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Re-analyze by generating new brand DNA with the same URL
    const reanalyzedBrand = generateMockBrandDNA(existingBrand.url)

    // Keep the original ID and created date
    const updatedBrand = {
      ...reanalyzedBrand,
      id: existingBrand.id,
      createdAt: existingBrand.createdAt,
      updatedAt: new Date().toISOString(),
    }

    brandStore.set(id, updatedBrand)

    return NextResponse.json({ data: updatedBrand })
  } catch (error) {
    console.error('Error re-analyzing brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
