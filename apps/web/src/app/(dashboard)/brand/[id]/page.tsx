'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
    primary: string; secondary: string; accent: string
    background: string; text: string; palette: string[]
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
  const brandId = params.id as string
  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchBrand() }, [brandId])

  const fetchBrand = async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}`)
      const data = await res.json()
      if (data.data) setBrand(data.data)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const handleReanalyze = async () => {
    if (!brand) return
    try {
      await fetch(`/api/brands/${brandId}/analyze`, { method: 'POST' })
      await fetchBrand()
    } catch (err) { console.error(err) }
  }

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>

  if (!brand) return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Brand not found</h1>
      <Link href="/brand"><Button>Back to Brands</Button></Link>
    </div>
  )

  const allImages = [...(brand.images?.scraped || []), ...(brand.images?.uploaded || []), ...(brand.images?.products || [])]
  const displayColors = brand.colors.palette.length > 0
    ? brand.colors.palette.slice(0, 4)
    : [brand.colors.primary, brand.colors.secondary, brand.colors.accent, brand.colors.background]

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/brand" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Download Kit</Button>
          <Button variant="outline" size="sm" onClick={handleReanalyze}><Sparkles className="mr-2 h-4 w-4" />Re-analyze</Button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">

        {/* === LEFT COLUMN === */}
        <div className="space-y-5">

          {/* Brand Name + URL */}
          <Card className="p-6">
            <h1 className="text-2xl font-bold">{brand.name}</h1>
            <a href={brand.url} target="_blank" rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {brand.url.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Card>

          {/* Logo + Fonts Row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Logo */}
            <Card className="flex aspect-square items-center justify-center overflow-hidden bg-[#f0ede6] p-8">
              <div className="relative h-full w-full">
                <Image src={brand.logo.primary} alt={brand.name} fill className="object-contain" unoptimized />
              </div>
            </Card>

            {/* Fonts */}
            <Card className="flex flex-col justify-center p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Fonts</div>
              <div className="text-7xl font-bold leading-none" style={{ fontFamily: brand.typography.heading }}>Aa</div>
              <div className="mt-3 text-sm font-medium">{brand.typography.heading}</div>
              {brand.typography.body !== brand.typography.heading && (
                <div className="mt-1 text-xs text-muted-foreground">{brand.typography.body}</div>
              )}
            </Card>
          </div>

          {/* Colors */}
          <Card className="p-6">
            <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Colors</div>
            <div className="flex items-center gap-6">
              {displayColors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-14 w-14 rounded-full border border-border shadow-sm" style={{ backgroundColor: color }} />
                  <span className="font-mono text-[10px] text-muted-foreground">{color}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tagline + Values Row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Tagline */}
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tagline</div>
              <p className="text-base italic leading-relaxed">{brand.voice.sampleTexts?.[0] || brand.summary}</p>
            </Card>

            {/* Brand Values */}
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand values</div>
              <div className="flex flex-wrap gap-2">
                {brand.values.map((v, i) => <Badge key={i} variant="outline" className="text-xs">{v}</Badge>)}
              </div>
            </Card>
          </div>

          {/* Aesthetic + Tone Row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Aesthetic */}
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand aesthetic</div>
              <div className="flex flex-wrap gap-2">
                {brand.aesthetic.map((a, i) => <Badge key={i} variant="outline" className="text-xs">{a}</Badge>)}
              </div>
            </Card>

            {/* Tone of Voice */}
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand tone of voice</div>
              <div className="flex flex-wrap gap-2">
                {brand.voice.tone.map((t, i) => <Badge key={i} variant="outline" className="text-xs">{t}</Badge>)}
              </div>
            </Card>
          </div>
        </div>

        {/* === RIGHT COLUMN — Images === */}
        <Card className="overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-5">Images</h2>
          <div className="space-y-5">

          {/* Top: Small Grid + Promo */}
          <div className="grid grid-cols-2 gap-5">
            {/* 3x3 Mini Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {(allImages.length >= 9 ? allImages.slice(0, 9) : allImages.slice(0, Math.min(allImages.length, 9))).map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted">
                  <Image src={img} alt="" width={150} height={150} className="h-full w-full object-cover" unoptimized />
                </div>
              ))}
              {/* Fill remaining slots with placeholders */}
              {allImages.length < 9 && Array.from({ length: 9 - Math.min(allImages.length, 9) }).map((_, i) => (
                <div key={`ph-${i}`} className="aspect-square rounded-md bg-muted" />
              ))}
            </div>

            {/* Promo Card */}
            <div className="flex flex-col justify-center rounded-lg border p-6">
              <h3 className="mb-2 text-lg font-bold">Endless creatives, ready in minutes</h3>
              <p className="mb-4 text-sm text-muted-foreground">Generate professional product photos with AI-powered backgrounds</p>
              <Link href="/photoshoot">
                <Button className="w-full"><Sparkles className="mr-2 h-4 w-4" />Try Photoshoot</Button>
              </Link>
            </div>
          </div>

          {/* Upload Card */}
          <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary/50">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Upload Images</span>
            </div>
          </div>

          {/* Image Grid */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {allImages.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={img} alt={`Image ${i + 1}`} width={300} height={300} className="h-full w-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleReanalyze}><RotateCcw className="mr-2 h-4 w-4" />Reset Business DNA</Button>
          </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
