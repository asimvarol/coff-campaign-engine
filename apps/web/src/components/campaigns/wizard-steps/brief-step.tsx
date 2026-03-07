'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui'
import { ArrowRight01Icon, CheckmarkCircle02Icon } from '@/lib/icons'
import { CampaignObjective } from '@repo/types'
import Link from 'next/link'

const OBJECTIVES = [
  { id: 'AWARENESS', label: 'Brand Awareness', icon: '👁️', description: 'Increase brand visibility' },
  { id: 'ENGAGEMENT', label: 'Engagement', icon: '❤️', description: 'Drive likes, comments, shares' },
  { id: 'CONVERSION', label: 'Conversion', icon: '🎯', description: 'Drive sales and signups' },
  { id: 'TRAFFIC', label: 'Traffic', icon: '🚀', description: 'Bring visitors to your site' },
  { id: 'PRODUCT_LAUNCH', label: 'Product Launch', icon: '✨', description: 'Launch new products' },
  { id: 'SEASONAL', label: 'Seasonal', icon: '🎉', description: 'Holiday & seasonal campaigns' },
]

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', formats: 'Feed, Story, Reels' },
  { id: 'facebook', label: 'Facebook', formats: 'Feed, Story' },
  { id: 'tiktok', label: 'TikTok', formats: 'Video, Photo' },
  { id: 'linkedin', label: 'LinkedIn', formats: 'Post, Carousel' },
  { id: 'x', label: 'X (Twitter)', formats: 'Post, Header' },
  { id: 'pinterest', label: 'Pinterest', formats: 'Pin, Idea Pin' },
]

interface BriefStepProps {
  brandId: string
  campaignName: string
  objective: CampaignObjective | ''
  platforms: string[]
  description: string
  brands: Array<{ id: string; name: string }>
  isGenerating: boolean
  onUpdate: (updates: Record<string, unknown>) => void
  onGenerate: () => void
  canProceed: boolean
}

export function BriefStep({
  brandId, campaignName, objective, platforms, description,
  brands, isGenerating, onUpdate, onGenerate, canProceed,
}: BriefStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Brief</CardTitle>
        <CardDescription>Tell us about your campaign goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="campaignName">Campaign Name *</Label>
          <Input
            id="campaignName"
            placeholder="Mother's Day Collection 2026"
            value={campaignName}
            onChange={(e) => onUpdate({ campaignName: e.target.value })}
            required
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Select value={brandId} onValueChange={(value) => onUpdate({ brandId: value })}>
            <SelectTrigger id="brand">
              <SelectValue placeholder="Select brand..." />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Campaign Objective *</Label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OBJECTIVES.map(obj => (
              <button
                key={obj.id}
                onClick={() => onUpdate({ objective: obj.id })}
                className={`relative rounded-lg border p-4 text-left transition-all ${
                  objective === obj.id
                    ? 'border-2 border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {objective === obj.id && (
                  <div className="absolute right-2 top-2">
                    <CheckmarkCircle02Icon className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="mb-2 text-2xl">{obj.icon}</div>
                <div className="font-semibold">{obj.label}</div>
                <div className="text-xs text-muted-foreground">{obj.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Target Platforms * (select at least one)</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map(platform => (
              <label
                key={platform.id}
                htmlFor={`platform-${platform.id}`}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                  platforms.includes(platform.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  id={`platform-${platform.id}`}
                  type="checkbox"
                  checked={platforms.includes(platform.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onUpdate({ platforms: [...platforms, platform.id] })
                    } else {
                      onUpdate({ platforms: platforms.filter(p => p !== platform.id) })
                    }
                  }}
                  className="mt-1 rounded border-input"
                />
                <div className="flex-1">
                  <div className="font-medium">{platform.label}</div>
                  <div className="text-xs text-muted-foreground">{platform.formats}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Campaign Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your campaign in natural language... AI will use this to generate better concepts."
            rows={4}
            value={description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </div>

        <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between border-t border-border bg-card p-6 sm:static sm:mx-0 sm:mb-0 sm:border-0 sm:bg-transparent sm:p-0">
          <Button variant="outline" asChild>
            <Link href="/campaigns">Cancel</Link>
          </Button>
          <div className="flex flex-col items-end gap-1">
            <Button size="lg" onClick={onGenerate} disabled={!canProceed || isGenerating}>
              {isGenerating ? (
                <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Generating Concepts...</>
              ) : (
                <>
                  Generate Concepts (5 credits)
                  <ArrowRight01Icon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {!canProceed && (
              <p className="text-xs text-muted-foreground">
                Select an objective and at least one platform to continue
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
