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
  competitors: string[]
  createdAt: string
  updatedAt: string
}

// Persist across HMR reloads
const g = globalThis as Record<string, unknown>
const brandsStore: Map<string, MockBrandDNA> = (g.__coffBrands as Map<string, MockBrandDNA>) ?? new Map()
g.__coffBrands = brandsStore

const demoBrands: MockBrandDNA[] = [
  {
    id: 'brand-1',
    name: 'Golden Horn Jewellery',
    url: 'https://goldenhornjewellery.com',
    logo: { primary: 'https://placehold.co/200x200/d4af37/ffffff?text=GHJ&font=montserrat', variants: [] },
    colors: { primary: '#d4af37', secondary: '#1a1a1a', accent: '#b8860b', background: '#ffffff', text: '#2c2c2c', palette: ['#d4af37', '#1a1a1a', '#b8860b', '#ffffff', '#2c2c2c'] },
    typography: { heading: 'Playfair Display', body: 'Montserrat' },
    voice: { tone: ['Luxurious', 'Refined', 'Elegant'], personality: ['Elegant', 'Timeless', 'Sophisticated', 'Premium'], keywords: ['handcrafted', 'heritage', 'exquisite', 'gold', 'artisan', 'luxury'], sampleTexts: ['Discover our exquisite handcrafted gold collection.', 'Where heritage meets artisan luxury.'] },
    values: ['Quality', 'Heritage', 'Craftsmanship'],
    aesthetic: ['Classic', 'Luxurious', 'Minimal'],
    industry: 'Jewellery & Luxury',
    targetAudience: 'Affluent professionals aged 30-55',
    summary: 'A premium jewellery brand blending Turkish heritage with modern luxury craftsmanship.',
    competitors: ['Cartier', 'Tiffany & Co', 'Bvlgari', 'Van Cleef & Arpels'],
    createdAt: new Date('2026-02-01').toISOString(),
    updatedAt: new Date('2026-02-01').toISOString(),
  },
  {
    id: 'brand-2',
    name: 'Urban Fitness Co',
    url: 'https://urbanfitness.co',
    logo: { primary: 'https://placehold.co/200x200/00d4ff/1a1a1a?text=UFC&font=oswald', variants: [] },
    colors: { primary: '#00d4ff', secondary: '#ff006e', accent: '#ffbe0b', background: '#0d0d0d', text: '#f5f5f5', palette: ['#00d4ff', '#ff006e', '#ffbe0b', '#0d0d0d', '#f5f5f5'] },
    typography: { heading: 'Oswald', body: 'Inter' },
    voice: { tone: ['Energetic', 'Motivating', 'Bold'], personality: ['Bold', 'Dynamic', 'Inspiring', 'Modern'], keywords: ['strength', 'transformation', 'hustle', 'goals', 'power', 'energy'], sampleTexts: ['Push your limits. Transform your life.', 'Your journey to strength starts here.'] },
    values: ['Strength', 'Discipline', 'Community'],
    aesthetic: ['Bold', 'Dark', 'Athletic'],
    industry: 'Fitness & Wellness',
    targetAudience: 'Active adults aged 20-40',
    summary: 'A bold fitness brand inspiring urban athletes to push their limits.',
    competitors: ['Nike Training', 'Gymshark', 'Lululemon', 'Under Armour'],
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-15').toISOString(),
  },
]

if (brandsStore.size === 0) {
  demoBrands.forEach((brand) => brandsStore.set(brand.id, brand))
}

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

export function generateMockBrandDNA(url: string): MockBrandDNA {
  const id = brandStore.generateId()
  const name = extractBrandNameFromUrl(url)
  const now = new Date().toISOString()
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f97316']
  const primary = colors[Math.floor(Math.random() * colors.length)]
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase()

  return {
    id, name, url,
    logo: { primary: `https://placehold.co/200x200/${primary.slice(1)}/ffffff?text=${initials}&font=roboto`, variants: [] },
    colors: { primary, secondary: '#1a1a1a', accent: '#f59e0b', background: '#ffffff', text: '#2c2c2c', palette: [primary, '#1a1a1a', '#f59e0b', '#ffffff', '#2c2c2c'] },
    typography: { heading: 'Inter', body: 'Inter' },
    voice: { tone: ['Professional', 'Friendly', 'Modern'], personality: ['Modern', 'Trustworthy', 'Innovative', 'Approachable'], keywords: ['quality', 'service', 'excellence', 'innovative', 'trusted'], sampleTexts: ['Welcome to a new standard of excellence.', 'Innovation meets quality.'] },
    values: ['Innovation', 'Quality', 'Trust'],
    aesthetic: ['Modern', 'Clean', 'Professional'],
    industry: 'General',
    targetAudience: 'Adults aged 25-45',
    summary: `${name} is a modern brand focused on quality and innovation.`,
    competitors: [],
    createdAt: now, updatedAt: now,
  }
}
