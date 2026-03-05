import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

function isConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

interface ConceptInput {
  brandName: string
  brandVoice: string[]
  brandValues: string[]
  objective: string
  platforms: string[]
  description?: string
}

export interface GeneratedConcept {
  name: string
  description: string
  emotion: string
  hashtags: string[]
  colorMood: string
  textPosition: string
}

export async function generateConcepts(input: ConceptInput): Promise<GeneratedConcept[]> {
  if (!isConfigured()) {
    return fallbackConcepts(input)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a creative director at a top advertising agency. Generate campaign concepts as JSON.`,
        },
        {
          role: 'user',
          content: `Generate 3 unique campaign concepts for:
Brand: ${input.brandName}
Voice: ${input.brandVoice.join(', ')}
Values: ${input.brandValues.join(', ')}
Objective: ${input.objective}
Platforms: ${input.platforms.join(', ')}
${input.description ? `Brief: ${input.description}` : ''}

Return a JSON array of 3 concepts. Each concept must have:
- name: catchy campaign name (2-4 words)
- description: compelling 1-2 sentence description
- emotion: target emotion (1-2 words)
- hashtags: array of 3-4 relevant hashtags
- colorMood: suggested color mood (1 sentence)
- textPosition: "top" | "center" | "bottom"

Return ONLY valid JSON array, no markdown.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return fallbackConcepts(input)

    const parsed = JSON.parse(content) as GeneratedConcept[]
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackConcepts(input)

    return parsed.slice(0, 3)
  } catch (error) {
    console.error('OpenAI concept generation failed:', error)
    return fallbackConcepts(input)
  }
}

interface InsightInput {
  totalReach: number
  totalEngagement: number
  avgCtr: number
  topPlatform: string
  campaignCount: number
  period: string
}

export interface GeneratedInsight {
  title: string
  description: string
  type: 'success' | 'warning' | 'info'
  metric?: string
  action?: string
}

export async function generateInsights(input: InsightInput): Promise<GeneratedInsight[]> {
  if (!isConfigured()) {
    return fallbackInsights(input)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing analytics expert. Analyze performance data and generate actionable insights as JSON.',
        },
        {
          role: 'user',
          content: `Analyze this marketing performance data and generate 3-5 insights:
Period: ${input.period}
Total Reach: ${input.totalReach.toLocaleString()}
Total Engagement: ${input.totalEngagement.toLocaleString()}
Average CTR: ${input.avgCtr}%
Top Platform: ${input.topPlatform}
Active Campaigns: ${input.campaignCount}

Return a JSON array. Each insight must have:
- title: short title (3-6 words)
- description: actionable 1-2 sentence insight
- type: "success" | "warning" | "info"
- metric: relevant metric value (optional)
- action: suggested action (optional)

Return ONLY valid JSON array, no markdown.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return fallbackInsights(input)

    const parsed = JSON.parse(content) as GeneratedInsight[]
    if (!Array.isArray(parsed)) return fallbackInsights(input)

    return parsed.slice(0, 5)
  } catch (error) {
    console.error('OpenAI insights generation failed:', error)
    return fallbackInsights(input)
  }
}

interface BrandAnalysisInput {
  url: string
  name: string
  colors: { primary: string; secondary: string; accent: string }
  typography: { heading: string; body: string }
  industry?: string
}

export async function analyzeBrandVoice(input: BrandAnalysisInput): Promise<{
  tone: string[]
  personality: string[]
  keywords: string[]
  sampleTexts: string[]
  values: string[]
  aesthetic: string[]
  targetAudience: string
  summary: string
}> {
  if (!isConfigured()) {
    return {
      tone: ['Professional', 'Friendly', 'Elegant'],
      personality: ['Authentic', 'Innovative', 'Caring'],
      keywords: ['quality', 'authentic', 'modern'],
      sampleTexts: [
        `Discover the essence of ${input.name}.`,
        `Where quality meets innovation.`,
        `Experience ${input.name}: modern design at its finest.`,
      ],
      values: ['Quality', 'Innovation', 'Authenticity'],
      aesthetic: ['modern minimalism', 'clean contemporary'],
      targetAudience: 'Modern consumers aged 25-45 seeking quality and innovation',
      summary: `${input.name} embodies modern minimalism. With a focus on quality and innovation, the brand speaks to authentic individuals.`,
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a brand strategist. Analyze brand identity and return structured JSON.',
        },
        {
          role: 'user',
          content: `Analyze this brand and generate its identity profile:
URL: ${input.url}
Name: ${input.name}
Primary Color: ${input.colors.primary}
Secondary Color: ${input.colors.secondary}
Heading Font: ${input.typography.heading}
Body Font: ${input.typography.body}
${input.industry ? `Industry: ${input.industry}` : ''}

Return JSON with:
- tone: array of 3 tone words
- personality: array of 3 personality traits
- keywords: array of 3 brand keywords
- sampleTexts: array of 3 sample marketing copy lines
- values: array of 3 brand values
- aesthetic: array of 2 aesthetic descriptors
- targetAudience: 1 sentence target audience description
- summary: 2-3 sentence brand summary

Return ONLY valid JSON, no markdown.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) throw new Error('Empty response')

    return JSON.parse(content)
  } catch (error) {
    console.error('OpenAI brand analysis failed:', error)
    return {
      tone: ['Professional', 'Friendly', 'Elegant'],
      personality: ['Authentic', 'Innovative', 'Caring'],
      keywords: ['quality', 'authentic', 'modern'],
      sampleTexts: [
        `Discover the essence of ${input.name}.`,
        `Where quality meets innovation.`,
        `Experience ${input.name}: modern design at its finest.`,
      ],
      values: ['Quality', 'Innovation', 'Authenticity'],
      aesthetic: ['modern minimalism', 'clean contemporary'],
      targetAudience: 'Modern consumers aged 25-45 seeking quality and innovation',
      summary: `${input.name} embodies modern minimalism. With a focus on quality and innovation, the brand speaks to authentic individuals.`,
    }
  }
}

