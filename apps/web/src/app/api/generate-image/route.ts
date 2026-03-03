import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/fal-client'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, negative_prompt, image_size, num_images } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const result = await generateImage({
      prompt,
      negative_prompt,
      image_size,
      num_images,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      },
      { status: 500 }
    )
  }
}
