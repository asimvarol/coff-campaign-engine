'use client'

import { useState, useEffect } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea, Progress } from '@repo/ui'
import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon, Image01Icon, Target03Icon, Sparkles01Icon, Edit02Icon, Download04Icon } from '@/lib/icons'
import { CampaignObjective } from '@repo/types'
import { generateMockConcepts, generateMockCreatives, type MockCreative } from '@/lib/mock-data/campaigns'
import { useBrand } from '@/lib/brand-context'
import type { CampaignConcept } from '@repo/types'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import Image from 'next/image'

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

interface WizardState {
  // Step 1
  brandId: string
  campaignName: string
  objective: CampaignObjective | ''
  platforms: string[]
  description: string
  productImage: string
  referenceImages: string[]
  
  // Step 2
  selectedConcept: CampaignConcept | null
  generatedConcepts: CampaignConcept[]
  
  // Step 3
  generatedCreatives: MockCreative[]
  generatingProgress: number
  
  // Step 4
  approvedCreatives: string[]
}

export function CampaignWizard() {
  const { brands, selectedBrandId } = useBrand()
  const [step, setStep] = useState(1)

  // Auto-set brand from sidebar selection
  useEffect(() => {
    if (selectedBrandId && !state.brandId) {
      updateState({ brandId: selectedBrandId })
    }
  }, [selectedBrandId])
  const [isGenerating, setIsGenerating] = useState(false)
  const [state, setState] = useState<WizardState>({
    brandId: selectedBrandId || '',
    campaignName: '',
    objective: '',
    platforms: [],
    description: '',
    productImage: '',
    referenceImages: [],
    selectedConcept: null,
    generatedConcepts: [],
    generatedCreatives: [],
    generatingProgress: 0,
    approvedCreatives: [],
  })

  const saveCampaign = async (status: string) => {
    try {
      const brand = brands.find(b => b.id === state.brandId)
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.campaignName,
          brandId: state.brandId,
          brandName: brand?.name || '',
          brandLogo: brand?.logo?.primary || '',
          objective: state.objective,
          status,
          platforms: state.platforms,
          creativeCount: state.approvedCreatives.length,
          description: state.description,
          conceptName: state.selectedConcept?.name || '',
          creatives: state.generatedCreatives.map(cr => ({
            id: cr.id,
            platform: cr.platform,
            format: cr.format,
            imageUrl: cr.imageUrl,
          })),
        }),
      })
      window.location.href = '/campaigns'
    } catch (err) {
      console.error('Failed to save campaign:', err)
    }
  }

  const updateState = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleGenerateConcepts = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    const concepts = generateMockConcepts(state.brandId, state.objective as CampaignObjective, state.platforms)
    updateState({ generatedConcepts: concepts })
    setIsGenerating(false)
    setStep(2)
  }

  const handleSelectConcept = async (concept: CampaignConcept) => {
    updateState({ selectedConcept: concept })
    setIsGenerating(true)
    setStep(3)
    
    const brand = brands.find(b => b.id === state.brandId)
    if (!brand) return
    
    // Simulate staggered generation
    let progress = 0
    const totalCreatives = state.platforms.length * 2 // 2 creatives per platform avg
    const interval = setInterval(() => {
      progress += 1
      updateState({ generatingProgress: Math.min(100, (progress / totalCreatives) * 100) })
      if (progress >= totalCreatives) {
        clearInterval(interval)
      }
    }, 300)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    const creatives = await generateMockCreatives(
      'campaign-new',
      concept,
      state.platforms,
      brand.colors
    )
    
    clearInterval(interval)
    updateState({ generatedCreatives: creatives, generatingProgress: 100 })
    setIsGenerating(false)
    
    // Auto-advance after a moment
    setTimeout(() => setStep(4), 500)
  }

  const handleApproveAll = () => {
    const allIds = state.generatedCreatives.map(c => c.id)
    updateState({ approvedCreatives: allIds })
  }

  const toggleApprove = (id: string) => {
    const approved = state.approvedCreatives.includes(id)
    if (approved) {
      updateState({ approvedCreatives: state.approvedCreatives.filter(i => i !== id) })
    } else {
      updateState({ approvedCreatives: [...state.approvedCreatives, id] })
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return state.brandId && state.campaignName && state.objective && state.platforms.length > 0
    }
    if (step === 2) {
      return state.selectedConcept !== null
    }
    if (step === 3) {
      return state.generatedCreatives.length > 0
    }
    if (step === 4) {
      return state.approvedCreatives.length > 0
    }
    return true
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {step} of 5</span>
          <span>{['Brief', 'Concepts', 'Generation', 'Review', 'Complete'][step - 1]}</span>
        </div>
        <Progress value={(step / 5) * 100} className="h-2" />
      </div>

      {/* Step 1: Brief */}
      {step === 1 && (
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
                value={state.campaignName}
                onChange={(e) => updateState({ campaignName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <select
                id="brand"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={state.brandId}
                onChange={(e) => updateState({ brandId: e.target.value })}
              >
                <option value="">Select brand...</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Campaign Objective *</Label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {OBJECTIVES.map(obj => (
                  <button
                    key={obj.id}
                    onClick={() => updateState({ objective: obj.id as CampaignObjective })}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      state.objective === obj.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
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
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                      state.platforms.includes(platform.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={state.platforms.includes(platform.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateState({ platforms: [...state.platforms, platform.id] })
                        } else {
                          updateState({ platforms: state.platforms.filter(p => p !== platform.id) })
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
                value={state.description}
                onChange={(e) => updateState({ description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                size="lg"
                onClick={handleGenerateConcepts}
                disabled={!canProceed() || isGenerating}
              >
                {isGenerating ? (
                  <>Generating Concepts...</>
                ) : (
                  <>
                    Generate Concepts (5 credits)
                    <ArrowRight01Icon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI Concepts */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Concepts</CardTitle>
            <CardDescription>Select a concept or regenerate for new ideas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {state.generatedConcepts.map((concept, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectConcept(concept)}
                  className={`rounded-lg border p-6 text-left transition-all ${
                    state.selectedConcept === concept
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{concept.name}</h3>
                    <Sparkles01Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{concept.description}</p>
                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">{concept.emotion}</span>
                    <span className="text-xs text-muted-foreground">{concept.colorMood}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {concept.hashtags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft01Icon className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleGenerateConcepts} disabled={isGenerating}>
                Regenerate Concepts (5 credits)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Creative Generation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Creatives</CardTitle>
            <CardDescription>
              AI is creating {state.platforms.length * 2}+ creatives for {state.platforms.length} platforms...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <Progress value={state.generatingProgress} className="mb-4" />
              <p className="text-lg font-semibold">{Math.round(state.generatingProgress)}%</p>
              <p className="text-sm text-muted-foreground">
                {state.generatedCreatives.length} creatives generated
              </p>
            </div>

            {state.generatedCreatives.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {state.generatedCreatives.map(creative => (
                  <div key={creative.id} className="overflow-hidden rounded-lg border bg-card opacity-0 animate-in fade-in">
                    <div className="relative aspect-square">
                      <Image
                        src={creative.imageUrl}
                        alt={creative.header.text}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-muted-foreground">
                        {PLATFORM_LABELS[creative.platform]} — {creative.format}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Review Creatives</CardTitle>
                <CardDescription>
                  {state.approvedCreatives.length} of {state.generatedCreatives.length} creatives approved
                </CardDescription>
              </div>
              <Button onClick={handleApproveAll} variant="outline">
                Approve All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {state.generatedCreatives.map(creative => {
                const isApproved = state.approvedCreatives.includes(creative.id)
                return (
                  <div
                    key={creative.id}
                    className={`group relative overflow-hidden rounded-lg border transition-all ${
                      isApproved ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={creative.imageUrl}
                        alt={creative.header.text}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {isApproved && (
                        <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                          <CheckmarkCircle02Icon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {PLATFORM_LABELS[creative.platform]}
                        </span>
                        <span className="text-xs text-muted-foreground">{creative.format}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isApproved ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => toggleApprove(creative.id)}
                        >
                          {isApproved ? 'Approved' : 'Approve'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit02Icon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft01Icon className="mr-2 h-4 w-4" />
                Back to Concepts
              </Button>
              <Button
                size="lg"
                onClick={() => setStep(5)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight01Icon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Complete */}
      {step === 5 && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckmarkCircle02Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Campaign Ready!</CardTitle>
            <CardDescription>
              {state.approvedCreatives.length} creatives approved across {state.platforms.length} platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/50 p-6">
              <h3 className="mb-4 font-semibold">Campaign Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{state.campaignName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concept:</span>
                  <span className="font-medium">{state.selectedConcept?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platforms:</span>
                  <span className="font-medium">{state.platforms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved Creatives:</span>
                  <span className="font-medium">{state.approvedCreatives.length}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="w-full">
                <Download04Icon className="mr-2 h-4 w-4" />
                Download All
              </Button>
              <Button variant="outline" className="w-full" onClick={() => saveCampaign('DRAFT')}>
                Save as Draft
              </Button>
              <Button className="w-full" onClick={() => saveCampaign('PUBLISHED')}>
                Schedule & Publish
              </Button>
            </div>

            <div className="text-center">
              <Button variant="link" onClick={() => window.location.href = '/campaigns'}>
                View All Campaigns
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
