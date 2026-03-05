import { Hono } from 'hono'
import { prisma } from '@repo/db'
import OpenAI from 'openai'

export const abTestRouter = new Hono()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

interface ABRecommendation {
  element: string
  variantA: string
  variantB: string
  hypothesis: string
  expectedLift: string
  priority: 'high' | 'medium' | 'low'
}

// GET /api/ab-test/recommendations/:campaignId
abTestRouter.get('/recommendations/:campaignId', async (c) => {
  try {
    const campaignId = c.req.param('campaignId')

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        creatives: { take: 5, orderBy: { createdAt: 'desc' } },
        brand: { select: { name: true, industry: true } },
      },
    })

    if (!campaign) return c.json({ error: 'Campaign not found' }, 404)

    const creativeData = campaign.creatives.map((cr) => ({
      platform: cr.platform,
      publishStatus: cr.publishStatus,
      header: cr.header,
    }))

    const recommendations = await generateABRecommendations({
      brandName: campaign.brand.name,
      industry: campaign.brand.industry || 'general',
      objective: campaign.objective,
      platforms: campaign.platforms,
      creativeCount: campaign.creatives.length,
      creativeData,
    })

    return c.json({ data: recommendations })
  } catch (error) {
    console.error('A/B test recommendations error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /api/ab-test/suggestions/:creativeId
abTestRouter.get('/suggestions/:creativeId', async (c) => {
  try {
    const creativeId = c.req.param('creativeId')

    const creative = await prisma.creative.findUnique({
      where: { id: creativeId },
      include: {
        campaign: {
          select: { objective: true, brand: { select: { name: true } } },
        },
      },
    })

    if (!creative) return c.json({ error: 'Creative not found' }, 404)

    const header = creative.header as Record<string, unknown> | null
    const description = creative.description as Record<string, unknown> | null
    const cta = creative.cta as Record<string, unknown> | null

    const suggestions = await generateCreativeSuggestions({
      platform: creative.platform,
      objective: creative.campaign.objective,
      brandName: creative.campaign.brand.name,
      headerText: (header?.text as string) || '',
      descriptionText: (description?.text as string) || '',
      ctaText: (cta?.text as string) || '',
    })

    return c.json({ data: suggestions })
  } catch (error) {
    console.error('A/B creative suggestions error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

async function generateABRecommendations(input: {
  brandName: string
  industry: string
  objective: string
  platforms: string[]
  creativeCount: number
  creativeData: unknown[]
}): Promise<ABRecommendation[]> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackRecommendations(input.objective, input.platforms)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a CRO expert. Generate A/B test recommendations as JSON.',
        },
        {
          role: 'user',
          content: `Generate 3-4 A/B test recommendations for:
Brand: ${input.brandName} (${input.industry})
Objective: ${input.objective}
Platforms: ${input.platforms.join(', ')}
Active Creatives: ${input.creativeCount}

Return JSON array. Each item: element, variantA, variantB, hypothesis, expectedLift (e.g. "+12%"), priority ("high"|"medium"|"low").
Return ONLY valid JSON array, no markdown.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return fallbackRecommendations(input.objective, input.platforms)

    const parsed = JSON.parse(content) as ABRecommendation[]
    return Array.isArray(parsed) ? parsed.slice(0, 4) : fallbackRecommendations(input.objective, input.platforms)
  } catch {
    return fallbackRecommendations(input.objective, input.platforms)
  }
}

async function generateCreativeSuggestions(input: {
  platform: string
  objective: string
  brandName: string
  headerText: string
  descriptionText: string
  ctaText: string
}): Promise<{ original: string; variant: string; element: string; reason: string }[]> {
  if (!process.env.OPENAI_API_KEY) {
    return [
      { original: input.headerText || 'Current headline', variant: `Discover ${input.brandName}`, element: 'headline', reason: 'Shorter, curiosity-driven headline tends to improve CTR' },
      { original: input.ctaText || 'Shop Now', variant: 'Get Started Free', element: 'cta', reason: 'Low-commitment CTA reduces friction' },
    ]
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an A/B testing copywriter. Suggest copy variants as JSON.',
        },
        {
          role: 'user',
          content: `Suggest 2-3 A/B test variants for this ${input.platform} creative:
Brand: ${input.brandName}
Objective: ${input.objective}
Headline: "${input.headerText}"
Description: "${input.descriptionText}"
CTA: "${input.ctaText}"

Return JSON array with: original, variant, element ("headline"|"description"|"cta"), reason.
Return ONLY valid JSON array, no markdown.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return []
    return JSON.parse(content)
  } catch {
    return []
  }
}

function fallbackRecommendations(objective: string, platforms: string[]): ABRecommendation[] {
  const recs: ABRecommendation[] = [
    {
      element: 'Headline Copy',
      variantA: 'Benefit-focused headline emphasizing value',
      variantB: 'Urgency-driven headline with time constraint',
      hypothesis: 'Urgency messaging increases click-through by creating FOMO',
      expectedLift: '+15%',
      priority: 'high',
    },
    {
      element: 'CTA Button',
      variantA: 'Shop Now',
      variantB: 'Get Started Free',
      hypothesis: 'Lower-commitment CTA reduces friction and improves conversion',
      expectedLift: '+8%',
      priority: 'medium',
    },
    {
      element: 'Visual Style',
      variantA: 'Product-focused hero image',
      variantB: 'Lifestyle scene with product in context',
      hypothesis: 'Lifestyle imagery creates emotional connection and improves engagement',
      expectedLift: '+12%',
      priority: 'high',
    },
  ]

  if (objective === 'CONVERSION') {
    recs.push({
      element: 'Social Proof',
      variantA: 'No social proof element',
      variantB: 'Customer review quote overlay',
      hypothesis: 'Social proof increases trust and conversion rate',
      expectedLift: '+20%',
      priority: 'high',
    })
  }

  if (platforms.includes('instagram') || platforms.includes('tiktok')) {
    recs.push({
      element: 'Format',
      variantA: 'Static image creative',
      variantB: 'Short-form video (15s)',
      hypothesis: 'Video content drives higher engagement on visual-first platforms',
      expectedLift: '+25%',
      priority: 'medium',
    })
  }

  return recs.slice(0, 4)
}
