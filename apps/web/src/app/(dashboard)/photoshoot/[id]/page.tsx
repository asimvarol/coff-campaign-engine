'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Badge } from '@repo/ui'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  Download01Icon,
  Calendar03Icon,
  ImageAddIcon,
  CheckmarkCircle02Icon,
  Trash2Icon,
} from '@/lib/icons'

interface PhotoshootDetail {
  id: string
  name: string
  status: string
  brandName?: string
  createdAt: string
  images: Array<{ id: string; url: string; template: string }>
}

export default function PhotoshootDetailPage() {
  useEffect(() => { document.title = 'Photoshoot Detail | Coff' }, [])

  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [photoshoot, setPhotoshoot] = useState<PhotoshootDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchPhotoshoot = async () => {
      try {
        const res = await fetch(`/api/photoshoots/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.data) {
            setPhotoshoot(data.data)
            setIsLoading(false)
            return
          }
        }
      } catch {
        // Fallback below
      }

      // Static fallback for demo
      setPhotoshoot({
        id,
        name: 'Photoshoot',
        status: 'completed',
        createdAt: '2026-02-15',
        images: [
          { id: '1', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', template: 'product' },
          { id: '2', url: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800', template: 'lifestyle' },
          { id: '3', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', template: 'minimal' },
          { id: '4', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', template: 'vibrant' },
        ],
      })
      setIsLoading(false)
    }

    fetchPhotoshoot()
  }, [id])

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>
  }

  if (!photoshoot) {
    notFound()
  }

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => {
      const next = new Set(prev)
      if (next.has(imageId)) next.delete(imageId)
      else next.add(imageId)
      return next
    })
  }

  const handleDownloadSelected = async () => {
    const toDownload = photoshoot.images.filter(img => selectedImages.has(img.id))
    if (toDownload.length === 0) {
      toast.info('Select images to download')
      return
    }
    for (const img of toDownload) {
      try {
        const res = await fetch(img.url)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${photoshoot.name}-${img.template}.jpg`
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        toast.error('Failed to download image')
      }
    }
  }

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-500',
    COMPLETED: 'bg-green-500/10 text-green-500',
    in_progress: 'bg-yellow-500/10 text-yellow-500',
    GENERATING: 'bg-yellow-500/10 text-yellow-500',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/photoshoot">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{photoshoot.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {photoshoot.brandName && `${photoshoot.brandName} • `}
              {new Date(photoshoot.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[photoshoot.status] || 'bg-gray-500/10 text-gray-500'}>
            {photoshoot.status === 'COMPLETED' || photoshoot.status === 'completed' ? (
              <><CheckmarkCircle02Icon className="h-3 w-3 mr-1" />Completed</>
            ) : (
              photoshoot.status.replace('_', ' ')
            )}
          </Badge>
          <Button size="sm" onClick={handleDownloadSelected}>
            <Download01Icon className="h-4 w-4 mr-2" />
            Download Selected ({selectedImages.size})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={async () => {
              const res = await fetch(`/api/photoshoots/${id}`, { method: 'DELETE' })
              if (res.ok) {
                toast.success('Photoshoot deleted')
                router.push('/photoshoot')
              } else {
                toast.error('Failed to delete photoshoot')
              }
            }}
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <ImageAddIcon className="h-4 w-4" />
            Total Images
          </div>
          <div className="text-2xl font-bold font-mono">{photoshoot.images.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <CheckmarkCircle02Icon className="h-4 w-4" />
            Selected
          </div>
          <div className="text-2xl font-bold font-mono">{selectedImages.size}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Calendar03Icon className="h-4 w-4" />
            Date
          </div>
          <div className="text-2xl font-bold">
            {new Date(photoshoot.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        <div className="grid grid-cols-4 gap-4">
          {photoshoot.images.map((image) => {
            const isSelected = selectedImages.has(image.id)
            return (
              <button
                key={image.id}
                onClick={() => toggleImageSelection(image.id)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/20'
                }`}
              >
                <Image src={image.url} alt="" fill unoptimized className="object-cover" />
                {isSelected && (
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckmarkCircle02Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
