'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface BrandSummary {
  id: string
  name: string
  logo: { primary: string }
  url?: string
  colors?: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    palette: string[]
  }
}

interface BrandContextType {
  brands: BrandSummary[]
  selectedBrandId: string | null
  selectBrand: (id: string | null) => void
  selectedBrand: BrandSummary | null
  refreshBrands: () => Promise<void>
  deleteBrand: (id: string) => Promise<boolean>
  isLoading: boolean
}

const BrandContext = createContext<BrandContextType>({
  brands: [],
  selectedBrandId: null,
  selectBrand: () => {},
  selectedBrand: null,
  refreshBrands: async () => {},
  deleteBrand: async () => false,
  isLoading: true,
})

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<BrandSummary[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      const data = await res.json()
      const list = data.data || []
      setBrands(list)
      // Auto-select first brand if none selected
      if (!selectedBrandId && list.length > 0) {
        setSelectedBrandId(list[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchBrands() }, [])

  const deleteBrand = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' })
      if (!res.ok) return false
      await fetchBrands()
      if (selectedBrandId === id) {
        const remaining = brands.filter(b => b.id !== id)
        setSelectedBrandId(remaining.length > 0 ? remaining[0].id : null)
      }
      return true
    } catch { return false }
  }

  const selectBrand = (id: string | null) => setSelectedBrandId(id)
  const selectedBrand = brands.find(b => b.id === selectedBrandId) || null

  return (
    <BrandContext.Provider value={{ brands, selectedBrandId, selectBrand, selectedBrand, refreshBrands: fetchBrands, deleteBrand, isLoading }}>
      {children}
    </BrandContext.Provider>
  )
}

export const useBrand = () => useContext(BrandContext)