export async function generateBestPostingTimes(
  platform: string,
  historicalData: { hour: number; engagement: number }[]
): Promise<{ time: string; score: number; reason: string }[]> {
  if (!isConfigured() || historicalData.length === 0) {
    return fallbackBestTimes(platform)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a social media timing expert. Analyze engagement data and recommend posting times.',
        },
        {
          role: 'user',
          content: `Based on this engagement data for ${platform}, suggest 3 best posting times:

Hourly engagement: ${JSON.stringify(historicalData.slice(0, 24))}

Return JSON array with: time (HH:MM), score (0-100), reason (1 sentence).
Return ONLY valid JSON array, no markdown.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return fallbackBestTimes(platform)

    return JSON.parse(content)
  } catch {
    return fallbackBestTimes(platform)
  }
}

// Fallbacks when OpenAI is not configured

function fallbackConcepts(input: ConceptInput): GeneratedConcept[] {
  return [
    {
      name: 'Heritage & Elegance',
      description: `Celebrate the timeless beauty of ${input.brandName} with modern elegance and traditional craftsmanship.`,
      emotion: 'Nostalgic Pride',
      hashtags: ['#TimelessElegance', '#Craftsmanship', `#${input.brandName.replace(/\s+/g, '')}`],
      colorMood: 'Warm earth tones with gold accents',
      textPosition: 'bottom',
    },
    {
      name: 'Bold Expression',
      description: `Honor strength and grace through bold, statement-making visuals for ${input.platforms.join(', ')}.`,
      emotion: 'Empowerment',
      hashtags: ['#BoldExpression', '#ConfidentStyle', '#MakeAStatement'],
      colorMood: 'Deep blacks with vibrant accent highlights',
      textPosition: 'top',
    },
    {
      name: 'Authentic Stories',
      description: `Every piece tells a story of connection and cherished moments with ${input.brandName}.`,
      emotion: 'Warmth & Nostalgia',
      hashtags: ['#AuthenticStories', '#RealMoments', '#CherishedTimes'],
      colorMood: 'Soft pastels with warm natural lighting',
      textPosition: 'center',
    },
  ]
}

function fallbackInsights(input: InsightInput): GeneratedInsight[] {
  const insights: GeneratedInsight[] = []

  if (input.avgCtr > 3) {
    insights.push({
      title: 'Strong Click-Through Rate',
      description: `Your average CTR of ${input.avgCtr}% is above industry average. Consider increasing ad spend on ${input.topPlatform}.`,
      type: 'success',
      metric: `${input.avgCtr}% CTR`,
      action: 'Increase budget on top performers',
    })
  } else {
    insights.push({
      title: 'CTR Needs Improvement',
      description: `Your average CTR of ${input.avgCtr}% could be improved. Try A/B testing different creatives.`,
      type: 'warning',
      metric: `${input.avgCtr}% CTR`,
      action: 'A/B test creative variations',
    })
  }

  insights.push({
    title: `${input.topPlatform} Leading Performance`,
    description: `${input.topPlatform} is your top-performing platform this ${input.period}. Consider allocating more resources here.`,
    type: 'info',
    action: `Focus content strategy on ${input.topPlatform}`,
  })

  if (input.totalReach > 10000) {
    insights.push({
      title: 'Growing Reach',
      description: `Total reach of ${input.totalReach.toLocaleString()} shows healthy campaign distribution across ${input.campaignCount} campaigns.`,
      type: 'success',
      metric: `${input.totalReach.toLocaleString()} reach`,
    })
  }

  return insights
}

function fallbackBestTimes(platform: string): { time: string; score: number; reason: string }[] {
  const defaults: Record<string, { time: string; score: number; reason: string }[]> = {
    instagram: [
      { time: '10:00', score: 92, reason: 'Highest engagement for lifestyle content' },
      { time: '14:00', score: 87, reason: 'Strong afternoon engagement' },
      { time: '19:00', score: 85, reason: 'Evening browsing peak' },
    ],
    facebook: [
      { time: '12:00', score: 90, reason: 'Peak lunch break browsing' },
      { time: '15:00', score: 86, reason: 'Mid-afternoon engagement spike' },
      { time: '20:00', score: 82, reason: 'Evening relaxation time' },
    ],
    tiktok: [
      { time: '18:00', score: 95, reason: 'After-work highest engagement' },
      { time: '21:00', score: 91, reason: 'Prime evening entertainment' },
      { time: '12:00', score: 84, reason: 'Lunch break scrolling' },
    ],
    linkedin: [
      { time: '09:00', score: 93, reason: 'Morning professional check-in' },
      { time: '12:00', score: 88, reason: 'Lunch break professional browsing' },
      { time: '17:00', score: 81, reason: 'End-of-day engagement' },
    ],
  }
  return defaults[platform] || defaults.instagram!
}
