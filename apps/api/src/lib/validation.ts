/**
 * Validation utilities for API requests
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Image URL is required' }
  }

  if (!isValidUrl(url)) {
    return { valid: false, error: 'Invalid URL format' }
  }

  return { valid: true }
}

/**
 * Validate file type for image uploads
 */
export function validateImageType(mimeType: string): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    }
  }

  return { valid: true }
}

/**
 * Validate file size
 */
export function validateFileSize(sizeBytes: number): { valid: boolean; error?: string } {
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    const maxSizeMB = MAX_FILE_SIZE_BYTES / (1024 * 1024)
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    }
  }

  return { valid: true }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: string | number,
  limit?: string | number
): {
  page: number
  limit: number
  error?: string
} {
  const parsedPage = typeof page === 'string' ? parseInt(page, 10) : page ?? 1
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit ?? 10

  if (isNaN(parsedPage) || parsedPage < 1) {
    return { page: 1, limit: 10, error: 'Invalid page number' }
  }

  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return { page: parsedPage, limit: 10, error: 'Invalid limit (must be between 1-100)' }
  }

  return { page: parsedPage, limit: parsedLimit }
}
