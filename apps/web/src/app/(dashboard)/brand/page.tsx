"use client"

import { useEffect, useState } from 'react'
import { Button, Card, Badge, Skeleton } from '@repo/ui'
import { PlusIcon, Sparkles01Icon, ExternalLinkIcon } from '@/lib/icons'
import Link from 'next/link'
import Image from 'next/image'

interface Brand {
  id: string
  name: string
  url?: string
  logo: { primary: string }
  colors: { primary: string; secondary: string; accent: string; palette: string[] }
  typography?: { heading: string; body: string }
  industry?: string
  createdAt: string
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand DNA</h1>
          <p className="text-muted-foreground">Extract and manage your brand identities</p>
        </div>
        <Link href="/brand/new">
          <Button size="lg"><PlusIcon className="mr-2 h-4 w-4" />Add Brand</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-40 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Sparkles01Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No brands yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first brand by analyzing a website. We'll extract colors, fonts, voice, and more.
          </p>
          <Link href="/brand/new" className="mt-6">
            <Button><PlusIcon className="mr-2 h-4 w-4" />Add Your First Brand</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brand/${brand.id}`}>
              <Card className="overflow-hidden transition-all hover:border-primary hover:shadow-lg cursor-pointer group">
                {/* Bento Grid */}
                <div className="grid grid-cols-[1fr_1fr] gap-px bg-border">
                  {/* Logo - Large */}
                  <div className="flex aspect-square items-center justify-center bg-[#f0ede6] p-8">
                    <div className="relative h-full w-full">
                      {brand.logo.primary ? (
                        <Image
                          src={brand.logo.primary}
                          alt={brand.name}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sparkles01Icon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col bg-card">
                    {/* Name & URL */}
                    <div className="flex-1 p-5">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                      {brand.url && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground truncate">
                          {brand.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                          <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                        </p>
                      )}
                      {brand.typography && (
                        <div className="mt-3">
                          <div className="text-4xl font-bold" style={{ fontFamily: brand.typography.heading }}>Aa</div>
                          <div className="mt-1 text-xs text-muted-foreground">{brand.typography.heading}</div>
                        </div>
                      )}
                    </div>

                    {/* Colors Strip */}
                    <div className="border-t border-border p-4">
                      <div className="flex gap-2">
                        {brand.colors.palette.slice(0, 5).map((color, i) => (
                          <div key={i} className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: color }} title={color} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry Badge */}
                {brand.industry && (
                  <div className="border-t border-border bg-card px-5 py-3">
                    <Badge variant="outline" className="capitalize text-xs">{brand.industry}</Badge>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
