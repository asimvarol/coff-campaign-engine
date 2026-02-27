'use client'

import { useState, useCallback } from 'react'

import { PhotoshootTemplate } from '@repo/types'

import { CheckmarkCircle02Icon } from '@/lib/icons'

const TEMPLATES = [
  { value: PhotoshootTemplate.MINIMALIST, label: 'Minimalist Studio', description: 'Clean white background' },
  { value: PhotoshootTemplate.LIFESTYLE, label: 'Lifestyle Scene', description: 'Real-world context' },
  { value: PhotoshootTemplate.NATURE, label: 'Nature/Outdoor', description: 'Natural settings' },
  { value: PhotoshootTemplate.LUXURY, label: 'Luxury', description: 'Premium materials' },
  { value: PhotoshootTemplate.SEASONAL, label: 'Seasonal', description: 'Holiday themes' },
  { value: PhotoshootTemplate.ABSTRACT, label: 'Abstract', description: 'Artistic backgrounds' },
  { value: PhotoshootTemplate.FLAT_LAY, label: 'Flat Lay', description: 'Top-down view' },
  { value: PhotoshootTemplate.IN_USE, label: 'In Use', description: 'Product in action' },
]

interface TemplateSelectorProps {
  value: PhotoshootTemplate[]
  onChange: (templates: PhotoshootTemplate[]) => void
  maxSelections?: number
}

/**
 * Template selector component for photoshoot generation
 * Allows multiple template selection with keyboard navigation
 */
export function TemplateSelector({ value, onChange, maxSelections = 4 }: TemplateSelectorProps) {
  const handleToggle = useCallback(
    (template: PhotoshootTemplate) => {
      const isSelected = value.includes(template)

      if (isSelected) {
        onChange(value.filter((t) => t !== template))
      } else if (value.length < maxSelections) {
        onChange([...value, template])
      }
    },
    [value, onChange, maxSelections]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, template: PhotoshootTemplate) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleToggle(template)
      }
    },
    [handleToggle]
  )

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Select Templates ({value.length}/{maxSelections})
        </h3>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label="Clear all selections"
          >
            Clear all
          </button>
        )}
      </div>

      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        role="radiogroup"
        aria-label="Photoshoot templates"
      >
        {TEMPLATES.map((template) => {
          const isSelected = value.includes(template.value)
          const isDisabled = !isSelected && value.length >= maxSelections

          return (
            <button
              key={template.value}
              type="button"
              onClick={() => handleToggle(template.value)}
              onKeyDown={(e) => handleKeyDown(e, template.value)}
              disabled={isDisabled}
              className={`relative rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : isDisabled
                    ? 'cursor-not-allowed border-border bg-muted/30 opacity-50'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${template.label}: ${template.description}`}
            >
              {isSelected && (
                <CheckmarkCircle02Icon
                  className="absolute right-2 top-2 h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              )}

              <div className="mb-1 text-sm font-medium">{template.label}</div>
              <div className="text-xs text-muted-foreground">{template.description}</div>
            </button>
          )
        })}
      </div>

      {value.length >= maxSelections && (
        <p className="mt-3 text-xs text-muted-foreground">
          Maximum {maxSelections} templates selected. Deselect one to choose another.
        </p>
      )}
    </div>
  )
}
