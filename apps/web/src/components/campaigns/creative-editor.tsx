'use client'

import { useState } from 'react'
import { Button, Card, Input, Label, Slider } from '@repo/ui'
import { 
  ArrowLeft01Icon, 
  Download04Icon, 
  RefreshIcon, 
  Image01Icon,
  Magic01Icon,
  ClockIcon 
} from '@/lib/icons'
import { PLATFORM_LABELS } from '@/lib/platform-config'

export interface CreativeData {
  id: string
  campaignId: string
  platform: string
  format: string
  width: number
  height: number
  imageUrl: string
  header: {
    text: string
    font: string
    size: number
    color: string
    position: { x: number; y: number }
    visible: boolean
  }
  description: {
    text: string
    font: string
    size: number
    color: string
    position: { x: number; y: number }
    visible: boolean
  }
  cta: {
    text: string
    style: string
    url: string
    visible: boolean
  }
  overlay: {
    color: string
    opacity: number
  }
  version: number
  status: string
  createdAt: Date
}
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface CreativeEditorProps {
  creative: CreativeData
  campaignId: string
}

export function CreativeEditor({ creative, campaignId }: CreativeEditorProps) {
  const [editedCreative, setEditedCreative] = useState(creative)
  const [activeTab, setActiveTab] = useState<'image' | 'text' | 'overlay' | 'cta'>('text')
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const sizeMap: Record<string, string> = {
        instagram: 'square_hd', facebook: 'landscape_16_9', tiktok: 'portrait_16_9',
        linkedin: 'landscape_4_3', x: 'landscape_16_9', pinterest: 'portrait_4_3',
      }
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Marketing creative: ${editedCreative.header.text}. Professional, modern design.`,
          negative_prompt: 'text, watermark, logo, blurry, low quality',
          image_size: sizeMap[editedCreative.platform] || 'square_hd',
          num_images: 1,
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      const imageUrl = data?.images?.[0]?.url
      if (!imageUrl) throw new Error('No image returned')
      setEditedCreative(prev => ({ ...prev, imageUrl, version: prev.version + 1 }))
      toast.success('Creative regenerated')
    } catch {
      toast.error('Failed to regenerate creative')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleDownload = async () => {
    try {
      const res = await fetch(editedCreative.imageUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${editedCreative.platform}-${editedCreative.format}-v${editedCreative.version}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download creative')
    }
  }

  const updateHeader = (updates: Partial<typeof editedCreative.header>) => {
    setEditedCreative(prev => ({
      ...prev,
      header: { ...prev.header, ...updates }
    }))
  }

  const updateDescription = (updates: Partial<typeof editedCreative.description>) => {
    setEditedCreative(prev => ({
      ...prev,
      description: { ...prev.description, ...updates }
    }))
  }

  const updateCTA = (updates: Partial<typeof editedCreative.cta>) => {
    setEditedCreative(prev => ({
      ...prev,
      cta: { ...prev.cta, ...updates }
    }))
  }

  const updateOverlay = (updates: Partial<typeof editedCreative.overlay>) => {
    setEditedCreative(prev => ({
      ...prev,
      overlay: { ...prev.overlay, ...updates }
    }))
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/campaigns/${campaignId}`}>
              <Button variant="ghost" size="sm" aria-label="Back to campaign">
                <ArrowLeft01Icon className="mr-2 h-4 w-4" />
                Back to Campaign
              </Button>
            </Link>
            <div className="h-8 w-px bg-border" />
            <div>
              <h1 className="font-semibold">{editedCreative.header.text}</h1>
              <p className="text-sm text-muted-foreground">
                {PLATFORM_LABELS[editedCreative.platform]} — {editedCreative.format}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" aria-label="Regenerate creative image" onClick={handleRegenerate} disabled={isRegenerating}>
              <RefreshIcon className="mr-2 h-4 w-4" />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
            <Button size="sm" aria-label="Download creative" onClick={handleDownload}>
              <Download04Icon className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Preview */}
        <div className="flex flex-1 items-center justify-center bg-muted/30 p-8">
          <div className="relative overflow-hidden rounded-lg shadow-2xl" 
            style={{ 
              width: Math.min(editedCreative.width / 2, 540),
              aspectRatio: `${editedCreative.width}/${editedCreative.height}`
            }}
          >
            {/* Background Image */}
            <Image
              src={editedCreative.imageUrl}
              alt="Creative preview"
              fill
              unoptimized
              className="object-cover"
            />
            
            {/* Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: editedCreative.overlay.color,
                opacity: editedCreative.overlay.opacity
              }}
            />

            {/* Text Overlays */}
            {editedCreative.header.visible && (
              <div
                className="absolute"
                style={{
                  left: `${editedCreative.header.position.x}px`,
                  top: `${editedCreative.header.position.y}px`,
                  color: editedCreative.header.color,
                  fontSize: `${editedCreative.header.size / 2}px`,
                  fontFamily: editedCreative.header.font,
                  fontWeight: 700,
                  maxWidth: `${editedCreative.width / 2 - 100}px`,
                }}
              >
                {editedCreative.header.text}
              </div>
            )}

            {editedCreative.description.visible && (
              <div
                className="absolute"
                style={{
                  left: `${editedCreative.description.position.x}px`,
                  top: `${editedCreative.description.position.y}px`,
                  color: editedCreative.description.color,
                  fontSize: `${editedCreative.description.size / 2}px`,
                  fontFamily: editedCreative.description.font,
                  maxWidth: `${editedCreative.width / 2 - 100}px`,
                }}
              >
                {editedCreative.description.text}
              </div>
            )}

            {/* CTA Button */}
            {editedCreative.cta.visible && (
              <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
              >
                <button
                  className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white"
                  style={{
                    fontSize: `${14}px`,
                  }}
                >
                  {editedCreative.cta.text}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Panel */}
        <div className="w-96 overflow-y-auto border-l bg-card">
          <div className="p-6 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeTab === 'image' ? 'default' : 'outline'}
                onClick={() => setActiveTab('image')}
                className="flex-1"
                aria-label="Edit image settings"
              >
                <Image01Icon className="mr-2 h-4 w-4" />
                Image
              </Button>
              <Button
                size="sm"
                variant={activeTab === 'text' ? 'default' : 'outline'}
                onClick={() => setActiveTab('text')}
                className="flex-1"
                aria-label="Edit text content"
              >
                Text
              </Button>
              <Button
                size="sm"
                variant={activeTab === 'overlay' ? 'default' : 'outline'}
                onClick={() => setActiveTab('overlay')}
                className="flex-1"
                aria-label="Edit overlay settings"
              >
                Overlay
              </Button>
            </div>

            {/* Image Tab */}
            {activeTab === 'image' && (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-4 font-semibold">Background Image</h3>
                  <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={editedCreative.imageUrl}
                      alt="Background"
                      width={300}
                      height={200}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" aria-label="Upload new background image">
                      <Image01Icon className="mr-2 h-4 w-4" />
                      Upload New
                    </Button>
                    <Button variant="outline" className="flex-1" aria-label="Generate new background with AI">
                      <Magic01Icon className="mr-2 h-4 w-4" />
                      Generate New
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Generate a new background (3 credits) or upload your own image.
                  </p>
                </div>
              </div>
            )}

            {/* Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-6">
                {/* Header Text */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Header Text</h3>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editedCreative.header.visible}
                        onChange={(e) => updateHeader({ visible: e.target.checked })}
                        className="rounded border-input"
                      />
                      Show
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headerText">Text</Label>
                    <Input
                      id="headerText"
                      value={editedCreative.header.text}
                      onChange={(e) => updateHeader({ text: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="headerFont">Font</Label>
                      <select
                        id="headerFont"
                        value={editedCreative.header.font}
                        onChange={(e) => updateHeader({ font: e.target.value })}
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
                        value={editedCreative.header.size}
                        onChange={(e) => updateHeader({ size: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headerColor">Color</Label>
                    <div className="flex gap-2">
                      <input
                        id="headerColor"
                        type="color"
                        value={editedCreative.header.color}
                        onChange={(e) => updateHeader({ color: e.target.value })}
                        className="h-9 w-16 rounded border"
                      />
                      <Input
                        value={editedCreative.header.color}
                        onChange={(e) => updateHeader({ color: e.target.value })}
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
                        checked={editedCreative.description.visible}
                        onChange={(e) => updateDescription({ visible: e.target.checked })}
                        className="rounded border-input"
                      />
                      Show
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descText">Text</Label>
                    <Input
                      id="descText"
                      value={editedCreative.description.text}
                      onChange={(e) => updateDescription({ text: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="descFont">Font</Label>
                      <select
                        id="descFont"
                        value={editedCreative.description.font}
                        onChange={(e) => updateDescription({ font: e.target.value })}
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
                        value={editedCreative.description.size}
                        onChange={(e) => updateDescription({ size: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descColor">Color</Label>
                    <div className="flex gap-2">
                      <input
                        id="descColor"
                        type="color"
                        value={editedCreative.description.color}
                        onChange={(e) => updateDescription({ color: e.target.value })}
                        className="h-9 w-16 rounded border"
                      />
                      <Input
                        value={editedCreative.description.color}
                        onChange={(e) => updateDescription({ color: e.target.value })}
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
                        checked={editedCreative.cta.visible}
                        onChange={(e) => updateCTA({ visible: e.target.checked })}
                        className="rounded border-input"
                      />
                      Show
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">Button Text</Label>
                    <Input
                      id="ctaText"
                      value={editedCreative.cta.text}
                      onChange={(e) => updateCTA({ text: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaUrl">URL</Label>
                    <Input
                      id="ctaUrl"
                      value={editedCreative.cta.url}
                      onChange={(e) => updateCTA({ url: e.target.value })}
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
            )}

            {/* Overlay Tab */}
            {activeTab === 'overlay' && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 font-semibold">Background Overlay</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="overlayOpacity">Opacity: {Math.round(editedCreative.overlay.opacity * 100)}%</Label>
                      <Slider
                        id="overlayOpacity"
                        value={[editedCreative.overlay.opacity * 100]}
                        onValueChange={([value]) => updateOverlay({ opacity: value / 100 })}
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
                          value={editedCreative.overlay.color}
                          onChange={(e) => updateOverlay({ color: e.target.value })}
                          className="h-9 w-16 rounded border"
                        />
                        <Input
                          value={editedCreative.overlay.color}
                          onChange={(e) => updateOverlay({ color: e.target.value })}
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
            )}

            {/* Version History */}
            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold">Version History</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border bg-primary/5 p-3">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">v{editedCreative.version} (current)</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3 opacity-50">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">v{editedCreative.version - 1}</div>
                    <div className="text-xs text-muted-foreground">15 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
