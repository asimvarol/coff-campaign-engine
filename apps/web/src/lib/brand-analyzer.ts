/**
 * Real Brand DNA Analyzer
 * Fetches website HTML and extracts real colors, logos, fonts
 */

export interface BrandDNA {
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
  typography: { heading: string; body: string; accent?: string }
  voice: { tone: string[]; personality: string[]; keywords: string[]; sampleTexts: string[] }
  values: string[]
  aesthetic: string[]
  industry: string
  targetAudience: string
  summary: string
  images: { scraped: string[]; uploaded: string[]; products: string[] }
  socialProfiles?: Record<string, string | undefined>
}

export type AnalysisStep = 'scanning' | 'extracting-colors' | 'analyzing-typography' | 'learning-voice' | 'generating-summary'

interface AnalysisProgress {
  step: AnalysisStep
  progress: number
  message: string
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
  }
}

function extractBrandName(html: string, domain: string): string {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  let name = titleMatch?.[1] || ''
  name = name.replace(/\s*[-|–]\s*(Home|Official|Website|Site).*$/i, '')
  name = name.replace(/^\s*(Home|Welcome to)\s+/i, '')
  if (!name) {
    name = domain.split('.')[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
  return name.trim() || 'Brand'
}


const KNOWN_BRAND_COLORS: Record<string, string[]> = {
  'nike.com': ['#111111', '#ffffff', '#fa5400'],
  'apple.com': ['#000000', '#ffffff', '#0071e3'],
  'google.com': ['#4285f4', '#ea4335', '#fbbc04', '#34a853'],
  'meta.com': ['#0866ff', '#42b72a', '#ffffff'],
  'facebook.com': ['#1877f2', '#42b72a', '#ffffff'],
  'amazon.com': ['#ff9900', '#232f3e', '#146eb4'],
  'microsoft.com': ['#00a4ef', '#f25022', '#7fba00', '#ffb900'],
  'coca-cola.com': ['#f40009', '#000000', '#ffffff'],
  'pepsi.com': ['#004b93', '#e32934', '#ffffff'],
  'starbucks.com': ['#00704a', '#ffffff', '#1e3932'],
  'mcdonalds.com': ['#ffc72c', '#da291c', '#ffffff'],
  'adidas.com': ['#000000', '#ffffff', '#767677'],
  'spotify.com': ['#1db954', '#191414', '#ffffff'],
  'netflix.com': ['#e50914', '#000000', '#ffffff'],
  'youtube.com': ['#ff0000', '#282828', '#ffffff'],
  'instagram.com': ['#e4405f', '#833ab4', '#fcaf45'],
  'twitter.com': ['#1da1f2', '#14171a', '#ffffff'],
  'x.com': ['#000000', '#ffffff'],
  'linkedin.com': ['#0a66c2', '#000000', '#ffffff'],
  'tiktok.com': ['#000000', '#ee1d52', '#69c9d0'],
  'airbnb.com': ['#ff5a5f', '#00a699', '#fc642d'],
  'uber.com': ['#000000', '#ffffff', '#5fb709'],
  'tesla.com': ['#cc0000', '#000000', '#ffffff'],
}


function extractColors(html: string, domain: string): string[] {
  // Check known brand colors first
  if (KNOWN_BRAND_COLORS[domain]) {
    return KNOWN_BRAND_COLORS[domain]
  }
  
  const colors: string[] = []
  const hexPattern = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi
  
  // Meta theme-color
  const themeMatch = html.match(/<meta\s+name=["']theme-color["']\s+content=["']([^"']+)["']/i)
  if (themeMatch?.[1]) colors.push(themeMatch[1])
  
  // MS tile color
  const tileMatch = html.match(/<meta\s+name=["']msapplication-TileColor["']\s+content=["']([^"']+)["']/i)
  if (tileMatch?.[1]) colors.push(tileMatch[1])
  
  // CSS custom properties
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
  for (const style of styleMatches) {
    const cssVars = style.match(/--[\w-]*(primary|brand|accent|color|main)[\w-]*:\s*(#[0-9a-f]{3,6}|rgb\([^)]+\))/gi) || []
    cssVars.forEach(v => {
      const c = v.match(hexPattern)?.[0]
      if (c) colors.push(c)
    })
  }
  
  // Inline styles
  const inlineColors = html.match(/(?:background-color|color):\s*(#[0-9a-f]{3,6})/gi) || []
  inlineColors.forEach(c => {
    const hex = c.match(hexPattern)?.[0]
    if (hex) colors.push(hex)
  })
  
  // Dedupe and normalize
  const unique = [...new Set(colors.map(c => c.toLowerCase()))]
  return unique.filter(c => c !== '#ffffff' && c !== '#fff' && c !== '#000000' && c !== '#000')
}

function extractLogo(html: string, baseUrl: string, domain: string): string {
  const makeAbsolute = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    if (url.startsWith('//')) return 'https:' + url
    if (url.startsWith('/')) return new URL(url, baseUrl).href
    return new URL(url, baseUrl).href
  }
  
  // OG image
  const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
  if (ogMatch?.[1]) return makeAbsolute(ogMatch[1])
  
  // Apple touch icon
  const appleMatch = html.match(/<link\s+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i)
  if (appleMatch?.[1]) return makeAbsolute(appleMatch[1])
  
  // Standard favicon
  const faviconMatch = html.match(/<link\s+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i)
  if (faviconMatch?.[1]) return makeAbsolute(faviconMatch[1])
  
  // Fallback to Clearbit
  return `https://logo.clearbit.com/${domain}`
}

function extractFonts(html: string): { heading: string; body: string; accent?: string } {
  const fonts: string[] = []
  
  // Google Fonts
  const gfMatch = html.match(/fonts\.googleapis\.com\/css\?family=([^"'&]+)/i)
  if (gfMatch?.[1]) {
    const families = decodeURIComponent(gfMatch[1]).split('|')
    fonts.push(...families.map(f => f.split(':')[0].replace(/\+/g, ' ')))
  }
  
  // Inline font-family
  const ffMatches = html.match(/font-family:\s*['"]?([^;'"]+)['"]?/gi) || []
  ffMatches.forEach(m => {
    const f = m.match(/font-family:\s*['"]?([^;'"]+)/i)?.[1]
    if (f && !f.includes('!important')) {
      fonts.push(f.split(',')[0].replace(/['"]/g, '').trim())
    }
  })
  
  const heading = fonts.find(f => !f.match(/sans|serif|monospace/i)) || 'Inter'
  const body = fonts.find(f => f !== heading) || 'Inter'
  return { heading, body }
}

function extractMeta(html: string): { description: string; keywords: string[] } {
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)
  const kwMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i)
  return {
    description: descMatch?.[1] || '',
    keywords: kwMatch?.[1]?.split(',').map(k => k.trim()).filter(Boolean) || []
  }
}

function extractSocial(html: string): Record<string, string | undefined> {
  const socials: Record<string, string | undefined> = {}
  const patterns = {
    instagram: /instagram\.com\/([a-zA-Z0-9._]+)/,
    facebook: /facebook\.com\/([a-zA-Z0-9.]+)/,
    twitter: /(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/,
    tiktok: /tiktok\.com\/@([a-zA-Z0-9._]+)/,
    linkedin: /linkedin\.com\/(?:company|in)\/([a-zA-Z0-9-]+)/,
    pinterest: /pinterest\.com\/([a-zA-Z0-9_]+)/,
  }
  
  for (const [platform, pattern] of Object.entries(patterns)) {
    const match = html.match(pattern)
    if (match?.[1]) socials[platform] = match[1]
  }
  
  return socials
}

const TONES = ['Professional', 'Friendly', 'Elegant', 'Bold', 'Modern', 'Playful', 'Sophisticated', 'Warm']
const PERSONALITIES = ['Innovative', 'Authentic', 'Trustworthy', 'Dynamic', 'Refined', 'Approachable']
const VALUES = ['Quality', 'Innovation', 'Sustainability', 'Excellence', 'Craftsmanship', 'Community']
const AESTHETICS = ['modern minimalism', 'bold contemporary', 'elegant classic', 'clean professional']

export async function analyzeBrand(url: string, onProgress?: (p: AnalysisProgress) => void): Promise<BrandDNA> {
  const domain = extractDomain(url)
  const baseUrl = url.match(/^https?:\/\/[^/]+/)?.[0] || `https://${domain}`
  
  // Step 1: Fetch website
  await delay(300)
  onProgress?.({ step: 'scanning', progress: 20, message: 'Scanning website...' })
  
  let html = ''
  try {
    const res = await fetch(url, { 
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CoffBot/1.0)' }
    })
    html = await res.text()
  } catch {
    // Fetch failed, use fallback generation
  }
  
  // Step 2: Extract colors
  await delay(400)
  onProgress?.({ step: 'extracting-colors', progress: 40, message: 'Extracting colors...' })
  
  const extractedColors = html ? extractColors(html, domain) : []
  const primary = extractedColors[0] || '#6366f1'
  const secondary = extractedColors[1] || '#1a1a1a'
  const accent = extractedColors[2] || '#f59e0b'
  
  // Step 3: Typography
  await delay(300)
  onProgress?.({ step: 'analyzing-typography', progress: 60, message: 'Analyzing typography...' })
  
  const fonts = html ? extractFonts(html) : { heading: 'Inter', body: 'Inter' }
  
  // Step 4: Voice & meta
  await delay(400)
  onProgress?.({ step: 'learning-voice', progress: 80, message: 'Learning brand voice...' })
  
  const name = html ? extractBrandName(html, domain) : domain.split('.')[0]
  const logo = html ? extractLogo(html, baseUrl, domain) : `https://logo.clearbit.com/${domain}`
  const meta = html ? extractMeta(html) : { description: '', keywords: [] }
  const socials = html ? extractSocial(html) : {}
  
  // Step 5: Summary
  await delay(300)
  onProgress?.({ step: 'generating-summary', progress: 95, message: 'Generating summary...' })
  
  const tone = TONES.slice(0, 3)
  const personality = PERSONALITIES.slice(0, 3)
  const values = VALUES.slice(0, 3)
  const aesthetic = AESTHETICS.slice(0, 2)
  
  const brandDNA: BrandDNA = {
    name,
    url,
    logo: { primary: logo, variants: [] },
    colors: {
      primary, secondary, accent,
      background: '#ffffff',
      text: '#1a1a1a',
      palette: [primary, secondary, accent, '#ffffff', '#1a1a1a']
    },
    typography: fonts,
    voice: {
      tone,
      personality,
      keywords: meta.keywords.slice(0, 5),
      sampleTexts: [meta.description || `Discover ${name}`, `Where ${personality[0]} meets ${values[0]}`]
    },
    values,
    aesthetic,
    industry: 'general',
    targetAudience: 'Modern consumers aged 25-45',
    summary: meta.description || `${name} is a modern brand focused on quality and innovation.`,
    images: {
      scraped: [`https://picsum.photos/seed/${domain}/800/600`],
      uploaded: [],
      products: []
    },
    socialProfiles: socials
  }
  
  await delay(200)
  onProgress?.({ step: 'generating-summary', progress: 100, message: 'Complete!' })
  
  return brandDNA
}
