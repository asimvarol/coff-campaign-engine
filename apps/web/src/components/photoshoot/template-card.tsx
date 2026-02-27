'use client'

import { CheckCircle } from 'lucide-react'
import { cn } from '@repo/ui'
import type { PhotoshootTemplate } from '@repo/types'

interface TemplateCardProps {
  template: PhotoshootTemplate
  selected: boolean
  onSelect: () => void
}

export function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105',
        selected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border hover:border-primary/50'
      )}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
      </div>
      <div className="bg-card/95 p-3 backdrop-blur-sm">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
          {selected && <CheckCircle className="h-4 w-4 text-primary" />}
        </div>
        <p className="text-xs text-muted-foreground">{template.description}</p>
      </div>
    </button>
  )
}
