import { NextResponse } from 'next/server'
import { brandStore } from '../brands/data-store'

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

  const products = (brand as any).products as string[] | undefined
  const campaigns = []

  // Campaign templates based on products/collections
  const campaignNames = products && products.length > 0
    ? products.slice(0, 4).map((p, i) => {
        const templates = [
          `${p} - Launch Campaign`,
          `${p} Collection Showcase`,
          `${p} - Seasonal Promo`,
          `${p} - Social Push`,
        ]
        return templates[i % templates.length]
      })
    : [
        `${brand.name} - Brand Awareness`,
        `${brand.name} Spring Collection`,
        `${brand.name} - Product Launch`,
        `${brand.name} - Social Engagement`,
      ]

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

export async function GET() {
  try {
    const brands = brandStore.getAll()
    const allCampaigns = brands.flatMap(b => generateCampaignsForBrand(b))
    return NextResponse.json({ data: allCampaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
