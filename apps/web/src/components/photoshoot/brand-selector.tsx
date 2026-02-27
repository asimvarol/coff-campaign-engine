'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui'

interface BrandSelectorProps {
  selectedBrandId: string | null
  onSelectBrand: (brandId: string | null) => void
}

export function BrandSelector({ selectedBrandId, onSelectBrand }: BrandSelectorProps) {
  // TODO: Fetch real brands from API
  const brands = [
    { id: 'brand-001', name: 'Acme Corp' },
    { id: 'brand-002', name: 'TechStart' },
    { id: 'brand-003', name: 'Luxury Co' },
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Brand DNA (Optional)
      </label>
      <Select
        value={selectedBrandId || '__none__'}
        onValueChange={(value) => onSelectBrand(value === '__none__' ? null : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select brand for styling" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">No brand styling</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBrandId && (
        <p className="text-xs text-muted-foreground">
          Brand colors and aesthetic will be applied to generated images
        </p>
      )}
    </div>
  )
}
