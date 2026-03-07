'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { PhotoshootTemplate } from '@repo/types'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Label } from '@repo/ui'

import { toast } from 'sonner'
import { ArrowLeft01Icon, SparklesIcon, CheckmarkCircle02Icon } from '@/lib/icons'
import Image from 'next/image'
import { ImageUpload } from '@/components/photoshoot/image-upload'
import { TemplateSelector } from '@/components/photoshoot/template-selector'

/**
 * Create new photoshoot page
 * Allows users to upload product image and select templates
 */
export default function CreatePhotoshootPage() {
  useEffect(() => { document.title = 'Create Photoshoot | Coff' }, [])

  const router = useRouter()
  const [productImage, setProductImage] = useState('')
  const [selectedTemplates, setSelectedTemplates] = useState<PhotoshootTemplate[]>([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [brands, setBrands] = useState<Array<{ id: string; name: string; images?: { scraped?: string[]; uploaded?: string[]; products?: string[] } }>>([])
  const [selectedBrandId, setSelectedBrandId] = useState('')
  const [brandImages, setBrandImages] = useState<string[]>([])

  const creditCost = 10

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(data => {
      if (data.data) setBrands(data.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedBrandId) { setBrandImages([]); return }
    const brand = brands.find(b => b.id === selectedBrandId)
    if (brand?.images) {
      const all = [...(brand.images.scraped || []), ...(brand.images.uploaded || []), ...(brand.images.products || [])]
      setBrandImages(all)
    } else {
      // Fetch full brand detail for images
      fetch(`/api/brands/${selectedBrandId}`).then(r => r.json()).then(data => {
        const imgs = data.data?.images
        if (imgs) {
          const all = [...(imgs.scraped || []), ...(imgs.uploaded || []), ...(imgs.products || [])]
          setBrandImages(all)
        }
      }).catch(() => {})
    }
  }, [selectedBrandId, brands])

  const handleGenerate = async () => {
    setError('')

    if (!productImage) {
      setError('Please upload a product image')
      return
    }

    if (selectedTemplates.length === 0) {
      setError('Please select at least one template')
      return
    }

    setIsGenerating(true)

    try {
      const brand = brands.find(b => b.id === selectedBrandId)
      const brandStyle = brand ? `, ${brand.name} brand aesthetic` : ''

      const sceneMap: Record<string, string> = {
        minimalist: 'clean white background, minimalist studio, soft shadows',
        lifestyle: 'lifestyle scene, cozy real-world setting, natural light',
        nature: 'outdoor natural setting, greenery, sunlight',
        luxury: 'luxury setting, velvet, marble, gold accents, premium feel',
        seasonal: 'festive holiday theme, warm seasonal decoration',
        abstract: 'artistic abstract colorful background, creative',
        flat_lay: 'flat lay top-down view, styled arrangement, clean surface',
        in_use: 'product being worn or used, lifestyle model photography',
      }

      // Generate one image per template using product-shot
      const results = await Promise.allSettled(
        selectedTemplates.map(async (template) => {
          const scene = customPrompt
            ? customPrompt
            : `${sceneMap[template] || 'professional product photography'}${brandStyle}`

          const response = await fetch('/api/generate-product-shot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: productImage,
              scene_description: scene,
              num_results: 1,
            }),
          })

          if (!response.ok) throw new Error('Generation failed')
          const data = await response.json()
          return { url: data.images?.[0]?.url, template }
        })
      )

      const images = results
        .filter((r): r is PromiseFulfilledResult<{ url: string; template: string }> => r.status === 'fulfilled' && !!r.value.url)
        .map((r, i) => ({
          id: `img-${Date.now()}-${i}`,
          url: r.value.url,
          template: r.value.template,
        }))

      if (images.length === 0) throw new Error('No images were generated')

      await fetch('/api/photoshoots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${brand?.name || 'Product'} Photoshoot`,
          status: 'COMPLETED',
          brandId: selectedBrandId || undefined,
          brandName: brand?.name || undefined,
          templates: selectedTemplates,
          productImage,
          images,
        }),
      })

      toast.success('Photoshoot generated successfully!')
      router.push('/photoshoot')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate photoshoot. Please try again.'
      setError(message)
      setIsGenerating(false)
    }
  }

  return (
    <div >
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/photoshoot" aria-label="Back to photoshoots">
            <ArrowLeft01Icon className="mr-2 h-4 w-4" />
            Back to Photoshoots
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Create Photoshoot</h1>
        <p className="mt-1 text-muted-foreground">
          Upload your product image and select templates for AI-generated backgrounds
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>
                Upload a product image. We'll automatically remove the background.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={productImage}
                onChange={setProductImage}
                onError={setError}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Images</CardTitle>
              <CardDescription>
                Select a brand and pick a product image from your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {brands.length > 0 ? (
                <>
                  <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand..." />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {brandImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {brandImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setProductImage(img)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            productImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Image src={img} alt={`Brand image ${i + 1}`} fill unoptimized className="object-cover" />
                          {productImage === img && (
                            <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <CheckmarkCircle02Icon className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedBrandId && brandImages.length === 0 && (
                    <p className="text-xs text-muted-foreground">No images found for this brand</p>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No brands available</p>
                  <Button variant="link" size="sm" asChild className="mt-2">
                    <Link href="/brand/new">Create Brand DNA</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              Select up to 4 templates. Each will generate a unique variation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateSelector value={selectedTemplates} onChange={setSelectedTemplates} />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Custom Prompt (Optional)</CardTitle>
            <CardDescription>
              Describe the scene you want. Leave empty to auto-generate from templates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g. Gold ring on white marble surface with soft natural lighting and rose petals"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4" role="alert">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Card className="mt-6 bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium">Ready to generate?</p>
              <p className="text-sm text-muted-foreground">
                This will cost <span className="font-semibold text-foreground">{creditCost} credits</span>
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !productImage || selectedTemplates.length === 0}
              aria-label={`Generate photoshoot for ${creditCost} credits`}
            >
              {isGenerating ? (
                <>
                  <SparklesIcon className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  Generate Photoshoot
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
