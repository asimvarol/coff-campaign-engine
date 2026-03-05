import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { generateImage } from '@/lib/fal-client'

const MAX_IMAGES = 4
const MAX_PROMPT_LENGTH = 1000

export async function POST(request: NextRequest) {
  const { error } = await requireAuth()
  if (error) return error

  try {
    const body = await request.json()
    const { prompt, negative_prompt, image_size, num_images } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (typeof prompt !== 'string' || prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: `Prompt must be under ${MAX_PROMPT_LENGTH} characters` }, { status: 400 })
    }

    if (num_images && (typeof num_images !== 'number' || num_images > MAX_IMAGES || num_images < 1)) {
      return NextResponse.json({ error: `num_images must be between 1 and ${MAX_IMAGES}` }, { status: 400 })
    }

    const result = await generateImage({
      prompt,
      negative_prompt,
      image_size,
      num_images: Math.min(num_images || 1, MAX_IMAGES),
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('Image generation error:', err)
    return NextResponse.json(
      { error: 'Failed to generate image', code: 'IMAGE_GENERATION_FAILED' },
      { status: 500 }
    )
  }
}
