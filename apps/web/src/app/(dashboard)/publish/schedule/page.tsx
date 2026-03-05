'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Label,
  Checkbox,
  Badge,
} from '@repo/ui'
import { toast } from 'sonner'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Upload04Icon,
  Magic01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
} from '@/lib/icons'

type Platform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'x' | 'pinterest' | 'youtube'

interface PlatformDefinition {
  id: Platform
  name: string
  color: string
  icon: string
}

interface ConnectedAccount {
  id: string
  platform: Platform
  username: string
  handle: string
  avatar: string
  status: 'connected' | 'expired'
  lastUsed: string
  connectedAt: string
}

const platforms: PlatformDefinition[] = [
  { id: 'instagram', name: 'Instagram', color: 'oklch(0.66 0.21 354)', icon: '📸' },
  { id: 'facebook', name: 'Facebook', color: 'oklch(0.55 0.18 240)', icon: '👥' },
  { id: 'tiktok', name: 'TikTok', color: 'oklch(0.2 0 0)', icon: '🎵' },
  { id: 'linkedin', name: 'LinkedIn', color: 'oklch(0.48 0.14 240)', icon: '💼' },
  { id: 'x', name: 'X', color: 'oklch(0.4 0 0)', icon: '𝕏' },
  { id: 'pinterest', name: 'Pinterest', color: 'oklch(0.52 0.20 360)', icon: '📌' },
  { id: 'youtube', name: 'YouTube', color: 'oklch(0.54 0.22 30)', icon: '▶️' },
]

type Step = 1 | 2 | 3 | 4 | 5

