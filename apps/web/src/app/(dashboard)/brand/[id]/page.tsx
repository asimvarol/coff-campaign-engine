'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card, Badge, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@repo/ui'
import { ArrowLeft, Download, Sparkles, Upload, RotateCcw, ExternalLink, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'

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
  const router = useRouter()
  const { deleteBrand } = useBrand()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const leftRef = useRef<HTMLDivElement>(null)
  const [leftHeight, setLeftHeight] = useState<number>(0)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

  useEffect(() => { fetchBrand() }, [brandId])

  useEffect(() => {
    if (!leftRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setLeftHeight(entry.contentRect.height)
    })
    ro.observe(leftRef.current)
    return () => ro.disconnect()
  }, [brand])

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

  const handleDeleteClick = () => {
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    const ok = await deleteBrand(brandId)
    if (ok) router.push('/brand')
    setDeleteAlertOpen(false)
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/brand" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Download Kit</Button>
          <Button variant="outline" size="sm" onClick={handleReanalyze}><Sparkles className="mr-2 h-4 w-4" />Re-analyze</Button>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleDeleteClick}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr] items-start">

        {/* === LEFT COLUMN === */}
        <div ref={leftRef} className="space-y-5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="flex aspect-square items-center justify-center overflow-hidden bg-[#f0ede6] p-8">
              <div className="relative h-full w-full">
                <Image src={brand.logo.primary} alt={brand.name} fill className="object-contain" unoptimized />
              </div>
            </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tagline</div>
              <p className="text-base italic leading-relaxed">{brand.voice.sampleTexts?.[0] || brand.summary}</p>
            </Card>
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand values</div>
              <div className="flex flex-wrap gap-2">
                {brand.values.map((v, i) => <Badge key={i} variant="outline" className="text-xs">{v}</Badge>)}
              </div>
            </Card>
          </div>

          {/* Aesthetic + Tone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand aesthetic</div>
              <div className="flex flex-wrap gap-2">
                {brand.aesthetic.map((a, i) => <Badge key={i} variant="outline" className="text-xs">{a}</Badge>)}
              </div>
            </Card>
            <Card className="p-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand tone of voice</div>
              <div className="flex flex-wrap gap-2">
                {brand.voice.tone.map((t, i) => <Badge key={i} variant="outline" className="text-xs">{t}</Badge>)}
              </div>
            </Card>
          </div>
        </div>

        {/* === RIGHT COLUMN — Images (matches left height with fade) === */}
        <Card
          className="relative overflow-hidden p-6"
          style={leftHeight > 0 ? { maxHeight: leftHeight } : undefined}
        >
          <h2 className="text-xl font-bold mb-5">Images</h2>

          {/* Top: Small Grid + Promo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="grid grid-cols-3 gap-1.5">
              {(allImages.length >= 9 ? allImages.slice(0, 9) : allImages.slice(0, Math.min(allImages.length, 9))).map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted">
                  <Image src={img} alt="" width={150} height={150} className="h-full w-full object-cover" unoptimized />
                </div>
              ))}
              {allImages.length < 9 && Array.from({ length: 9 - Math.min(allImages.length, 9) }).map((_, i) => (
                <div key={`ph-${i}`} className="aspect-square rounded-md bg-muted" />
              ))}
            </div>
            <div className="flex flex-col justify-center rounded-lg border p-6">
              <h3 className="mb-2 text-lg font-bold">Endless creatives, ready in minutes</h3>
              <p className="mb-4 text-sm text-muted-foreground">Generate professional product photos with AI-powered backgrounds</p>
              <Link href="/photoshoot">
                <Button className="w-full"><Sparkles className="mr-2 h-4 w-4" />Try Photoshoot</Button>
              </Link>
            </div>
          </div>

          {/* Upload Card */}
          <div className="mb-5 flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary/50">
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

          {/* Fade overlay + Reset button pinned to bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5">
            <Button onClick={handleReanalyze} className="pointer-events-auto shadow-lg">
              <RotateCcw className="mr-2 h-4 w-4" />Reset Business DNA
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this brand? This action cannot be undone and will remove all associated campaigns and creatives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
