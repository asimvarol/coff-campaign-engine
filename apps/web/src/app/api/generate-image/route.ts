import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const FAL_API_KEY = process.env.FAL_AI_KEY

const VALID_SIZES = ['square', 'square_hd', 'portrait', 'portrait_4_3', 'portrait_16_9', 'landscape', 'landscape_4_3', 'landscape_16_9']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, negative_prompt, image_size, num_images } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!FAL_API_KEY) {
      return NextResponse.json({ error: 'FAL_AI_KEY not configured' }, { status: 500 })
    }

    const size = VALID_SIZES.includes(image_size) ? image_size : 'square_hd'

    const response = await fetch('https://fal.run/fal-ai/nano-banana-2', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: negative_prompt || 'text, watermark, logo, blurry, low quality',
        image_size: size,
        num_images: Math.min(num_images || 1, 4),
        guidance_scale: 3.5,
        num_inference_steps: 28,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Fal.ai error:', response.status, error)
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
