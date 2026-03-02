import { describe, it, expect } from 'vitest'
import { formatNumber, formatCurrency, formatPercent, formatDate } from '@/lib/utils/format'

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })
  })

  describe('formatCurrency', () => {
    it('formats USD by default', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })
  })

  describe('formatPercent', () => {
    it('formats percentages', () => {
      expect(formatPercent(50)).toBe('50.0%')
      expect(formatPercent(33.33, 2)).toBe('33.33%')
    })
  })

  describe('formatDate', () => {
    it('formats dates', () => {
      const date = new Date('2026-03-02')
      const result = formatDate(date)
      expect(result).toContain('Mar')
      expect(result).toContain('2')
    })
  })
})
