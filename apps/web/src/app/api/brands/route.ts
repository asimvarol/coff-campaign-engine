import { NextResponse } from 'next/server'
import { brandStore } from './data-store'

export async function GET() {
  try {
    const brands = brandStore.getAll()
    return NextResponse.json({ data: brands })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
