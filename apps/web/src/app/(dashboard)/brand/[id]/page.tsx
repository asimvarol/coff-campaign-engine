'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card, Badge } from '@repo/ui'
import { ArrowLeft, Download, Sparkles, Upload, RotateCcw, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Brand {
  id: string
  name: string
  url: string
  logo: { primary: string; variants: string[] }
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    palette: string[]
  }
  typography: { heading: string; body: string; accent?: string }
  voice: { tone: string[]; personality: string[]; keywords: string[]; sampleTexts: string[] }
  values: string[]
  aesthetic: string[]
  industry: string
  targetAudience: string
  summary: string
  images?: { scraped: string[]; uploaded: string[]; products: string[] }
  socialProfiles?: Record<string, string>
}

export default function BrandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBrand()
  }, [brandId])

  const fetchBrand = async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}`)
      const data = await res.json()
      if (data.data) setBrand(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReanalyze = async () => {
    if (!brand) return
    try {
      await fetch(`/api/brands/${brandId}/analyze`, { method: 'POST' })
      await fetchBrand()
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!brand) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Brand not found</h1>
        <Link href="/brand">
          <Button>Back to Brands</Button>
        </Link>
      </div>
    )
  }

  const allImages = [
    ...(brand.images?.scraped || []),
    ...(brand.images?.uploaded || []),
    ...(brand.images?.products || []),
  ]

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/brand" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Kit
          </Button>
          <Button variant="outline" size="sm" onClick={handleReanalyze}>
            <Sparkles className="mr-2 h-4 w-4" />
            Re-analyze
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[40%_1fr]">
        {/* Left Column - Brand Info */}
        <div className="space-y-4">
          {/* Brand Name & URL */}
          <Card className="p-6">
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <a
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              {brand.url.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Card>

          {/* Logo & Font Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Logo Preview */}
            <Card className="flex aspect-square items-center justify-center bg-[#f7f7f5] p-6">
              <div className="relative h-full w-full">
                <Image
                  src={brand.logo.primary}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </Card>

            {/* Fonts */}
            <Card className="flex flex-col justify-center p-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">Fonts</div>
              <div className="text-6xl font-bold" style={{ fontFamily: brand.typography.heading }}>
                Aa
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{brand.typography.heading}</div>
            </Card>
          </div>

          {/* Colors */}
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-4">Colors</div>
            <div className="grid grid-cols-4 gap-4">
              {brand.colors.palette.slice(0, 4).map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="h-16 w-16 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs font-mono text-muted-foreground">{color}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tagline */}
          {brand.voice.sampleTexts[0] && (
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">Tagline</div>
              <p className="italic text-lg">{brand.voice.sampleTexts[0]}</p>
            </Card>
          )}

          {/* Brand Values */}
          {brand.values.length > 0 && (
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">Brand values</div>
              <div className="flex flex-wrap gap-2">
                {brand.values.map((value, i) => (
                  <Badge key={i} variant="outline">
                    {value}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Brand Aesthetic */}
          {brand.aesthetic.length > 0 && (
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">Brand aesthetic</div>
              <div className="flex flex-wrap gap-2">
                {brand.aesthetic.map((aes, i) => (
                  <Badge key={i} variant="outline">
                    {aes}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Tone of Voice */}
          {brand.voice.tone.length > 0 && (
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">Brand tone of voice</div>
              <div className="flex flex-wrap gap-2">
                {brand.voice.tone.map((tone, i) => (
                  <Badge key={i} variant="outline">
                    {tone}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Images */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Images</h2>

            {/* Promo Card + Small Grid */}
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {/* 3x3 Small Grid */}
              {allImages.length >= 9 && (
                <div className="grid grid-cols-3 gap-2">
                  {allImages.slice(0, 9).map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image src={img} alt="" width={200} height={200} className="h-full w-full object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              )}

              {/* Promo Card */}
              <Card className="flex flex-col justify-center p-6 border-2">
                <h3 className="text-xl font-bold mb-2">Endless creatives, ready in minutes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate professional product photos with AI-powered backgrounds
                </p>
                <Link href="/photoshoot">
                  <Button className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try Photoshoot
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Upload Button */}
            <Card className="mb-6 flex aspect-video items-center justify-center border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Upload Images</span>
              </div>
            </Card>

            {/* Large Image Grid */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {allImages.map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={img}
                      alt={`Brand image ${i + 1}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button onClick={handleReanalyze}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Business DNA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
