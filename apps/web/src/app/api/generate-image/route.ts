import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

const SIZE_MAP: Record<string, 'auto' | '1024x1024' | '1536x1024' | '1024x1536'> = {
  square: '1024x1024',
  square_hd: '1024x1024',
  portrait: '1024x1536',
  portrait_4_3: '1024x1536',
  portrait_16_9: '1024x1536',
  landscape: '1536x1024',
  landscape_4_3: '1536x1024',
  landscape_16_9: '1536x1024',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, image_size, num_images } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
    }

    const size = SIZE_MAP[image_size] || '1024x1024'
    const count = Math.min(num_images || 1, 1) // DALL-E 3 supports 1 at a time

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt}. Do NOT include any text, words, letters, or watermarks in the image.`,
      n: count,
      size,
      quality: 'standard',
    })

    const images = response.data.map((img) => ({
      url: img.url,
      width: size === '1536x1024' ? 1536 : 1024,
      height: size === '1024x1536' ? 1536 : 1024,
      content_type: 'image/png',
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    )
  }
}
