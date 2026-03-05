'use client'

import { useState } from 'react'
import { Button } from '@repo/ui'
import { ArrowLeft01Icon, Download04Icon, RefreshIcon, Image01Icon } from '@/lib/icons'
import { MockCreative } from '@/lib/mock-data/campaigns'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import { toast } from 'sonner'
import Link from 'next/link'
import { CanvasPreview } from './editor-panels/canvas-preview'
import { ImagePanel } from './editor-panels/image-panel'
import { TextPanel } from './editor-panels/text-panel'
import { OverlayPanel } from './editor-panels/overlay-panel'
import { VersionHistory } from './editor-panels/version-history'

interface CreativeEditorProps {
  creative: MockCreative
  campaignId: string
}

export function CreativeEditor({ creative, campaignId }: CreativeEditorProps) {
  const [editedCreative, setEditedCreative] = useState(creative)
  const [activeTab, setActiveTab] = useState<'image' | 'text' | 'overlay'>('text')
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

  const updateField = <K extends keyof MockCreative>(
    field: K,
    updates: Partial<MockCreative[K]>
  ) => {
    setEditedCreative(prev => ({
      ...prev,
      [field]: { ...(prev[field] as Record<string, unknown>), ...updates },
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
        <CanvasPreview creative={editedCreative} />

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

            {activeTab === 'image' && <ImagePanel creative={editedCreative} />}

            {activeTab === 'text' && (
              <TextPanel
                creative={editedCreative}
                onUpdateHeader={(u) => updateField('header', u)}
                onUpdateDescription={(u) => updateField('description', u)}
                onUpdateCTA={(u) => updateField('cta', u)}
              />
            )}

            {activeTab === 'overlay' && (
              <OverlayPanel
                creative={editedCreative}
                onUpdateOverlay={(u) => updateField('overlay', u)}
              />
            )}

            <VersionHistory creative={editedCreative} />
          </div>
        </div>
      </div>
    </div>
  )
}
