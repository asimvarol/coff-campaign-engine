/**
 * Brand DNA Analyzer
 * Scrapes a website for real brand data: logo, colors, fonts, images, meta
 * Uses OpenAI for voice/tone analysis when configured
 */

import { analyzeBrandVoice } from './openai'

export interface BrandDNA {
  name: string
  url: string
  logo: { primary: string; variants: string[] }
  colors: {
    primary: string; secondary: string; accent: string
    background: string; text: string; palette: string[]
  }
  typography: { heading: string; body: string; accent?: string }
  voice: { tone: string[]; personality: string[]; keywords: string[]; sampleTexts: string[] }
  values: string[]
  aesthetic: string[]
  industry: string
  targetAudience: string
  summary: string
  images: { scraped: string[]; uploaded: string[]; products: string[] }
  socialProfiles?: {
    instagram?: string; facebook?: string; tiktok?: string
    linkedin?: string; x?: string; pinterest?: string
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

interface ScrapedData {
  html: string
  title: string
  description: string
  logo: string
  colors: string[]
  fonts: string[]
  images: string[]
  socialLinks: Record<string, string>
}

// ─── Scraping ────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

function resolveUrl(href: string, baseUrl: string): string {
  if (!href) return ''
  if (href.startsWith('http')) return href
  if (href.startsWith('//')) return `https:${href}`
  if (href.startsWith('/')) return `${baseUrl}${href}`
  return `${baseUrl}/${href}`
}

async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const html = await fetchHtml(url)
  const baseUrl = new URL(url).origin

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)
  const title = ogTitleMatch?.[1] || titleMatch?.[1]?.trim() || ''

  // Description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)
  const description = ogDescMatch?.[1] || descMatch?.[1] || ''

  // Logo extraction (priority order)
  let logo = ''
  const logoCandidates: string[] = []

