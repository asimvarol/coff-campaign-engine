'use client'

import { useState } from 'react'
import { Download, Edit, CheckCircle } from 'lucide-react'
import { Button, Badge } from '@repo/ui'
import { cn } from '@repo/ui'
import type { PhotoshootVariant } from '@repo/types'

interface VariantGridProps {
  variants: PhotoshootVariant[]
  onVariantToggle: (variantId: string) => void
  onDownload: (variant: PhotoshootVariant) => void
  onEdit: (variant: PhotoshootVariant) => void
}

export function VariantGrid({ variants, onVariantToggle, onDownload, onEdit }: VariantGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {variants.map((variant) => (
        <div
          key={variant.id}
          className={cn(
            'group relative overflow-hidden rounded-lg border-2 transition-all',
            variant.selected
              ? 'border-primary shadow-lg shadow-primary/20'
              : 'border-border'
          )}
        >
          <button
            onClick={() => onVariantToggle(variant.id)}
            className="relative w-full"
          >
            <img
              src={variant.imageUrl}
              alt={variant.prompt}
              className="aspect-square w-full object-cover"
            />
            {variant.selected && (
              <div className="absolute right-2 top-2">
                <div className="rounded-full bg-primary p-1">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-card/95 p-3 backdrop-blur-sm transition-transform group-hover:translate-y-0">
            <div className="mb-2 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(variant)}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(variant)}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