export default function SchedulePostPage() {
  useEffect(() => { document.title = 'Schedule Post | Coff' }, [])

  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)

  // Form state
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [postNow, setPostNow] = useState(false)
  const [caption, setCaption] = useState('')
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>({})

  const [creatives, setCreatives] = useState<Array<{ id: string; thumbnail: string; name: string }>>([])
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])

  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        const res = await fetch('/api/campaigns')
        if (res.ok) {
          const data = await res.json()
          const items = (data.data || []).flatMap((c: any) =>
            (c.creatives || []).map((cr: any) => ({
              id: cr.id,
              thumbnail: cr.imageUrl || cr.thumbnail || '',
              name: cr.headline || cr.name || 'Creative',
            }))
          )
          if (items.length > 0) {
            setCreatives(items)
            return
          }
        }
      } catch {}
      // Fallback
      setCreatives([
        { id: '1', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop', name: 'Creative 1' },
        { id: '2', thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=200&h=200&fit=crop', name: 'Creative 2' },
        { id: '3', thumbnail: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=200&h=200&fit=crop', name: 'Creative 3' },
      ])
    }
    fetchCreatives()
  }, [])

  const connectedPlatforms = platforms.filter(p =>
    connectedAccounts.some(acc => acc.platform === p.id && acc.status === 'connected')
  )

  const creditsPerPost = 1
  const totalCredits = selectedPlatforms.length * creditsPerPost

  const canProceedStep1 = selectedCreatives.length > 0
  const canProceedStep2 = selectedPlatforms.length > 0
  const canProceedStep3 = postNow || (scheduledDate && scheduledTime)
  const canProceedStep4 = caption.length > 0

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSchedule = async () => {
    try {
      const scheduledFor = postNow
        ? new Date().toISOString()
        : new Date(`${scheduledDate}T${scheduledTime}`).toISOString()

      for (const platformId of selectedPlatforms) {
        const creative = creatives.find(c => selectedCreatives.includes(c.id))
        await fetch('/api/publish/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creativeId: creative?.id || selectedCreatives[0],
            creativeThumbnail: creative?.thumbnail || '',
            platform: platformId,
            scheduledFor,
            caption: platformCaptions[platformId] || caption,
            status: postNow ? 'publishing' : 'scheduled',
          }),
        })
      }
      toast.success(`Scheduled ${selectedPlatforms.length} post(s)!`)
      router.push('/publish/queue')
    } catch {
      toast.error('Failed to schedule posts')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/publish">
            <ArrowLeft01Icon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Schedule Post</h1>
          <p className="mt-2 text-muted-foreground">
            Step {currentStep} of 5
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex h-2 flex-1 rounded-full ${
              step <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Select Creative */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Creative(s)</CardTitle>
            <CardDescription>
              Choose one or more creatives to schedule for posting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {creatives.map((creative) => {
                const isSelected = selectedCreatives.includes(creative.id)
                return (
                  <button
                    key={creative.id}
                    onClick={() =>
                      setSelectedCreatives((prev) =>
                        prev.includes(creative.id)
                          ? prev.filter((id) => id !== creative.id)
                          : [...prev, creative.id]
                      )
                    }
                    className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="aspect-square bg-muted">
                      <img
                        src={creative.thumbnail}
                        alt={creative.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute right-2 top-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckmarkCircle02Icon className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <div className="p-2 text-center text-sm font-medium">
                      {creative.name}
                    </div>
                  </button>
                )
              })}
            </div>
            <Button variant="outline" className="w-full">
              <Upload04Icon className="mr-2 h-4 w-4" />
              Upload New Creative
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Platforms */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Platform(s)</CardTitle>
            <CardDescription>
              {connectedPlatforms.length === 0
                ? 'No connected accounts. Connect an account first to select platforms.'
                : 'Choose which platforms to post to'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedPlatforms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Calendar03Icon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No connected accounts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Connect a social media account to start scheduling posts
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/publish/accounts">Connect Account</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {connectedPlatforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      onClick={() =>
                        setSelectedPlatforms((prev) =>
                          prev.includes(platform.id)
                            ? prev.filter((p) => p !== platform.id)
                            : [...prev, platform.id]
                        )
                      }
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">
                          1 credit per post
                        </div>
                      </div>
                      {isSelected && (
                        <CheckmarkCircle02Icon className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Set Schedule */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Set Schedule</CardTitle>
            <CardDescription>
              Choose when to publish your post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="post-now"
                checked={postNow}
                onCheckedChange={(checked) => setPostNow(checked as boolean)}
              />
              <Label htmlFor="post-now" className="cursor-pointer">
                Post immediately
              </Label>
            </div>

            {!postNow && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Caption */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Caption</CardTitle>
            <CardDescription>
              Write your post caption (you can customize per platform)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Default Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {caption.length} characters
              </p>
            </div>

            <div className="space-y-3">
              <Label>Platform-Specific Captions (Optional)</Label>
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find(p => p.id === platformId)
                return (
                  <div key={platformId} className="space-y-2 rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{platform?.icon} {platform?.name}</span>
                    </div>
                    <Textarea
                      value={platformCaptions[platformId] || ''}
                      onChange={(e) =>
                        setPlatformCaptions({
                          ...platformCaptions,
                          [platformId]: e.target.value,
                        })
                      }
                      placeholder={`Custom caption for ${platform?.name} (or use default)`}
                      rows={2}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review & Confirm */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Confirm</CardTitle>
            <CardDescription>
              Review your post details before scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Creatives</Label>
                <p className="text-sm font-medium">{selectedCreatives.length} creative(s)</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find(p => p.id === platformId)
                    return (
                      <Badge key={platformId} variant="secondary">
                        {platform?.icon} {platform?.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Schedule</Label>
                <p className="text-sm font-medium">
                  {postNow
                    ? 'Post immediately'
                    : `${scheduledDate} at ${scheduledTime}`}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Caption</Label>
                <p className="text-sm">{caption}</p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Credit Cost</p>
                  <p className="text-xs text-muted-foreground">
                    {creditsPerPost} credit × {selectedPlatforms.length} platform(s)
                  </p>
                </div>
                <p className="text-2xl font-bold"><span className="font-mono">{totalCredits}</span> credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft01Icon className="mr-2 h-4 w-4" />
          Back
        </Button>
        {currentStep < 5 ? (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !canProceedStep1) ||
              (currentStep === 2 && !canProceedStep2) ||
              (currentStep === 3 && !canProceedStep3) ||
              (currentStep === 4 && !canProceedStep4)
            }
          >
            Next
            <ArrowRight01Icon className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSchedule}>
            <Calendar03Icon className="mr-2 h-4 w-4" />
            {postNow ? 'Publish Now' : 'Schedule Post'}
          </Button>
        )}
      </div>
    </div>
  )
}
