// In-memory mock data store for Brand DNA
// Uses globalThis to persist across Turbopack HMR reloads

export interface MockBrandDNA {
  id: string
  name: string
  url: string
  logo: { primary: string; variants: string[] }
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    palette: string[]
  }
  typography: {
    heading: string
    body: string
    accent?: string
  }
  voice: {
    tone: string[]
    personality: string[]
    keywords: string[]
    sampleTexts: string[]
  }
  values: string[]
  aesthetic: string[]
  industry: string
  targetAudience: string
  summary: string
  images?: {
    scraped: string[]
    uploaded: string[]
    products: string[]
  }
  socialProfiles?: Record<string, string | undefined>
  products?: string[]
  competitors: string[]
  createdAt: string
  updatedAt: string
}

// Persist across HMR reloads
const g = globalThis as Record<string, unknown>
const brandsStore: Map<string, MockBrandDNA> = (g.__coffBrands as Map<string, MockBrandDNA>) ?? new Map()
g.__coffBrands = brandsStore

export const brandStore = {
  get(id: string): MockBrandDNA | undefined { return brandsStore.get(id) },
  set(id: string, brand: MockBrandDNA): void { brandsStore.set(id, brand) },
  delete(id: string): boolean { return brandsStore.delete(id) },
  has(id: string): boolean { return brandsStore.has(id) },
  getAll(): MockBrandDNA[] { return Array.from(brandsStore.values()) },
  generateId(): string { return `brand-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` },
}

export function extractBrandNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    const name = domain.split('.')[0]
    return name.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  } catch { return 'New Brand' }
}

