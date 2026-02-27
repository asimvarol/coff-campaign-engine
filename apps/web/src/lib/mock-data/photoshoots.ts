import type { Photoshoot, PhotoshootStatus, PhotoshootTemplate } from '@repo/types'

/**
 * Mock photoshoot data for development and testing
 */
export const mockPhotoshoots: Photoshoot[] = [
  {
    id: 'ps-1',
    name: 'Wireless Headphones',
    productImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    productImageNoBackground: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&bg=transparent',
    brandDnaId: 'brand-1',
    brandDnaName: 'TechFlow',
    status: 'COMPLETED' as PhotoshootStatus,
    creditCost: 10,
    variants: [
      {
        id: 'v-1-1',
        template: 'Minimalist Studio' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800',
        prompt: 'Wireless headphones on minimalist white studio background with soft shadows',
        selected: true,
      },
      {
        id: 'v-1-2',
        template: 'Lifestyle Scene' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800',
        prompt: 'Wireless headphones in modern home office setting with laptop and coffee',
        selected: false,
      },
      {
        id: 'v-1-3',
        template: 'Nature/Outdoor' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=800',
        prompt: 'Wireless headphones on wooden surface with natural lighting and plants',
        selected: true,
      },
      {
        id: 'v-1-4',
        template: 'Luxury' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800',
        prompt: 'Premium wireless headphones on marble surface with gold accents',
        selected: false,
      },
    ],
    selectedVariantIds: ['v-1-1', 'v-1-3'],
    createdAt: new Date('2026-02-25T10:30:00'),
    completedAt: new Date('2026-02-25T10:32:00'),
  },
  {
    id: 'ps-2',
    name: 'Smart Watch',
    productImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    productImageNoBackground: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&bg=transparent',
    brandDnaId: 'brand-1',
    brandDnaName: 'TechFlow',
    status: 'COMPLETED' as PhotoshootStatus,
    creditCost: 10,
    variants: [
      {
        id: 'v-2-1',
        template: 'Minimalist Studio' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800',
        prompt: 'Smart watch on clean white background with dramatic side lighting',
        selected: true,
      },
      {
        id: 'v-2-2',
        template: 'In Use' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=800',
        prompt: 'Smart watch on wrist during fitness activity, active lifestyle shot',
        selected: true,
      },
      {
        id: 'v-2-3',
        template: 'Flat Lay' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&h=800',
        prompt: 'Smart watch flat lay with tech accessories, phone, and earbuds',
        selected: false,
      },
      {
        id: 'v-2-4',
        template: 'Lifestyle Scene' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800',
        prompt: 'Smart watch on desk with MacBook and coffee in modern workspace',
        selected: true,
      },
    ],
    selectedVariantIds: ['v-2-1', 'v-2-2', 'v-2-4'],
    createdAt: new Date('2026-02-24T14:15:00'),
    completedAt: new Date('2026-02-24T14:17:00'),
  },
  {
    id: 'ps-3',
    name: 'Coffee Mug Collection',
    productImageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    productImageNoBackground: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&bg=transparent',
    brandDnaId: 'brand-2',
    brandDnaName: 'BrewCraft',
    status: 'COMPLETED' as PhotoshootStatus,
    creditCost: 10,
    variants: [
      {
        id: 'v-3-1',
        template: 'Minimalist Studio' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800',
        prompt: 'Ceramic coffee mug on white background with soft shadows',
        selected: true,
      },
      {
        id: 'v-3-2',
        template: 'Lifestyle Scene' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=800',
        prompt: 'Coffee mug on breakfast table with croissants and newspaper',
        selected: false,
      },
      {
        id: 'v-3-3',
        template: 'Nature/Outdoor' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800',
        prompt: 'Coffee mug on outdoor wooden table with morning sunlight',
        selected: true,
      },
      {
        id: 'v-3-4',
        template: 'Seasonal' as PhotoshootTemplate,
        imageUrl: 'https://images.unsplash.com/photo-1516486392848-8b67ef89f113?w=800&h=800',
        prompt: 'Coffee mug with cozy winter setting, blanket and candles',
        selected: false,
      },
    ],
    selectedVariantIds: ['v-3-1', 'v-3-3'],
    createdAt: new Date('2026-02-23T09:45:00'),
    completedAt: new Date('2026-02-23T09:47:00'),
  },
  {
    id: 'ps-4',
    name: 'Running Shoes',
    productImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    productImageNoBackground: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&bg=transparent',
    brandDnaId: null,
    brandDnaName: null,
    status: 'GENERATING' as PhotoshootStatus,
    creditCost: 10,
    variants: [],
    selectedVariantIds: [],
    createdAt: new Date('2026-02-27T18:40:00'),
    completedAt: null,
  },
]

/**
 * Get all photoshoots with optional filtering and pagination
 */
export function getPhotoshoots(options?: {
  page?: number
  limit?: number
  status?: PhotoshootStatus
}): {
  data: Photoshoot[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
} {
  let filtered = [...mockPhotoshoots]

  // Filter by status
  if (options?.status) {
    filtered = filtered.filter((ps) => ps.status === options.status)
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Pagination
  const page = options?.page ?? 1
  const limit = options?.limit ?? 10
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    data: filtered.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

/**
 * Get a single photoshoot by ID
 */
export function getPhotoshootById(id: string): Photoshoot | null {
  return mockPhotoshoots.find((ps) => ps.id === id) ?? null
}
