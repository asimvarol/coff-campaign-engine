/**
 * Form validation schemas
 * Using simple validators (can be replaced with zod later)
 */

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  url: (value: string): boolean => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },

  hexColor: (value: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(value)
  },

  password: (value: string): {
    isValid: boolean
    errors: string[]
  } => {
    const errors: string[] = []

    if (value.length < 8) {
      errors.push('Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(value)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(value)) {
      errors.push('Password must contain at least one number')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  slug: (value: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(value)
  },

  phoneNumber: (value: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(value.replace(/[\s()-]/g, ''))
  },
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`
  }
  return null
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): string | null {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return null
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string
): string | null {
  if (value.length > max) {
    return `${fieldName} must be at most ${max} characters`
  }
  return null
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return null
}
