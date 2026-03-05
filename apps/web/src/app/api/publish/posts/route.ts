import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getAllPosts, createPost } from '../data-store'

export async function GET() {
  const { error } = await requireAuth()
  if (error) return error

  const posts = getAllPosts()
  return NextResponse.json({ data: posts })
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const body = await request.json()
    const { creativeId, creativeThumbnail, platform, scheduledFor, caption, status } = body

    const post = createPost({
      creativeId: creativeId || '',
      creativeThumbnail: creativeThumbnail || '',
      platform: platform || 'instagram',
      scheduledFor: scheduledFor || new Date().toISOString(),
      caption: caption || '',
      status: status || 'scheduled',
    })

    return NextResponse.json({ data: post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 400 })
  }
}