  // Apple touch icon
  const appleIcon = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i)
    || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon["']/i)
  if (appleIcon) logoCandidates.push(resolveUrl(appleIcon[1], baseUrl))

  // og:image
  const ogImg = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
  if (ogImg) logoCandidates.push(resolveUrl(ogImg[1], baseUrl))

  // <img> with "logo" in attributes
  const logoImgs = [...html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*(?:class|id|alt)=["'][^"']*logo[^"']*["']/gi)]
  const logoImgs2 = [...html.matchAll(/<img[^>]*(?:class|id|alt)=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/gi)]
  for (const m of [...logoImgs, ...logoImgs2]) logoCandidates.push(resolveUrl(m[1], baseUrl))

  // Sized favicon (32px+)
  const iconSized = html.match(/<link[^>]*rel=["']icon["'][^>]*sizes=["'](\d+)x\d+["'][^>]*href=["']([^"']+)["']/i)
  if (iconSized && parseInt(iconSized[1]) >= 32) logoCandidates.push(resolveUrl(iconSized[2], baseUrl))

  // Any favicon
  const favicon = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)
    || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i)
  if (favicon) logoCandidates.push(resolveUrl(favicon[1], baseUrl))

  // Try candidates
  for (const candidate of logoCandidates) {
    if (!candidate) continue
    try {
      const check = await fetch(candidate, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
      if (check.ok) { logo = candidate; break }
    } catch { /* skip */ }
  }
  if (!logo) {
    const domain = new URL(url).hostname.replace('www.', '')
    logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }

  // Colors from CSS (inline styles + <style> blocks)
  const colors = extractColors(html)

  // Fonts from CSS
  const fonts = extractFonts(html)

  // Images (product images, hero images)
  const images = extractImages(html, baseUrl)

  // Social links
  const socialLinks = extractSocialLinks(html)

  return { html, title, description, logo, colors, fonts, images, socialLinks }
}

// ─── Color Extraction ────────────────────────────────────────

function extractColors(html: string): string[] {
  const colorSet = new Set<string>()

  // Extract hex colors from inline styles and style blocks
  const hexMatches = html.matchAll(/#([0-9a-fA-F]{6})\b/g)
  for (const m of hexMatches) {
    const hex = `#${m[1].toLowerCase()}`
    // Skip near-white and near-black (not brand colors usually)
    if (hex !== '#ffffff' && hex !== '#000000' && hex !== '#f8f8f8' && hex !== '#333333') {
      colorSet.add(hex)
    }
  }

  // Extract rgb/rgba colors
  const rgbMatches = html.matchAll(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g)
  for (const m of rgbMatches) {
    const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3])
    if (r === 255 && g === 255 && b === 255) continue
    if (r === 0 && g === 0 && b === 0) continue
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    colorSet.add(hex)
  }

  // Extract CSS custom property color values
  const varMatches = html.matchAll(/--[a-z-]*color[^:]*:\s*#([0-9a-fA-F]{6})/gi)
  for (const m of varMatches) colorSet.add(`#${m[1].toLowerCase()}`)

  // Also check theme-color meta
  const themeColor = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i)
  if (themeColor) colorSet.add(themeColor[1].toLowerCase())

  return [...colorSet].slice(0, 8)
}

// ─── Font Extraction ─────────────────────────────────────────

function extractFonts(html: string): string[] {
  const fontSet = new Set<string>()

  // Google Fonts links
  const gfMatches = html.matchAll(/fonts\.googleapis\.com\/css2?\?family=([^"&]+)/g)
  for (const m of gfMatches) {
    const families = decodeURIComponent(m[1]).split('|')
    for (const f of families) {
      const name = f.split(':')[0].replace(/\+/g, ' ').trim()
      if (name) fontSet.add(name)
    }
  }

  // font-family declarations in CSS
  const ffMatches = html.matchAll(/font-family\s*:\s*["']?([^;"'\}]+)/gi)
  for (const m of ffMatches) {
    const families = m[1].split(',')
    const first = families[0].trim().replace(/["']/g, '')
    // Skip generic families
    if (!['sans-serif', 'serif', 'monospace', 'cursive', 'system-ui', 'inherit', 'initial', 'unset', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Tahoma'].includes(first) && first.length > 1) {
      fontSet.add(first)
    }
  }

  // Adobe/Typekit fonts
  const typekitMatch = html.match(/use\.typekit\.net\/([a-z0-9]+)\.css/i)
  if (typekitMatch) fontSet.add('Adobe Typekit')

  return [...fontSet].slice(0, 4)
}

// ─── Image Extraction ────────────────────────────────────────

function extractImages(html: string, baseUrl: string): string[] {
  const imageSet = new Set<string>()

  // og:image
  const ogImg = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
  if (ogImg) imageSet.add(resolveUrl(ogImg[1], baseUrl))

  // Product images and hero images (skip tiny icons, logos, tracking pixels)
  const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)
  for (const m of imgMatches) {
    const src = resolveUrl(m[1], baseUrl)
    // Skip data URIs, tracking pixels, tiny images
    if (src.startsWith('data:')) continue
    if (src.includes('pixel') || src.includes('tracking') || src.includes('spacer')) continue
    if (src.includes('.svg') && src.includes('icon')) continue
    // Check for width/height hints
    const widthMatch = m[0].match(/width=["']?(\d+)/i)
    if (widthMatch && parseInt(widthMatch[1]) < 50) continue
    imageSet.add(src)
  }

  // CSS background images
  const bgMatches = html.matchAll(/background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi)
  for (const m of bgMatches) {
    const src = resolveUrl(m[1], baseUrl)
    if (!src.startsWith('data:')) imageSet.add(src)
  }

  return [...imageSet].slice(0, 12)
}

// ─── Social Link Extraction ─────────────────────────────────

function extractSocialLinks(html: string): Record<string, string> {
  const links: Record<string, string> = {}
  const platforms: [string, RegExp][] = [
    ['instagram', /https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/],
    ['facebook', /https?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_.]+)/],
    ['x', /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/],
    ['tiktok', /https?:\/\/(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_.]+)/],
    ['linkedin', /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/([a-zA-Z0-9_-]+)/],
    ['pinterest', /https?:\/\/(?:www\.)?pinterest\.com\/([a-zA-Z0-9_]+)/],
  ]
  for (const [platform, regex] of platforms) {
    const match = html.match(regex)
    if (match) links[platform] = platform === 'instagram' ? `@${match[1]}` : match[1]
  }
  return links
}

// ─── Industry Detection ──────────────────────────────────────

function detectIndustry(title: string, description: string, html: string): string {
  const text = `${title} ${description}`.toLowerCase()
  const keywords: [string, string[]][] = [
    ['Jewellery & Luxury', ['jewel', 'gold', 'diamond', 'luxury', 'precious', 'gem', 'ring', 'necklace', 'bracelet']],
    ['Fashion & Apparel', ['fashion', 'clothing', 'apparel', 'wear', 'dress', 'style', 'boutique', 'collection']],
    ['Beauty & Cosmetics', ['beauty', 'skincare', 'cosmetic', 'makeup', 'skin', 'serum', 'cream']],
    ['Food & Beverage', ['food', 'restaurant', 'cafe', 'coffee', 'drink', 'cuisine', 'menu', 'kitchen', 'bakery']],
    ['Technology', ['tech', 'software', 'app', 'digital', 'platform', 'saas', 'cloud', 'ai', 'data']],
    ['Fitness & Wellness', ['fitness', 'gym', 'workout', 'health', 'wellness', 'yoga', 'sport']],
    ['Home & Lifestyle', ['home', 'furniture', 'decor', 'interior', 'living', 'garden']],
    ['E-commerce', ['shop', 'store', 'buy', 'cart', 'product', 'price', 'sale', 'order']],
    ['Professional Services', ['consulting', 'agency', 'service', 'solution', 'partner', 'enterprise']],
    ['Creative Agency', ['creative', 'design', 'studio', 'brand', 'marketing', 'media']],
  ]
  for (const [industry, words] of keywords) {
    if (words.some(w => text.includes(w))) return industry
  }
  // Check body too for more context
  const bodyText = html.replace(/<[^>]+>/g, '').toLowerCase().slice(0, 5000)
  for (const [industry, words] of keywords) {
    const matchCount = words.filter(w => bodyText.includes(w)).length
    if (matchCount >= 2) return industry
  }
  return 'E-commerce'
}

// ─── Main Analyzer ───────────────────────────────────────────

export async function analyzeBrand(
  url: string,
  onProgress?: (progress: AnalysisProgress) => void
): Promise<BrandDNA> {
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]

  // Step 1: Scrape website
  onProgress?.({ step: 'scanning', progress: 10, message: 'Scanning website...' })

  let scraped: ScrapedData
  try {
    scraped = await scrapeWebsite(url)
  } catch {
    // If scraping fails, use minimal fallback
    scraped = {
      html: '', title: domain.split('.')[0], description: '',
      logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      colors: [], fonts: [], images: [], socialLinks: {},
    }
  }

  onProgress?.({ step: 'scanning', progress: 25, message: 'Website scanned.' })

  // Step 2: Extract colors
  onProgress?.({ step: 'extracting-colors', progress: 40, message: 'Extracting colors...' })

  const scrapedColors = scraped.colors
  const primary = scrapedColors[0] || '#333333'
  const secondary = scrapedColors[1] || '#666666'
  const accent = scrapedColors[2] || '#999999'
  const palette = scrapedColors.length > 0
    ? scrapedColors.slice(0, 6)
    : [primary, secondary, accent]

  // Step 3: Extract typography
  onProgress?.({ step: 'analyzing-typography', progress: 55, message: 'Analyzing typography...' })

  const scrapedFonts = scraped.fonts
  const headingFont = scrapedFonts[0] || 'System Default'
  const bodyFont = scrapedFonts[1] || scrapedFonts[0] || 'System Default'

  // Step 4: Detect industry and generate name
  const name = scraped.title
    ? scraped.title.split('|')[0].split('–')[0].split('-')[0].split('—')[0].trim()
    : domain.split('.')[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const industry = detectIndustry(scraped.title, scraped.description, scraped.html)

  // Step 5: AI voice analysis
  onProgress?.({ step: 'learning-voice', progress: 70, message: 'Learning brand voice...' })

  const voiceAnalysis = await analyzeBrandVoice({
    url,
    name,
    colors: { primary, secondary, accent },
    typography: { heading: headingFont, body: bodyFont },
    industry,
  })

  // Step 6: Summary
  onProgress?.({ step: 'generating-summary', progress: 90, message: 'Generating summary...' })

  const brandDNA: BrandDNA = {
    name,
    url,
    logo: { primary: scraped.logo, variants: [] },
    colors: {
      primary,
      secondary,
      accent,
      background: '#ffffff',
      text: '#1a1a1a',
      palette,
    },
    typography: {
      heading: headingFont,
      body: bodyFont,
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
    summary: scraped.description || voiceAnalysis.summary,
    images: {
      scraped: scraped.images,
      uploaded: [],
      products: [],
    },
    socialProfiles: Object.keys(scraped.socialLinks).length > 0 ? scraped.socialLinks : undefined,
  }

  onProgress?.({ step: 'generating-summary', progress: 100, message: 'Complete!' })

  return brandDNA
}
