import { NextRequest, NextResponse } from 'next/server'

const FAL_API_KEY = process.env.FAL_AI_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image_url, scene_description, num_results } = body

    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 })
    }

    if (!FAL_API_KEY) {
      return NextResponse.json({ error: 'FAL_AI_KEY not configured' }, { status: 500 })
    }

    const response = await fetch('https://fal.run/fal-ai/bria/product-shot', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url,
        scene_description: scene_description || 'clean white background, professional studio lighting, product photography',
        optimize_description: true,
        num_results: Math.min(num_results || 1, 4),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Fal.ai product-shot error:', response.status, error)
      return NextResponse.json({ error: 'Product shot generation failed' }, { status: 500 })
    }

    const result = await response.json()
    // Normalize response to match generate-image format
    return NextResponse.json({ images: result.images || [] })
  } catch (error) {
    console.error('Product shot error:', error)
    return NextResponse.json({ error: 'Failed to generate product shot' }, { status: 500 })
  }
}
