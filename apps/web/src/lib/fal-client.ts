/**
 * Fal.ai Client
 * Image generation with nano-banana-2 model
 */

const FAL_API_KEY = process.env.FAL_AI_KEY

if (!FAL_API_KEY) {
  console.warn('FAL_AI_KEY not configured')
}

interface GenerateImageOptions {
  prompt: string
  negative_prompt?: string
  image_size?: 'square' | 'portrait' | 'landscape' | 'square_hd' | 'portrait_4_3' | 'landscape_4_3' | 'portrait_16_9' | 'landscape_16_9'
  num_images?: number
  guidance_scale?: number
  num_inference_steps?: number
  seed?: number
}

interface FalImageResponse {
  images: Array<{
    url: string
    width: number
    height: number
    content_type: string
  }>
  timings: {
    inference: number
  }
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}

/**
 * Generate images using Fal.ai nano-banana-2 model
 * Fast, high-quality image generation
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<FalImageResponse> {
  if (!FAL_API_KEY) {
    throw new Error('FAL_AI_KEY not configured')
  }

  const {
    prompt,
    negative_prompt = '',
    image_size = 'square_hd',
    num_images = 1,
    guidance_scale = 3.5,
    num_inference_steps = 28,
    seed,
  } = options

  const response = await fetch('https://fal.run/fal-ai/nano-banana-2', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      negative_prompt,
      image_size,
      num_images,
      guidance_scale,
      num_inference_steps,
      ...(seed && { seed }),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Fal.ai error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Generate photoshoot images
 */
export async function generatePhotoshoot(
  template: string,
  productName: string,
  brandStyle?: string
) {
  const prompts = {
    product: `Professional product photography of ${productName}, clean white background, studio lighting, high quality, commercial photography${brandStyle ? `, ${brandStyle} style` : ''}`,
    lifestyle: `Lifestyle photography of ${productName}, natural setting, authentic, real-world use, beautiful lighting${brandStyle ? `, ${brandStyle} aesthetic` : ''}`,
    minimal: `Minimalist photography of ${productName}, simple composition, negative space, elegant, clean${brandStyle ? `, ${brandStyle} vibe` : ''}`,
    vibrant: `Vibrant colorful photography of ${productName}, bold colors, energetic, eye-catching${brandStyle ? `, ${brandStyle} palette` : ''}`,
    monochrome: `Black and white photography of ${productName}, dramatic lighting, high contrast, artistic${brandStyle ? `, ${brandStyle} mood` : ''}`,
  }

  const prompt = prompts[template as keyof typeof prompts] || prompts.product

  return generateImage({
    prompt,
    negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy',
    image_size: 'square_hd',
    num_images: 4,
    guidance_scale: 3.5,
    num_inference_steps: 28,
  })
}

/**
 * Generate campaign creative
 */
export async function generateCampaignCreative(
  campaignTheme: string,
  platform: string,
  brandColors?: string
) {
  const sizeMap = {
    instagram: 'square_hd',
    facebook: 'landscape_16_9',
    twitter: 'landscape_16_9',
    linkedin: 'landscape_4_3',
    tiktok: 'portrait_16_9',
    pinterest: 'portrait_4_3',
  } as const

  const imageSize = sizeMap[platform as keyof typeof sizeMap] || 'square_hd'

  return generateImage({
    prompt: `Marketing campaign visual for ${campaignTheme}, professional, eye-catching, modern design${brandColors ? `, using ${brandColors} color scheme` : ''}`,
    negative_prompt: 'text, watermark, logo, blurry, low quality',
    image_size: imageSize,
    num_images: 3,
    guidance_scale: 4.0,
    num_inference_steps: 32,
  })
}

/**
 * Generate brand visual assets
 */
export async function generateBrandAsset(
  assetType: 'hero' | 'banner' | 'social' | 'thumbnail',
  description: string,
  brandStyle?: string
) {
  const sizeMap = {
    hero: 'landscape_16_9',
    banner: 'landscape_16_9',
    social: 'square_hd',
    thumbnail: 'portrait_4_3',
  }

  return generateImage({
    prompt: `${assetType} image for ${description}, professional, high quality${brandStyle ? `, ${brandStyle} aesthetic` : ''}`,
    negative_prompt: 'text, watermark, blurry, low quality, amateur',
    image_size: sizeMap[assetType],
    num_images: 2,
    guidance_scale: 3.5,
    num_inference_steps: 28,
  })
}

/**
 * Quick test function
 */
export async function testFalAI() {
  return generateImage({
    prompt: 'A beautiful sunset over mountains, dramatic lighting, high quality',
    image_size: 'landscape_16_9',
    num_images: 1,
  })
}
