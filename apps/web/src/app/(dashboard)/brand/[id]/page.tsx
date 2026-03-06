'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card, Badge, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@repo/ui'
import { ArrowLeft01Icon, Download04Icon, Sparkles01Icon, Upload04Icon, RotateCcwIcon, ExternalLinkIcon, Trash2Icon } from '@/lib/icons'
import Image from 'next/image'
import Link from 'next/link'
import { useBrand } from '@/lib/brand-context'
import { toast } from 'sonner'

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
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [isReanalyzing, setIsReanalyzing] = useState(false)

  useEffect(() => { fetchBrand() }, [brandId])

  useEffect(() => {
    if (brand) document.title = `${brand.name} — Brand DNA | Coff`
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
    if (!brand || isReanalyzing) return
    setIsReanalyzing(true)
    try {
      await fetch(`/api/brands/${brandId}/analyze`, { method: 'POST' })
      await fetchBrand()
      toast.success('Brand re-analyzed successfully')
    } catch {
      toast.error('Failed to re-analyze brand')
    } finally {
      setIsReanalyzing(false)
    }
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
    ? brand.colors.palette
    : [brand.colors.primary, brand.colors.secondary, brand.colors.accent, brand.colors.background].filter(Boolean)

  return (
    <div>
      {/* Back link */}
      <div className="mb-6">
        <Link href="/brand" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft01Icon className="h-4 w-4" />
          Back to Brands
        </Link>
      </div>

      {/* Hero: Logo + Name + Actions */}
      <div className="mb-8 flex items-start gap-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image src={brand.logo.primary} alt={brand.name} fill className="object-contain p-2" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold truncate">{brand.name}</h1>
          <a href={brand.url} target="_blank" rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            {brand.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
          {brand.industry && (
            <div className="mt-2">
              <Badge variant="outline" className="capitalize text-xs">{brand.industry}</Badge>
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm"><Download04Icon className="mr-2 h-4 w-4" />Download Kit</Button>
          <Button variant="outline" size="sm" onClick={handleReanalyze} disabled={isReanalyzing}>
            {isReanalyzing
              ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Analyzing...</>
              : <><Sparkles01Icon className="mr-2 h-4 w-4" />Re-analyze</>
            }
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteAlertOpen(true)}>
            <Trash2Icon className="mr-2 h-4 w-4" />Delete
          </Button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Colors — full width */}
        <Card className="p-6 md:col-span-2">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Colors</h2>
          <div className="flex items-center gap-5 flex-wrap">
            {displayColors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-full border border-border shadow-sm" style={{ backgroundColor: color }} />
                <span className="font-mono text-[10px] text-muted-foreground">{color}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Typography</h2>
          <div className="text-7xl font-bold leading-none" style={{ fontFamily: brand.typography.heading }}>Aa</div>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium">{brand.typography.heading}</p>
            {brand.typography.body !== brand.typography.heading && (
              <p className="text-xs text-muted-foreground">{brand.typography.body}</p>
            )}
          </div>
        </Card>

        {/* Tagline / Summary */}
        <Card className="p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tagline</h2>
          <p className="text-lg italic leading-relaxed">
            {brand.voice.sampleTexts?.[0] || brand.summary}
          </p>
        </Card>

        {/* Brand Values */}
        <Card className="p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand Values</h2>
          <div className="flex flex-wrap gap-2">
            {brand.values.map((v, i) => <Badge key={i} variant="outline">{v}</Badge>)}
          </div>
        </Card>

        {/* Tone of Voice */}
        <Card className="p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tone of Voice</h2>
          <div className="flex flex-wrap gap-2">
            {brand.voice.tone.map((t, i) => <Badge key={i} variant="outline">{t}</Badge>)}
          </div>
        </Card>

        {/* Aesthetic */}
        <Card className="p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand Aesthetic</h2>
          <div className="flex flex-wrap gap-2">
            {brand.aesthetic.map((a, i) => <Badge key={i} variant="outline">{a}</Badge>)}
          </div>
        </Card>

        {/* Target Audience */}
        <Card className="p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Target Audience</h2>
          <p className="text-sm text-muted-foreground">{brand.targetAudience}</p>
        </Card>

        {/* Images — full width */}
        <Card className="p-6 md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Images</h2>
            <span className="text-xs text-muted-foreground">{allImages.length} images</span>
          </div>

          {allImages.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {allImages.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={img} alt={`Brand image ${i + 1}`} width={150} height={150} className="h-full w-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <Upload04Icon className="h-6 w-6" />
                <span className="text-sm">No images found</span>
              </div>
            </div>
          )}
        </Card>

        {/* Photoshoot CTA — full width */}
        <Card className="md:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-lg font-bold">Generate product photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Create professional product photos with AI-powered backgrounds</p>
            </div>
            <Button asChild>
              <Link href="/photoshoot">
                <Sparkles01Icon className="mr-2 h-4 w-4" />Try Photoshoot
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{brand.name}&quot;? This action cannot be undone and will remove all associated campaigns and creatives.
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
