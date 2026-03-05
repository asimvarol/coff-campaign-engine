const FAL_API_KEY = process.env.FAL_AI_KEY

function isConfigured(): boolean {
  return !!FAL_API_KEY
}

interface FalImageResponse {
  images: Array<{
    url: string
    width: number
    height: number
    content_type: string
  }>
  timings: { inference: number }
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}

type ImageSize =
  | 'square_hd'
  | 'portrait_4_3'
  | 'landscape_4_3'
  | 'portrait_16_9'
  | 'landscape_16_9'

interface GenerateOptions {
  prompt: string
  negativePrompt?: string
  imageSize?: ImageSize
  numImages?: number
  guidanceScale?: number
  steps?: number
}

async function generateImages(options: GenerateOptions): Promise<FalImageResponse> {
  if (!isConfigured()) {
    throw new Error('FAL_AI_KEY not configured')
  }

  const response = await fetch('https://fal.run/fal-ai/nano-banana-2', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: options.prompt,
      negative_prompt: options.negativePrompt || 'blurry, low quality, distorted, ugly, watermark, text',
      image_size: options.imageSize || 'square_hd',
      num_images: options.numImages || 1,
      guidance_scale: options.guidanceScale || 3.5,
      num_inference_steps: options.steps || 28,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Fal.ai error: ${response.status} - ${error}`)
  }

  return response.json()
}

const PLATFORM_SIZE_MAP: Record<string, ImageSize> = {
  instagram: 'square_hd',
  facebook: 'landscape_16_9',
  tiktok: 'portrait_16_9',
  linkedin: 'landscape_4_3',
  x: 'landscape_16_9',
  twitter: 'landscape_16_9',
  pinterest: 'portrait_4_3',
}

export async function generateCampaignCreative(
  conceptName: string,
  conceptDescription: string,
  colorMood: string,
  platform: string,
  brandColors: { primary: string; accent: string }
): Promise<string> {
  if (!isConfigured()) {
    return placeholderUrl(platform, brandColors)
  }

  try {
    const result = await generateImages({
      prompt: `Marketing campaign visual for "${conceptName}": ${conceptDescription}. ${colorMood}. Professional, eye-catching, modern design, using ${brandColors.primary} and ${brandColors.accent} color scheme`,
      negativePrompt: 'text, watermark, logo, blurry, low quality, ugly, amateur',
      imageSize: PLATFORM_SIZE_MAP[platform] || 'square_hd',
      numImages: 1,
      guidanceScale: 4.0,
      steps: 32,
    })

    const url = result.images[0]?.url
    if (!url) throw new Error('No image in response')
    return url
  } catch (error) {
    console.warn(`Image generation failed for ${platform}:`, error instanceof Error ? error.message : 'Unknown')
    return placeholderUrl(platform, brandColors)
  }
}

export async function generatePhotoshootImages(
  productName: string,
  template: string,
  brandStyle?: string
): Promise<string[]> {
  const prompts: Record<string, string> = {
    product: `Professional product photography of ${productName}, clean white background, studio lighting, high quality, commercial photography${brandStyle ? `, ${brandStyle} style` : ''}`,
    lifestyle: `Lifestyle photography of ${productName}, natural setting, authentic, real-world use, beautiful lighting${brandStyle ? `, ${brandStyle} aesthetic` : ''}`,
    minimal: `Minimalist photography of ${productName}, simple composition, negative space, elegant, clean${brandStyle ? `, ${brandStyle} vibe` : ''}`,
    vibrant: `Vibrant colorful photography of ${productName}, bold colors, energetic, eye-catching${brandStyle ? `, ${brandStyle} palette` : ''}`,
    monochrome: `Black and white photography of ${productName}, dramatic lighting, high contrast, artistic${brandStyle ? `, ${brandStyle} mood` : ''}`,
  }

  const prompt = prompts[template] || prompts.product!

  if (!isConfigured()) {
    return Array.from({ length: 4 }, (_, i) =>
      `https://placehold.co/1080x1080/1c1b1b/e6d3c1?text=${encodeURIComponent(`${template}-${i + 1}`)}`
    )
  }

  try {
    const result = await generateImages({
      prompt,
      negativePrompt: 'blurry, low quality, distorted, ugly, bad anatomy, watermark',
      imageSize: 'square_hd',
      numImages: 4,
    })

    return result.images.map((img) => img.url)
  } catch (error) {
    console.warn(`Photoshoot generation failed for ${template}:`, error instanceof Error ? error.message : 'Unknown')
    return Array.from({ length: 4 }, (_, i) =>
      `https://placehold.co/1080x1080/1c1b1b/e6d3c1?text=${encodeURIComponent(`${template}-${i + 1}`)}`
    )
  }
}

export async function removeBackground(imageUrl: string): Promise<string> {
  if (!isConfigured()) {
    return `${imageUrl}?bg=transparent`
  }

  try {
    const response = await fetch('https://fal.run/fal-ai/birefnet', {
      method: 'POST',
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error(`Background removal failed: ${response.status}`)
    }

    const data = await response.json()
    return data.image?.url || `${imageUrl}?bg=transparent`
  } catch (error) {
    console.warn('Background removal failed:', error instanceof Error ? error.message : 'Unknown')
    return `${imageUrl}?bg=transparent`
  }
}

export async function regenerateCreativeImage(
  prompt: string,
  platform: string,
  width: number,
  height: number
): Promise<string> {
  if (!isConfigured()) {
    return `https://placehold.co/${width}x${height}/1c1b1b/e6d3c1?text=regenerated`
  }

  try {
    const result = await generateImages({
      prompt,
      imageSize: PLATFORM_SIZE_MAP[platform] || 'square_hd',
      numImages: 1,
      guidanceScale: 4.0,
      steps: 32,
    })

    return result.images[0]?.url || `https://placehold.co/${width}x${height}/1c1b1b/e6d3c1?text=regenerated`
  } catch {
    return `https://placehold.co/${width}x${height}/1c1b1b/e6d3c1?text=regenerated`
  }
}

function placeholderUrl(platform: string, brandColors: { primary: string; accent: string }): string {
  const fg = brandColors.primary.replace(/^#/, '')
  const bg = brandColors.accent.replace(/^#/, '')
  return `https://placehold.co/1080x1080/${fg}/${bg}?text=${encodeURIComponent(platform)}`
}
