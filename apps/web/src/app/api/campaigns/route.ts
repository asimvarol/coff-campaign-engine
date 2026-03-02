import { NextRequest, NextResponse } from 'next/server'
import { brandStore } from '../brands/data-store'

// In-memory campaign store (persists across HMR)
const g = globalThis as Record<string, unknown>
const campaignStore: Map<string, Record<string, unknown>> = (g.__coffCampaigns as Map<string, Record<string, unknown>>) ?? new Map()
g.__coffCampaigns = campaignStore

const OBJECTIVES = ['AWARENESS', 'PRODUCT_LAUNCH', 'SEASONAL', 'ENGAGEMENT', 'CONVERSION'] as const
const STATUSES = ['PUBLISHED', 'REVIEW', 'GENERATING', 'DRAFT', 'APPROVED'] as const
const PLATFORMS_SETS = [
  ['instagram', 'facebook', 'pinterest'],
  ['instagram', 'facebook', 'tiktok'],
  ['instagram', 'linkedin', 'x'],
  ['instagram', 'tiktok'],
  ['facebook', 'instagram', 'tiktok', 'pinterest'],
]

function generateCampaignsForBrand(brand: ReturnType<typeof brandStore.get>) {
  if (!brand) return []
  const products = (brand as Record<string, unknown>).products as string[] | undefined
  const campaigns = []
  const campaignNames = products && products.length > 0
    ? products.slice(0, 4).map((p, i) => {
        const templates = [`${p} - Launch Campaign`, `${p} Collection Showcase`, `${p} - Seasonal Promo`, `${p} - Social Push`]
        return templates[i % templates.length]
      })
    : [`${brand.name} - Brand Awareness`, `${brand.name} Spring Collection`, `${brand.name} - Product Launch`, `${brand.name} - Social Engagement`]

  for (let i = 0; i < campaignNames.length; i++) {
    campaigns.push({
      id: `campaign-${brand.id}-${i + 1}`,
      name: campaignNames[i],
      brandId: brand.id,
      brandName: brand.name,
      brandLogo: brand.logo.primary,
      objective: OBJECTIVES[i % OBJECTIVES.length],
      status: STATUSES[i % STATUSES.length],
      platforms: PLATFORMS_SETS[i % PLATFORMS_SETS.length],
      creativeCount: [12, 16, 8, 0, 6][i % 5],
      createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    })
  }
  return campaigns
}

export async function GET(request: NextRequest) {
  try {
    const brandId = request.nextUrl.searchParams.get('brandId')
    const brands = brandId ? [brandStore.get(brandId)].filter(Boolean) : brandStore.getAll()
    const generatedCampaigns = brands.flatMap(b => generateCampaignsForBrand(b!))
    const savedCampaigns = [...campaignStore.values()].filter(c => !brandId || c.brandId === brandId)
    const allCampaigns = [...savedCampaigns, ...generatedCampaigns]
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
