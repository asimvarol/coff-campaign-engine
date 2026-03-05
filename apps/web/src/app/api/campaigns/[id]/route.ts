import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCampaignById } from '../data'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const { id } = await params
    const campaign = getCampaignById(id)

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ data: campaign })
  } catch (err) {
    console.error('Error fetching campaign:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
