import { NextRequest, NextResponse } from 'next/server'
import { brandStore, generateMockBrandDNA } from '../data-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Generate mock brand DNA
    const brandDNA = generateMockBrandDNA(url)

    // Store it
    brandStore.set(brandDNA.id, brandDNA)

    return NextResponse.json({ data: brandDNA }, { status: 201 })
  } catch (error) {
    console.error('Error analyzing brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
