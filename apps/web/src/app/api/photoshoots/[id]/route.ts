import { NextResponse } from 'next/server'
import { getPhotoshoot } from '../data-store'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const photoshoot = getPhotoshoot(id)

  if (!photoshoot) {
    return NextResponse.json({ error: 'Photoshoot not found' }, { status: 404 })
  }

  return NextResponse.json({ data: photoshoot })
}
