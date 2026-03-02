import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Badge } from '@repo/ui'
import { 
  ArrowLeftIcon, 
  Download01Icon, 
  Share08Icon,
  Calendar03Icon,
  ImageAddIcon,
  CheckmarkCircle02Icon 
} from '@/lib/icons'

// Mock data - replace with API call
const PHOTOSHOOTS = {
  'ps-1': {
    id: 'ps-1',
    name: 'Summer Collection 2024',
    status: 'completed',
    date: '2024-02-15',
    brand: 'Golden Horn Jewellery',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', selected: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800', selected: true },
      { id: '3', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', selected: false },
      { id: '4', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', selected: true },
    ],
    totalImages: 24,
    selectedImages: 18,
  },
  'ps-2': {
    id: 'ps-2',
    name: 'Product Lifestyle Shoot',
    status: 'in_progress',
    date: '2024-02-20',
    brand: 'Urban Fitness Co',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', selected: false },
      { id: '2', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', selected: true },
      { id: '3', url: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800', selected: false },
      { id: '4', url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800', selected: true },
    ],
    totalImages: 32,
    selectedImages: 12,
  },
}

export default function PhotoshootDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const photoshoot = PHOTOSHOOTS[params.id as keyof typeof PHOTOSHOOTS]

  if (!photoshoot) {
    notFound()
  }

  const statusColors = {
    completed: 'bg-green-500/10 text-green-500',
    in_progress: 'bg-yellow-500/10 text-yellow-500',
    draft: 'bg-gray-500/10 text-gray-500',
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
              {photoshoot.brand} • {new Date(photoshoot.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[photoshoot.status as keyof typeof statusColors]}>
            {photoshoot.status === 'completed' && <CheckmarkCircle02Icon className="h-3 w-3 mr-1" />}
            {photoshoot.status.replace('_', ' ')}
          </Badge>
          <Button variant="outline" size="sm">
            <Share08Icon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm">
            <Download01Icon className="h-4 w-4 mr-2" />
            Download Selected
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <ImageAddIcon className="h-4 w-4" />
            Total Images
          </div>
          <div className="text-2xl font-bold">{photoshoot.totalImages}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <CheckmarkCircle02Icon className="h-4 w-4" />
            Selected
          </div>
          <div className="text-2xl font-bold">{photoshoot.selectedImages}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Calendar03Icon className="h-4 w-4" />
            Date
          </div>
          <div className="text-2xl font-bold">
            {new Date(photoshoot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        <div className="grid grid-cols-4 gap-4">
          {photoshoot.images.map((image) => (
            <div
              key={image.id}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                ${image.selected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/20'}
              `}
            >
              <Image
                src={image.url}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
              {image.selected && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <CheckmarkCircle02Icon className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
