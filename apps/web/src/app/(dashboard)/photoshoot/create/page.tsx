'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { PhotoshootTemplate } from '@repo/types'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'

import { ArrowLeft01Icon, SparklesIcon } from '@/lib/icons'
import { ImageUpload } from '@/components/photoshoot/image-upload'
import { TemplateSelector } from '@/components/photoshoot/template-selector'

/**
 * Create new photoshoot page
 * Allows users to upload product image and select templates
 */
export default function CreatePhotoshootPage() {
  const router = useRouter()
  const [productImage, setProductImage] = useState('')
  const [selectedTemplates, setSelectedTemplates] = useState<PhotoshootTemplate[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const creditCost = 10

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
      // TODO: Call API to generate photoshoot
      // For now, simulate generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to photoshoot list
      router.push('/photoshoot')
    } catch (err) {
      setError('Failed to generate photoshoot. Please try again.')
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-8">
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
              <CardTitle>Brand DNA (Optional)</CardTitle>
              <CardDescription>
                Select a brand to apply its colors and style to the generated images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">No brands available</p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link href="/brands">Create Brand DNA</Link>
                </Button>
              </div>
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

        {error && (
          <div className="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4">
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
