import { z } from 'zod'

// Campaign validation schemas
export const createCampaignSchema = z.object({
  brandId: z.string().min(1, 'Brand ID is required'),
  name: z.string().min(1, 'Campaign name is required').max(200),
  description: z.string().max(1000).optional(),
  objective: z.enum(['AWARENESS', 'ENGAGEMENT', 'CONVERSION', 'TRAFFIC', 'PRODUCT_LAUNCH', 'SEASONAL']),
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
})

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  objective: z.enum(['AWARENESS', 'ENGAGEMENT', 'CONVERSION', 'TRAFFIC', 'PRODUCT_LAUNCH', 'SEASONAL']).optional(),
  platforms: z.array(z.string()).min(1).optional(),
  status: z.enum(['DRAFT', 'GENERATING', 'REVIEW', 'APPROVED', 'PUBLISHED', 'PAUSED', 'COMPLETED', 'ARCHIVED']).optional(),
  concept: z.object({
    name: z.string(),
    description: z.string(),
    emotion: z.string(),
    hashtags: z.array(z.string()),
    colorMood: z.string(),
    textPosition: z.string(),
  }).optional(),
})

export const generateCreativesSchema = z.object({
  conceptIndex: z.number().min(0).max(10).optional(),
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
  concept: z.object({
    name: z.string(),
    description: z.string(),
    colorMood: z.string().optional(),
  }).optional(),
})

// Creative validation schemas
export const updateCreativeSchema = z.object({
  header: z.object({
    text: z.string().max(200).optional(),
    font: z.string().optional(),
    size: z.number().min(8).max(200).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
    visible: z.boolean().optional(),
  }).optional(),
  description: z.object({
    text: z.string().max(500).optional(),
    font: z.string().optional(),
    size: z.number().min(8).max(100).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
    visible: z.boolean().optional(),
  }).optional(),
  cta: z.object({
    text: z.string().max(50).optional(),
    style: z.string().optional(),
    url: z.string().url('Invalid URL').optional(),
    visible: z.boolean().optional(),
  }).optional(),
  overlay: z.object({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
    opacity: z.number().min(0).max(1).optional(),
  }).optional(),
})

export const regenerateCreativeSchema = z.object({
  strategy: z.enum(['regenerate', 'next_variant', 'best_performing_clone']),
  prompt: z.string().max(500).optional(),
})

// Helper function to parse and validate request body
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string; code?: string }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)
    
    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`)
      return {
        success: false,
        error: errorMessages.join(', '),
        code: 'VALIDATION_ERROR',
      }
    }
    
    return { success: true, data: result.data }
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON body',
      code: 'INVALID_JSON',
    }
  }
}
