'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface BrandSummary {
  id: string
  name: string
  logo: { primary: string }
  url?: string
}

interface BrandContextType {
  brands: BrandSummary[]
  selectedBrandId: string | null
  selectBrand: (id: string | null) => void
  selectedBrand: BrandSummary | null
  refreshBrands: () => Promise<void>
  isLoading: boolean
}

const BrandContext = createContext<BrandContextType>({
  brands: [],
  selectedBrandId: null,
  selectBrand: () => {},
  selectedBrand: null,
  refreshBrands: async () => {},
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

  const selectBrand = (id: string | null) => setSelectedBrandId(id)
  const selectedBrand = brands.find(b => b.id === selectedBrandId) || null

  return (
    <BrandContext.Provider value={{ brands, selectedBrandId, selectBrand, selectedBrand, refreshBrands: fetchBrands, isLoading }}>
      {children}
    </BrandContext.Provider>
  )
}

export const useBrand = () => useContext(BrandContext)
