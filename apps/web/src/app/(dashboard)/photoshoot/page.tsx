'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui'
import { PlusSignIcon } from '@/lib/icons'
import { PhotoshootCard } from '@/components/photoshoot/photoshoot-card'
import { PhotoshootEmptyState } from '@/components/photoshoot/empty-state'

export default function PhotoshootPage() {
  useEffect(() => { document.title = 'Photoshoot | Coff' }, [])

  const [photoshoots, setPhotoshoots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/photoshoots')
        if (res.ok) {
          const data = await res.json()
          if (data.data && data.data.length > 0) {
            // Map API format to Photoshoot type expected by PhotoshootCard
            const mapped = data.data.map((item: any) => ({
              id: item.id,
              name: item.name,
              status: item.status,
              productImageUrl: item.productImage || '',
              productImageNoBackground: null,
              brandDnaId: item.brandId || null,
              brandDnaName: item.brandName || null,
              creditCost: 10,
              variants: (item.images || []).map((img: any) => ({
                id: img.id,
                template: img.template,
                imageUrl: img.url,
                prompt: '',
                selected: false,
              })),
              selectedVariantIds: [],
              createdAt: new Date(item.createdAt),
              completedAt: item.status === 'COMPLETED' ? new Date(item.createdAt) : null,
            }))
            setPhotoshoots(mapped)
            setIsLoading(false)
            return
          }
        }
      } catch {
        // No data
      }
      setIsLoading(false)
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photoshoot Studio</h1>
          <p className="mt-1 text-muted-foreground">
            AI-powered product photography with professional backgrounds
          </p>
        </div>
        <Button asChild>
          <Link href="/photoshoot/create" aria-label="Create new photoshoot">
            <PlusSignIcon className="mr-2 h-5 w-5" />
            New Photoshoot
          </Link>
        </Button>
      </div>

      {photoshoots.length === 0 ? (
        <PhotoshootEmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photoshoots.map((photoshoot) => (
            <PhotoshootCard key={photoshoot.id} photoshoot={photoshoot} />
          ))}
        </div>
      )}
    </div>
  )
}
