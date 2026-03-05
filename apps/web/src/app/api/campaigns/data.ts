// In-memory campaign store (persists across HMR)
const g = globalThis as Record<string, unknown>
export const campaignStore: Map<string, Record<string, unknown>> = (g.__coffCampaigns as Map<string, Record<string, unknown>>) ?? new Map()
g.__coffCampaigns = campaignStore

export function getAllCampaigns(brandId?: string | null) {
  const all = [...campaignStore.values()]
  if (brandId) return all.filter(c => c.brandId === brandId)
  return all
}

export function getCampaignById(id: string) {
  return campaignStore.get(id) || null
}
