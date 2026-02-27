import Link from 'next/link'
import { Card, CardContent, Badge } from '@repo/ui'
import { ArrowRight } from 'lucide-react'
import type { Photoshoot } from '@repo/types'

interface PhotoshootCardProps {
  photoshoot: Photoshoot
}

export function PhotoshootCard({ photoshoot }: PhotoshootCardProps) {
  const previewImages = photoshoot.variants.slice(0, 4)
  const selectedCount = photoshoot.variants.filter((v) => v.selected).length

  return (
    <Link href={`/photoshoot/${photoshoot.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
        <div className="grid grid-cols-2 gap-1 p-1">
          {previewImages.map((variant) => (
            <div key={variant.id} className="aspect-square overflow-hidden rounded">
              <img
                src={variant.imageUrl}
                alt="Variant preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant={photoshoot.mode === 'product' ? 'default' : 'secondary'}>
              {photoshoot.mode === 'product' ? 'Product' : 'Free Generation'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(photoshoot.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedCount} selected · {photoshoot.creditCost} credits
              </p>
              {photoshoot.prompt && (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {photoshoot.prompt}
                </p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
