import { NextRequest, NextResponse } from 'next/server'
import { brandStore } from '../data-store'
import type { MockBrandDNA } from '../data-store'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const brand = brandStore.get(id)

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: brand })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    if (!brandStore.has(id)) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Get existing brand
    const existingBrand = brandStore.get(id)!

    // Update with new data
    const updatedBrand: MockBrandDNA = {
      ...existingBrand,
      ...body,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    }

    brandStore.set(id, updatedBrand)

    return NextResponse.json({ data: updatedBrand })
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    if (!brandStore.has(id)) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    brandStore.delete(id)

    return NextResponse.json({ 
      data: { success: true, message: 'Brand deleted successfully' }
    })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
