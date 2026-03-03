import { brandStore, type MockBrandDNA } from '../brands/data-store'

// In-memory campaign store (persists across HMR)
const g = globalThis as Record<string, unknown>
export const campaignStore: Map<string, Record<string, unknown>> = (g.__coffCampaigns as Map<string, Record<string, unknown>>) ?? new Map()
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

function generateCampaignsForBrand(brand: MockBrandDNA | undefined) {
  if (!brand) return []
  const products = brand.products
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

export function getAllCampaigns(brandId?: string | null) {
  const brands = brandId ? [brandStore.get(brandId)].filter(Boolean) : brandStore.getAll()
  const generatedCampaigns = brands.flatMap(b => generateCampaignsForBrand(b!))
  const savedCampaigns = [...campaignStore.values()].filter(c => !brandId || c.brandId === brandId)
  return [...savedCampaigns, ...generatedCampaigns]
}

export function getCampaignById(id: string) {
  // Check saved campaigns first
  const saved = campaignStore.get(id)
  if (saved) return saved

  // Check generated campaigns
  const allGenerated = getAllCampaigns()
  return allGenerated.find(c => c.id === id) || null
}
