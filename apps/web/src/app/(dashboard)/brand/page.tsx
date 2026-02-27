"use client"

import { useEffect, useState } from 'react'
import { Button, Card, Badge, Skeleton } from '@repo/ui'
import { Plus, Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Brand {
  id: string
  name: string
  url?: string
  logo: { primary: string }
  colors: { primary: string; secondary: string; accent: string; palette: string[] }
  industry?: string
  createdAt: string
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      setBrands(data.data || [])
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand DNA</h1>
          <p className="text-muted-foreground">Extract and manage your brand identities</p>
        </div>
        <Link href="/brand/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </Link>
      </div>

      {/* Brand Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : brands.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No brands yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first brand by analyzing a website. We'll extract colors, fonts, voice, and more.
          </p>
          <Link href="/brand/new" className="mt-6">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Brand
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brand/${brand.id}`}>
              <Card className="p-6 hover:border-primary transition-all cursor-pointer group">
                {/* Logo */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {brand.logo.primary ? (
                      <Image
                        src={brand.logo.primary}
                        alt={brand.name}
                        width={48}
                        height={48}
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <Sparkles className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  {brand.url && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                {/* Brand Name */}
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                {brand.url && (
                  <p className="text-sm text-muted-foreground mb-4 truncate">
                    {brand.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </p>
                )}

                {/* Color Palette Preview */}
                <div className="flex gap-2 mb-4">
                  {brand.colors.palette.slice(0, 5).map((color, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Industry Tag */}
                {brand.industry && (
                  <Badge variant="secondary" className="capitalize">
                    {brand.industry}
                  </Badge>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
