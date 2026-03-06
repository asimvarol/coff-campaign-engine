import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { brandStore } from '../../brands/data-store'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function POST(request: NextRequest) {
  try {
    const { brandId, objective, platforms, description } = await request.json()

    if (!brandId || !objective || !platforms?.length) {
      return NextResponse.json({ error: 'brandId, objective, and platforms are required' }, { status: 400 })
    }

    const brand = brandStore.get(brandId)
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback concepts when no API key
      const concepts = generateFallbackConcepts(brand.name, objective, platforms)
      return NextResponse.json({ data: { concepts } })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative director at a top advertising agency. Generate campaign concepts as JSON.',
        },
        {
          role: 'user',
          content: `Generate 4 unique campaign concepts for:
Brand: ${brand.name}
Industry: ${brand.industry}
Voice: ${brand.voice.tone.join(', ')}
Values: ${brand.values.join(', ')}
Objective: ${objective}
Platforms: ${platforms.join(', ')}
${description ? `Brief: ${description}` : ''}

Return a JSON array of 4 concepts. Each concept must have:
- name: catchy campaign name (2-4 words)
- description: compelling 1-2 sentence description
- emotion: target emotion (1-2 words)
- hashtags: array of 3-4 relevant hashtags (with #)
- colorMood: suggested color mood (1 sentence)
- textPosition: "top" | "center" | "bottom"

Return ONLY valid JSON array, no markdown.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) {
      const concepts = generateFallbackConcepts(brand.name, objective, platforms)
      return NextResponse.json({ data: { concepts } })
    }

    const concepts = JSON.parse(content)
    return NextResponse.json({ data: { concepts } })
  } catch (error) {
    console.error('Error generating concepts:', error)
    return NextResponse.json({ error: 'Failed to generate concepts' }, { status: 500 })
  }
}

function generateFallbackConcepts(brandName: string, objective: string, platforms: string[]) {
  return [
    {
      name: `${brandName} Spotlight`,
      description: `Showcase what makes ${brandName} unique with an authentic behind-the-scenes campaign.`,
      emotion: 'Curiosity',
      hashtags: ['#BehindTheScenes', `#${brandName.replace(/\s+/g, '')}`, '#Authentic'],
      colorMood: 'Warm earth tones with golden accents',
      textPosition: 'center',
    },
    {
      name: 'Bold & Beautiful',
      description: `A visually striking campaign that captures attention and drives ${objective.toLowerCase()} across ${platforms.join(', ')}.`,
      emotion: 'Confidence',
      hashtags: ['#BoldStyle', '#StandOut', `#${brandName.replace(/\s+/g, '')}`],
      colorMood: 'Deep contrasts with vibrant accent colors',
      textPosition: 'top',
    },
    {
      name: 'Story of Craft',
      description: `Celebrate the artistry and dedication behind every product, building deep emotional connection with your audience.`,
      emotion: 'Admiration',
      hashtags: ['#Craftsmanship', '#MadeWithLove', '#QualityMatters'],
      colorMood: 'Soft neutrals with rich material textures',
      textPosition: 'bottom',
    },
    {
      name: 'New Chapter',
      description: `Invite your audience to be part of something new. Fresh perspectives, fresh designs, fresh energy.`,
      emotion: 'Excitement',
      hashtags: ['#NewBeginnings', '#FreshStart', `#${brandName.replace(/\s+/g, '')}Style`],
      colorMood: 'Clean whites and pastels with pops of brand color',
      textPosition: 'center',
    },
  ]
}
