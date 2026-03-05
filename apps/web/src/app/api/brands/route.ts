import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { brandStore } from './data-store'

export async function GET() {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const brands = brandStore.getAll()
    return NextResponse.json({ data: brands })
  } catch (err) {
    console.error('Error fetching brands:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
