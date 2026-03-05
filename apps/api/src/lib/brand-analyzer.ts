/**
 * Brand DNA Analyzer
 * Takes a URL and returns brand DNA data
 * Uses OpenAI for voice analysis when configured, deterministic fallback otherwise
 */

import { analyzeBrandVoice } from './openai'

export interface BrandDNA {
  name: string
  url: string
  logo: {
    primary: string
    variants: string[]
  }
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
  images: {
    scraped: string[]
    uploaded: string[]
    products: string[]
  }
  socialProfiles?: {
    instagram?: string
    facebook?: string
    tiktok?: string
    linkedin?: string
    x?: string
    pinterest?: string
  }
}

export type AnalysisStep = 
  | 'scanning'
  | 'extracting-colors'
  | 'analyzing-typography'
  | 'learning-voice'
  | 'generating-summary'

interface AnalysisProgress {
  step: AnalysisStep
  progress: number
  message: string
}

/**
 * Hash a string to a number (for deterministic "randomness")
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Generate a color from a domain name (deterministic)
 */
function generateColorFromDomain(domain: string, index: number): string {
  const hash = hashString(domain + index)
  const hue = hash % 360
  const saturation = 45 + (hash % 40)
  const lightness = 35 + (hash % 30)
  
  // Convert HSL to hex (simplified)
  const h = hue / 360
  const s = saturation / 100
  const l = lightness / 100
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255)
  const g = Math.round(hue2rgb(p, q, h) * 255)
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255)
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * Pick random items from array (deterministic based on hash)
 */
function pickRandom<T>(array: T[], count: number, seed: number): T[] {
  const shuffled = [...array]
  let currentIndex = shuffled.length
  let hash = seed
  
  while (currentIndex > 0) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    const randomIndex = hash % currentIndex
    currentIndex--
    ;[shuffled[currentIndex], shuffled[randomIndex]] = 
      [shuffled[randomIndex], shuffled[currentIndex]]
  }
  
  return shuffled.slice(0, count)
}

const FONTS = {
  heading: [
    'Playfair Display',
    'Montserrat',
    'Raleway',
    'Lora',
    'Merriweather',
    'Oswald',
    'Roboto Slab',
    'Bebas Neue',
    'Archivo',
    'Space Grotesk',
  ],
  body: [
    'Inter',
    'Open Sans',
    'Roboto',
    'Lato',
    'Source Sans Pro',
    'Nunito',
    'Work Sans',
    'DM Sans',
    'Plus Jakarta Sans',
    'Manrope',
  ],
  accent: [
    'Great Vibes',
    'Pacifico',
    'Dancing Script',
    'Satisfy',
    'Caveat',
  ],
}

const TONES = [
  'Professional',
  'Friendly',
  'Elegant',
  'Casual',
  'Luxurious',
  'Bold',
  'Minimalist',
  'Playful',
  'Trustworthy',
  'Innovative',
  'Warm',
  'Sophisticated',
  'Narrative',
  'Mindful',
  'Energetic',
]

const PERSONALITIES = [
  'Authentic',
  'Innovative',
  'Caring',
  'Bold',
  'Refined',
  'Dynamic',
  'Thoughtful',
  'Passionate',
  'Reliable',
  'Creative',
  'Sophisticated',
  'Approachable',
  'Inspiring',
  'Genuine',
]

const VALUES = [
  'Sustainability',
  'Quality',
  'Innovation',
  'Craftsmanship',
  'Heritage',
  'Community',
  'Transparency',
  'Excellence',
  'Authenticity',
  'Inclusivity',
  'Ethical',
  'Customer-First',
  'Integrity',
  'Empowerment',
]

const AESTHETICS = [
  'modern minimalism',
  'modern heritage',
  'serene minimalism',
  'bold contemporary',
  'elegant classic',
  'rustic artisan',
  'sleek futuristic',
  'warm traditional',
  'vibrant eclectic',
  'clean scandinavian',
  'industrial modern',
  'organic natural',
]

