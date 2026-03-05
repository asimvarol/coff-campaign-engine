'use client'

import { Button, Input, Label, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui'
import { Magic01Icon } from '@/lib/icons'
import { MockCreative } from '@/lib/mock-data/campaigns'

interface TextPanelProps {
  creative: MockCreative
  onUpdateHeader: (updates: Partial<MockCreative['header']>) => void
  onUpdateDescription: (updates: Partial<MockCreative['description']>) => void
  onUpdateCTA: (updates: Partial<MockCreative['cta']>) => void
}

export function TextPanel({ creative, onUpdateHeader, onUpdateDescription, onUpdateCTA }: TextPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header Text */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Header Text</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={creative.header.visible}
              onChange={(e) => onUpdateHeader({ visible: e.target.checked })}
              className="rounded border-input"
            />
            Show
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headerText">Text</Label>
          <Input
            id="headerText"
            value={creative.header.text}
            onChange={(e) => onUpdateHeader({ text: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="headerFont">Font</Label>
            <select
              id="headerFont"
              value={creative.header.font}
              onChange={(e) => onUpdateHeader({ font: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option>Playfair Display</option>
              <option>Outfit</option>
              <option>Inter</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="headerSize">Size</Label>
            <Input
              id="headerSize"
              type="number"
              value={creative.header.size}
              onChange={(e) => onUpdateHeader({ size: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headerColor">Color</Label>
          <div className="flex gap-2">
            <input
              id="headerColor"
              type="color"
              value={creative.header.color}
              onChange={(e) => onUpdateHeader({ color: e.target.value })}
              className="h-9 w-16 rounded border"
            />
            <Input
              value={creative.header.color}
              onChange={(e) => onUpdateHeader({ color: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Description Text */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Description</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={creative.description.visible}
              onChange={(e) => onUpdateDescription({ visible: e.target.checked })}
              className="rounded border-input"
            />
            Show
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descText">Text</Label>
          <Input
            id="descText"
            value={creative.description.text}
            onChange={(e) => onUpdateDescription({ text: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="descFont">Font</Label>
            <select
              id="descFont"
              value={creative.description.font}
              onChange={(e) => onUpdateDescription({ font: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option>Outfit</option>
              <option>Playfair Display</option>
              <option>Inter</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descSize">Size</Label>
            <Input
              id="descSize"
              type="number"
              value={creative.description.size}
              onChange={(e) => onUpdateDescription({ size: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descColor">Color</Label>
          <div className="flex gap-2">
            <input
              id="descColor"
              type="color"
              value={creative.description.color}
              onChange={(e) => onUpdateDescription({ color: e.target.value })}
              className="h-9 w-16 rounded border"
            />
            <Input
              value={creative.description.color}
              onChange={(e) => onUpdateDescription({ color: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Call To Action</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={creative.cta.visible}
              onChange={(e) => onUpdateCTA({ visible: e.target.checked })}
              className="rounded border-input"
            />
            Show
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaText">Button Text</Label>
          <Input
            id="ctaText"
            value={creative.cta.text}
            onChange={(e) => onUpdateCTA({ text: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaUrl">URL</Label>
          <Input
            id="ctaUrl"
            value={creative.cta.url}
            onChange={(e) => onUpdateCTA({ url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full" disabled aria-label="Generate CTA button variations with AI">
                <Magic01Icon className="mr-2 h-4 w-4" />
                Generate CTA Variations
              </Button>
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
