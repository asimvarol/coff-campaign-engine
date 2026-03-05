import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPost, updatePost, deletePost } from '../../data-store'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const post = getPost(id)

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ data: post })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const body = await request.json()

  const allowedFields = {
    caption: body.caption,
    platform: body.platform,
    scheduledFor: body.scheduledFor,
    status: body.status,
    mediaUrl: body.mediaUrl,
  }

  const cleanFields = Object.fromEntries(
    Object.entries(allowedFields).filter(([, v]) => v !== undefined)
  )

  const updated = updatePost(id, cleanFields)

  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ data: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const deleted = deletePost(id)

  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
