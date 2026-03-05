import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getAllPhotoshoots, createPhotoshoot } from './data-store'

export async function GET() {
  const { error } = await requireAuth()
  if (error) return error

  const photoshoots = getAllPhotoshoots()
  return NextResponse.json({ data: photoshoots })
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const body = await request.json()
    const { name, status, brandId, brandName, templates, productImage, images } = body

    const photoshoot = createPhotoshoot({
      name: name || 'Untitled Photoshoot',
      status: status || 'COMPLETED',
      brandId,
      brandName,
      templates: templates || [],
      productImage: productImage || '',
      images: images || [],
    })

    return NextResponse.json({ data: photoshoot }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create photoshoot' }, { status: 400 })
  }
}
