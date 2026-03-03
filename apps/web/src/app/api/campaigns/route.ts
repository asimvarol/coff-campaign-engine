import { NextRequest, NextResponse } from 'next/server'
import { campaignStore, getAllCampaigns } from './data'

export async function GET(request: NextRequest) {
  try {
    const brandId = request.nextUrl.searchParams.get('brandId')
    const allCampaigns = getAllCampaigns(brandId)
    return NextResponse.json({ data: allCampaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    const now = new Date().toISOString()
    const campaign = {
      id,
      name: body.name || 'Untitled Campaign',
      brandId: body.brandId || '',
      brandName: body.brandName || '',
      brandLogo: body.brandLogo || '',
      objective: body.objective || 'AWARENESS',
      status: body.status || 'DRAFT',
      platforms: body.platforms || [],
      creativeCount: body.creativeCount || 0,
      creatives: body.creatives || [],
      description: body.description || '',
      conceptName: body.conceptName || '',
      createdAt: now,
      updatedAt: now,
    }
    campaignStore.set(id, campaign)
    return NextResponse.json({ data: campaign }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
