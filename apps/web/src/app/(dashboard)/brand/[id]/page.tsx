"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TagInput,
  ColorPicker,
  Skeleton,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui'
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Download,
  Trash2,
  ExternalLink,
  Palette,
  Type,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
  typography: {
    heading: string
    body: string
    accent?: string
  }
  voice: {
    tone: string[]
    personality: string[]
    keywords: string[]
    sampleTexts: string[]
  }
  values: string[]
  aesthetic: string[]
  industry: string
  targetAudience: string
  summary: string
  images?: {
    scraped: string[]
    uploaded: string[]
    products: string[]
  }
  socialProfiles?: Record<string, string>
}

const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Playfair Display',
  'Merriweather',
  'Raleway',
  'Oswald',
  'Source Sans Pro',
  'PT Sans',
  'Nunito',
  'Lora',
  'DM Sans',
  'Work Sans',
  'Plus Jakarta Sans',
]

export default function BrandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isReanalyzing, setIsReanalyzing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchBrand()
  }, [brandId])

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${brandId}`)
      const data = await response.json()
      if (data.data) {
        setBrand(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch brand:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!brand) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      })

      if (response.ok) {
        setHasChanges(false)
        // Show success toast (you can add toast notification library)
      }
    } catch (error) {
      console.error('Failed to save brand:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReanalyze = async () => {
    setIsReanalyzing(true)
    try {
      const response = await fetch(`/api/brands/${brandId}/analyze`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchBrand()
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Failed to re-analyze brand:', error)
    } finally {
      setIsReanalyzing(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/brand')
      }
    } catch (error) {
      console.error('Failed to delete brand:', error)
    }
  }

  const updateBrand = (updates: Partial<Brand>) => {
    if (!brand) return
    setBrand({ ...brand, ...updates })
    setHasChanges(true)
  }

  const updateColors = (key: string, value: string) => {
    if (!brand) return
    updateBrand({
      colors: { ...brand.colors, [key]: value },
    })
  }

  const updateTypography = (key: string, value: string) => {
    if (!brand) return
    updateBrand({
      typography: { ...brand.typography, [key]: value },
    })
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Brand not found</p>
          <Link href="/brand">
            <Button className="mt-4">Back to Brands</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/brand">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brands
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {brand.logo.primary && (
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <Image
                  src={brand.logo.primary}
                  alt={brand.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{brand.name}</h1>
              {brand.url && (
                <a
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                >
                  {brand.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReanalyze}
              disabled={isReanalyzing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
              {isReanalyzing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement download brand kit
                alert('Download Brand Kit - Coming soon!')
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Kit
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Brand DNA Content */}
      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Brand Name</label>
              <Input
                value={brand.name}
                onChange={(e) => updateBrand({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL</label>
              <Input
                value={brand.url}
                onChange={(e) => updateBrand({ url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <Input
                value={brand.industry || ''}
                onChange={(e) => updateBrand({ industry: e.target.value })}
                placeholder="e.g. fashion, technology, food"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Audience</label>
              <Input
                value={brand.targetAudience}
                onChange={(e) => updateBrand({ targetAudience: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Brand Summary</label>
              <Textarea
                value={brand.summary}
                onChange={(e) => updateBrand({ summary: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Colors */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Primary Color</label>
              <ColorPicker
                value={brand.colors.primary}
                onChange={(value) => updateColors('primary', value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Secondary Color</label>
              <ColorPicker
                value={brand.colors.secondary}
                onChange={(value) => updateColors('secondary', value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Accent Color</label>
              <ColorPicker
                value={brand.colors.accent}
                onChange={(value) => updateColors('accent', value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Text Color</label>
              <ColorPicker
                value={brand.colors.text}
                onChange={(value) => updateColors('text', value)}
              />
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Heading Font</label>
              <Select
                value={brand.typography.heading}
                onValueChange={(value) => updateTypography('heading', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOOGLE_FONTS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Body Font</label>
              <Select
                value={brand.typography.body}
                onValueChange={(value) => updateTypography('body', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOOGLE_FONTS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Brand Voice */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Brand Voice
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tone of Voice</label>
              <TagInput
                value={brand.voice.tone}
                onChange={(tags) =>
                  updateBrand({ voice: { ...brand.voice, tone: tags } })
                }
                placeholder="Add tone keywords (e.g. Professional, Friendly)"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Personality</label>
              <TagInput
                value={brand.voice.personality}
                onChange={(tags) =>
                  updateBrand({ voice: { ...brand.voice, personality: tags } })
                }
                placeholder="Add personality traits"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Keywords</label>
              <TagInput
                value={brand.voice.keywords}
                onChange={(tags) =>
                  updateBrand({ voice: { ...brand.voice, keywords: tags } })
                }
                placeholder="Add brand keywords"
              />
            </div>
          </div>
        </Card>

        {/* Brand Values & Aesthetic */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Values & Aesthetic</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Brand Values</label>
              <TagInput
                value={brand.values}
                onChange={(tags) => updateBrand({ values: tags })}
                placeholder="Add brand values (e.g. Sustainability, Quality)"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Aesthetic</label>
              <TagInput
                value={brand.aesthetic}
                onChange={(tags) => updateBrand({ aesthetic: tags })}
                placeholder="Add aesthetic styles (e.g. modern minimalism)"
              />
            </div>
          </div>
        </Card>

        {/* Brand Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Brand Images
          </h2>
          {brand.images?.scraped?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brand.images?.scraped?.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={img}
                    alt={`Brand image ${i + 1}`}
                    width={200}
                    height={200}
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No images available</p>
          )}
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/50">
          <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete this brand</p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All campaigns will also be deleted.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Brand
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{brand.name}</strong> and all associated campaigns.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
