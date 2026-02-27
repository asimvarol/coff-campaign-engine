'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadDropzone } from '@/components/photoshoot/upload-dropzone'
import { TemplateCard } from '@/components/photoshoot/template-card'
import { BrandSelector } from '@/components/photoshoot/brand-selector'
import { GenerationProgress } from '@/components/photoshoot/generation-progress'
import { VariantGrid } from '@/components/photoshoot/variant-grid'
import { Button, Badge } from '@repo/ui'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { PHOTOSHOOT_TEMPLATES } from '@/lib/mock-data/photoshoots'
import type { PhotoshootVariant } from '@repo/types'

type Step = 'upload' | 'template' | 'generating' | 'results'

export default function ProductPhotoshootPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [removeBackground, setRemoveBackground] = useState(true)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [variants, setVariants] = useState<PhotoshootVariant[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!selectedTemplateId || !productImage) return

    setStep('generating')
    setIsGenerating(true)

    try {
      const response = await fetch('http://localhost:3002/api/photoshoots/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage,
          templateId: selectedTemplateId,
          brandId: selectedBrandId,
          removeBackground,
        }),
      })

      const result = await response.json()
      if (result.data) {
        setVariants(result.data.variants)
        setStep('results')
      }
    } catch (error) {
      console.error('Error generating photoshoot:', error)
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
    // TODO: Implement download
    console.log('Download variant:', variant.id)
  }

  const handleEdit = (variant: PhotoshootVariant) => {
    // TODO: Navigate to campaign editor with this variant
    console.log('Edit variant:', variant.id)
  }

  const handleRegenerate = () => {
    setStep('template')
    setVariants([])
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Product Photoshoot</h1>
        <p className="text-muted-foreground">
          Upload product image and generate professional photos with AI
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center gap-2">
        <Badge variant={step === 'upload' ? 'default' : 'secondary'}>1. Upload</Badge>
        <div className="h-px flex-1 bg-border" />
        <Badge variant={step === 'template' ? 'default' : 'secondary'}>2. Template</Badge>
        <div className="h-px flex-1 bg-border" />
        <Badge variant={step === 'generating' ? 'default' : 'secondary'}>3. Generate</Badge>
        <div className="h-px flex-1 bg-border" />
        <Badge variant={step === 'results' ? 'default' : 'secondary'}>4. Results</Badge>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="mx-auto max-w-2xl space-y-6">
          <UploadDropzone
            onImageSelect={setProductImage}
            selectedImage={productImage}
            onRemove={() => setProductImage(null)}
          />

          {productImage && (
            <button
              onClick={() => setRemoveBackground(!removeBackground)}
              className="flex items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
            >
              <div
                className={`h-5 w-5 rounded border-2 transition-colors ${
                  removeBackground ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}
              >
                {removeBackground && (
                  <svg className="h-full w-full text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-sm">Remove background automatically (+2 credits)</span>
            </button>
          )}

          {productImage && (
            <Button onClick={() => setStep('template')} className="w-full">
              Continue to Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Template Selection */}
      {step === 'template' && (
        <div className="space-y-6">
          <BrandSelector selectedBrandId={selectedBrandId} onSelectBrand={setSelectedBrandId} />

          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Choose Template</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PHOTOSHOOT_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedTemplateId === template.id}
                  onSelect={() => setSelectedTemplateId(template.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep('upload')}>
              Back to Upload
            </Button>
            <Button onClick={handleGenerate} disabled={!selectedTemplateId} className="flex-1">
              Generate Photoshoot (10 credits)
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 'generating' && <GenerationProgress />}

      {/* Step 4: Results */}
      {step === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Variants</h2>
              <p className="text-sm text-muted-foreground">
                {variants.filter((v) => v.selected).length} selected · 10 credits used
              </p>
            </div>
            <Button onClick={handleRegenerate} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>

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
