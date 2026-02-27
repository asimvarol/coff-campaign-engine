import type { Photoshoot, PhotoshootTemplate, PhotoshootVariant } from '@repo/types'

// Template definitions with sample thumbnails
export const PHOTOSHOOT_TEMPLATES: PhotoshootTemplate[] = [
  {
    id: 'minimalist-studio',
    name: 'Minimalist Studio',
    description: 'Flat color background with soft shadow for clean, professional look',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'minimalist',
  },
  {
    id: 'lifestyle-scene',
    name: 'Lifestyle Scene',
    description: 'Product in everyday context — on table, in hand, or natural environment',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'lifestyle',
  },
  {
    id: 'nature-outdoor',
    name: 'Nature/Outdoor',
    description: 'Natural environment backgrounds — grass, wood, stone textures',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    category: 'nature',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium backgrounds with marble, gold accents, and silk textures',
    thumbnail: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=400&fit=crop',
    category: 'luxury',
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    description: 'Seasonal themes — summer vibes, winter wonderland, spring blossoms',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
    category: 'seasonal',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Geometric patterns and gradient backgrounds for modern aesthetic',
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop',
    category: 'abstract',
  },
  {
    id: 'flat-lay',
    name: 'Flat Lay',
    description: 'Top-down view with complementary props and accessories',
    thumbnail: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    category: 'flatlay',
  },
  {
    id: 'in-use',
    name: 'In Use',
    description: 'Product in action — worn, held, or used by model',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    category: 'inuse',
  },
]

// Style presets for free generation
export const STYLE_PRESETS = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean lines, neutral tones, plenty of white space',
  },
  {
    id: 'vibrant-pop',
    name: 'Vibrant Pop',
    description: 'Bold colors, high contrast, energetic composition',
  },
  {
    id: 'organic-natural',
    name: 'Organic Natural',
    description: 'Earthy tones, natural textures, soft lighting',
  },
  {
    id: 'tech-futuristic',
    name: 'Tech Futuristic',
    description: 'Sleek surfaces, neon accents, sci-fi aesthetic',
  },
  {
    id: 'vintage-retro',
    name: 'Vintage Retro',
    description: 'Nostalgic color grading, film grain, retro vibes',
  },
  {
    id: 'luxury-premium',
    name: 'Luxury Premium',
    description: 'Rich materials, elegant composition, sophisticated palette',
  },
]

// Recent photoshoots (mock data)
export const RECENT_PHOTOSHOOTS: Photoshoot[] = [
  {
    id: 'ps-001',
    mode: 'product',
    brandId: 'brand-001',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    prompt: null,
    templateId: 'minimalist-studio',
    variants: [
      {
        id: 'var-001',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        prompt: 'Product on white background with soft shadow',
        selected: true,
      },
      {
        id: 'var-002',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        prompt: 'Product on beige background with soft shadow',
        selected: false,
      },
    ],
    creditCost: 10,
    status: 'completed',
    createdAt: new Date('2026-02-27T10:30:00Z'),
    updatedAt: new Date('2026-02-27T10:30:00Z'),
  },
  {
    id: 'ps-002',
    mode: 'free',
    brandId: 'brand-002',
    productImage: null,
    prompt: 'Luxury perfume bottle on marble surface with gold accents',
    templateId: null,
    variants: [
      {
        id: 'var-003',
        imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop',
        prompt: 'Luxury perfume bottle on marble surface with gold accents',
        selected: true,
      },
    ],
    creditCost: 3,
    status: 'completed',
    createdAt: new Date('2026-02-26T14:20:00Z'),
    updatedAt: new Date('2026-02-26T14:20:00Z'),
  },
  {
    id: 'ps-003',
    mode: 'product',
    brandId: 'brand-001',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    prompt: null,
    templateId: 'lifestyle-scene',
    variants: [
      {
        id: 'var-004',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        prompt: 'Watch on wooden table with coffee cup',
        selected: true,
      },
      {
        id: 'var-005',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
        prompt: 'Watch on desk with laptop',
        selected: true,
      },
    ],
    creditCost: 10,
    status: 'completed',
    createdAt: new Date('2026-02-25T09:15:00Z'),
    updatedAt: new Date('2026-02-25T09:15:00Z'),
  },
]

// Mock background removal function
export async function mockRemoveBackground(imageUrl: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // In real implementation, this would call fal.ai background removal
  return imageUrl
}

// Mock generation function
export async function mockGenerateVariants(
  mode: 'product' | 'free',
  config: {
    productImage?: string
    templateId?: string
    prompt?: string
    brandId?: string
  }
): Promise<PhotoshootVariant[]> {
  // Simulate generation delay (3-5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 3500))

  // Generate 4 placeholder variants
  const placeholderImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop',
  ]

  return placeholderImages.map((url, index) => ({
    id: `variant-${Date.now()}-${index}`,
    imageUrl: url,
    prompt: config.prompt || `Generated variant ${index + 1}`,
    selected: false,
  }))
}

// Photoshoot stats
export function getPhotoshootStats() {
  return {
    totalShoots: 42,
    thisMonth: 12,
    creditsUsed: 340,
  }
}
