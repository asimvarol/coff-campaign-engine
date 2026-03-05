'use client'

import { Button, Input, Label, Slider, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui'
import { Magic01Icon } from '@/lib/icons'
import { MockCreative } from '@/lib/mock-data/campaigns'

interface OverlayPanelProps {
  creative: MockCreative
  onUpdateOverlay: (updates: Partial<MockCreative['overlay']>) => void
}

export function OverlayPanel({ creative, onUpdateOverlay }: OverlayPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold">Background Overlay</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="overlayOpacity">
              Opacity: {Math.round(creative.overlay.opacity * 100)}%
            </Label>
            <Slider
              id="overlayOpacity"
              value={[creative.overlay.opacity * 100]}
              onValueChange={([value]) => onUpdateOverlay({ opacity: value / 100 })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overlayColor">Color</Label>
            <div className="flex gap-2">
              <input
                id="overlayColor"
                type="color"
                value={creative.overlay.color}
                onChange={(e) => onUpdateOverlay({ color: e.target.value })}
                className="h-9 w-16 rounded border"
              />
              <Input
                value={creative.overlay.color}
                onChange={(e) => onUpdateOverlay({ color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full" disabled aria-label="Fix layout with AI">
              <Magic01Icon className="mr-2 h-4 w-4" />
              Fix Layout (AI)
            </Button>
          </TooltipTrigger>
          <TooltipContent>Coming soon</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
