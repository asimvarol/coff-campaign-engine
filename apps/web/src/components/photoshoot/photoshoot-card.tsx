import Image from 'next/image'
import Link from 'next/link'

import type { Photoshoot } from '@repo/types'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@repo/ui'

import { CheckmarkCircle02Icon, Loading03Icon, XCircleIcon } from '@/lib/icons'

interface PhotoshootCardProps {
  photoshoot: Photoshoot
}

/**
 * Photoshoot card component for list view
 * Displays photoshoot preview, status, and metadata
 */
export function PhotoshootCard({ photoshoot }: PhotoshootCardProps) {
  const statusConfig = {
    COMPLETED: {
      icon: CheckmarkCircle02Icon,
      label: 'Completed',
      variant: 'default' as const,
    },
    GENERATING: {
      icon: Loading03Icon,
      label: 'Generating',
      variant: 'secondary' as const,
    },
    DRAFT: {
      icon: null,
      label: 'Draft',
      variant: 'outline' as const,
    },
    FAILED: {
      icon: XCircleIcon,
      label: 'Failed',
      variant: 'destructive' as const,
    },
  }

  const status = statusConfig[photoshoot.status]
  const StatusIcon = status.icon

  return (
    <Link href={`/photoshoot/${photoshoot.id}`}>
      <Card className="group cursor-pointer transition-all hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-base">{photoshoot.name}</CardTitle>
              <CardDescription className="mt-1 text-xs">
                {photoshoot.brandDnaName ?? 'No Brand DNA'}
              </CardDescription>
            </div>
            <Badge variant={status.variant} className="gap-1.5">
              {StatusIcon && <StatusIcon className={cn("h-3 w-3", photoshoot.status === 'GENERATING' && "animate-spin")} />}
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <div className="relative col-span-2 aspect-square overflow-hidden rounded-md border border-border bg-muted">
              {photoshoot.productImageUrl && !photoshoot.productImageUrl.startsWith('blob:') ? (
                <Image
                  src={photoshoot.productImageUrl}
                  alt={`${photoshoot.name} product image`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : photoshoot.variants.length > 0 ? (
                <Image
                  src={photoshoot.variants[0].imageUrl}
                  alt={`${photoshoot.name} preview`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No image</div>
              )}
            </div>
            {photoshoot.variants.slice(0, 3).map((variant, index) => (
              <div
                key={variant.id}
                className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
              >
                <Image
                  src={variant.imageUrl}
                  alt={`${photoshoot.name} variant ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              </div>
            ))}
            {photoshoot.variants.length === 0 && (
              <>
                <div className="aspect-square rounded-md bg-muted animate-pulse" />
                <div className="aspect-square rounded-md bg-muted animate-pulse" />
              </>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {photoshoot.variants.length > 0
                ? `${photoshoot.variants.length} variants`
                : 'Generating...'}
            </span>
            <span>{photoshoot.creditCost} credits</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