const INDUSTRIES = [
  'fashion',
  'jewelry',
  'technology',
  'food & beverage',
  'beauty & cosmetics',
  'home & lifestyle',
  'fitness & wellness',
  'professional services',
  'e-commerce',
  'creative agency',
]

/**
 * Generate mock Brand DNA from URL
 */
export async function analyzeBrand(
  url: string,
  onProgress?: (progress: AnalysisProgress) => void
): Promise<BrandDNA> {
  // Extract domain for deterministic generation
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const hash = hashString(domain)
  
  // Step 1: Scanning website
  await delay(800)
  onProgress?.({
    step: 'scanning',
    progress: 20,
    message: 'Scanning website...',
  })
  
  // Step 2: Extracting colors
  await delay(1000)
  onProgress?.({
    step: 'extracting-colors',
    progress: 40,
    message: 'Extracting colors...',
  })
  
  const primary = generateColorFromDomain(domain, 0)
  const secondary = generateColorFromDomain(domain, 1)
  const accent = generateColorFromDomain(domain, 2)
  
  // Step 3: Analyzing typography
  await delay(900)
  onProgress?.({
    step: 'analyzing-typography',
    progress: 60,
    message: 'Analyzing typography...',
  })
  
  const headingFont = FONTS.heading[hash % FONTS.heading.length]
  const bodyFont = FONTS.body[hash % FONTS.body.length]
  const accentFont = hash % 3 === 0 ? FONTS.accent[hash % FONTS.accent.length] : undefined
  
  // Step 4: Learning brand voice (AI-powered when configured)
  await delay(1100)
  onProgress?.({
    step: 'learning-voice',
    progress: 80,
    message: 'Learning brand voice...',
  })

  const industry = INDUSTRIES[hash % INDUSTRIES.length]

  // Generate brand name from domain
  const name = domain
    .split('.')[0]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Use AI for voice analysis, falls back to deterministic generation
  const voiceAnalysis = await analyzeBrandVoice({
    url,
    name,
    colors: { primary, secondary, accent },
    typography: { heading: headingFont, body: bodyFont },
    industry,
  })

  // Step 5: Generating summary
  await delay(800)
  onProgress?.({
    step: 'generating-summary',
    progress: 95,
    message: 'Generating summary...',
  })

  const brandDNA: BrandDNA = {
    name,
    url,
    logo: {
      primary: `https://logo.clearbit.com/${domain}`,
      variants: [],
    },
    colors: {
      primary,
      secondary,
      accent,
      background: '#ffffff',
      text: '#1a1a1a',
      palette: [primary, secondary, accent, '#ffffff', '#1a1a1a'],
    },
    typography: {
      heading: headingFont,
      body: bodyFont,
      accent: accentFont,
    },
    voice: {
      tone: voiceAnalysis.tone,
      personality: voiceAnalysis.personality,
      keywords: voiceAnalysis.keywords,
      sampleTexts: voiceAnalysis.sampleTexts,
    },
    values: voiceAnalysis.values,
    aesthetic: voiceAnalysis.aesthetic,
    industry,
    targetAudience: voiceAnalysis.targetAudience,
    summary: voiceAnalysis.summary,
    images: {
      scraped: [
        `https://picsum.photos/seed/${hash}/800/600`,
        `https://picsum.photos/seed/${hash + 1}/800/600`,
        `https://picsum.photos/seed/${hash + 2}/800/600`,
      ],
      uploaded: [],
      products: [],
    },
    socialProfiles: {
      instagram: hash % 2 === 0 ? `@${domain.split('.')[0]}` : undefined,
      facebook: hash % 3 === 0 ? domain.split('.')[0] : undefined,
    },
  }
  
  await delay(200)
  onProgress?.({
    step: 'generating-summary',
    progress: 100,
    message: 'Complete!',
  })
  
  return brandDNA
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
