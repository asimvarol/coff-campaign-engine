'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrandSelector } from '@/components/photoshoot/brand-selector'
import { GenerationProgress } from '@/components/photoshoot/generation-progress'
import { VariantGrid } from '@/components/photoshoot/variant-grid'
import { Button, Textarea, Badge, Card, CardContent } from '@repo/ui'
import { Wand2, RefreshCw } from 'lucide-react'
import { STYLE_PRESETS } from '@/lib/mock-data/photoshoots'
import type { PhotoshootVariant } from '@repo/types'

type Step = 'input' | 'generating' | 'results'

export default function FreeGenerationPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('input')
  const [prompt, setPrompt] = useState('')
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [variants, setVariants] = useState<PhotoshootVariant[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt || prompt.length < 10) return

    setStep('generating')
    setIsGenerating(true)

    try {
      const response = await fetch('http://localhost:3002/api/photoshoots/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          brandId: selectedBrandId,
          stylePreset: selectedPreset,
        }),
      })

      const result = await response.json()
      if (result.data) {
        setVariants(result.data.variants)
        setStep('results')
      }
    } catch (error) {
      console.error('Error generating:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVariantToggle = (variantId: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, selected: !v.selected } : v))
    )
  }

  const handleDownload = (variant: PhotoshootVariant) => {
    console.log('Download variant:', variant.id)
  }

  const handleEdit = (variant: PhotoshootVariant) => {
    console.log('Edit variant:', variant.id)
  }

  const handleRegenerate = () => {
    setStep('input')
    setVariants([])
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Free Generation</h1>
        <p className="text-muted-foreground">
          Generate any creative with AI using natural language prompts
        </p>
      </div>

      {/* Input Step */}
      {step === 'input' && (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Describe what you want to create
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A luxury perfume bottle on marble surface with gold accents and soft pink lighting..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters · Be specific for better results
            </p>
          </div>

          <BrandSelector selectedBrandId={selectedBrandId} onSelectBrand={setSelectedBrandId} />

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Style Presets (Optional)</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() =>
                    setSelectedPreset(selectedPreset === preset.id ? null : preset.id)
                  }
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedPreset === preset.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h3 className="mb-1 text-sm font-semibold text-foreground">{preset.name}</h3>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt || prompt.length < 10}
            className="w-full"
            size="lg"
          >
            <Wand2 className="mr-2 h-5 w-5" />
            Generate (3 credits)
          </Button>
        </div>
      )}

      {/* Generating Step */}
      {step === 'generating' && <GenerationProgress message="Generating your creative..." />}

      {/* Results Step */}
      {step === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Variants</h2>
              <p className="text-sm text-muted-foreground">
                {variants.filter((v) => v.selected).length} selected · 3 credits used
              </p>
            </div>
            <Button onClick={handleRegenerate} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              New Generation
            </Button>
          </div>

          {/* Show original prompt */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Prompt:</span> {prompt}
              </p>
            </CardContent>
          </Card>

          <VariantGrid
            variants={variants}
            onVariantToggle={handleVariantToggle}
            onDownload={handleDownload}
            onEdit={handleEdit}
          />

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/photoshoot')}>
              Back to Photoshoot
            </Button>
            <Button
              onClick={() => console.log('Use in campaign')}
              disabled={variants.filter((v) => v.selected).length === 0}
              className="flex-1"
            >
              Use Selected in Campaign
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
