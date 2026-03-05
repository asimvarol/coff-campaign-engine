'use client'

import { useState, useEffect } from 'react'
import { Progress } from '@repo/ui'
import { CheckmarkCircle02Icon } from '@/lib/icons'
import { CampaignObjective } from '@repo/types'
import { generateMockConcepts, type MockCreative } from '@/lib/mock-data/campaigns'
import { PLATFORM_FORMATS } from '@/lib/mock-data/creative-formats'
import { useBrand } from '@/lib/brand-context'
import type { CampaignConcept } from '@repo/types'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import { toast } from 'sonner'

import { BriefStep } from './wizard-steps/brief-step'
import { ConceptsStep } from './wizard-steps/concepts-step'
import { GenerationStep } from './wizard-steps/generation-step'
import { ReviewStep } from './wizard-steps/review-step'
import { CompleteStep } from './wizard-steps/complete-step'

interface WizardState {
  brandId: string
  campaignName: string
  objective: CampaignObjective | ''
  platforms: string[]
  description: string
  productImage: string
  referenceImages: string[]
  selectedConcept: CampaignConcept | null
  generatedConcepts: CampaignConcept[]
  generatedCreatives: MockCreative[]
  generatingProgress: number
  approvedCreatives: string[]
}

export function CampaignWizard() {
  const { brands, selectedBrandId } = useBrand()
  const [step, setStep] = useState(1)
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

  useEffect(() => {
    if (selectedBrandId && !state.brandId) {
      updateState({ brandId: selectedBrandId })
    }
  }, [selectedBrandId])

  const updateState = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

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
            id: cr.id, platform: cr.platform, format: cr.format, imageUrl: cr.imageUrl,
          })),
        }),
      })
      window.location.href = '/campaigns'
    } catch (err) {
      console.error('Failed to save campaign:', err)
    }
  }

  const handleGenerateConcepts = async () => {
    setIsGenerating(true)
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

    const brandColors = brand.colors || { primary: '#000', secondary: '#666', accent: '#999', background: '#fff', text: '#000', palette: [] }

    const sizeMap: Record<string, string> = {
      instagram: 'square_hd', facebook: 'landscape_16_9', tiktok: 'portrait_16_9',
      linkedin: 'landscape_4_3', x: 'landscape_16_9', pinterest: 'portrait_4_3',
    }
    const formatMap: Record<string, string> = {
      instagram: 'feed', facebook: 'feed', tiktok: 'video',
      linkedin: 'post', x: 'post', pinterest: 'pin',
    }

    const tasks = state.platforms.map(platform => ({
      platform,
      format: formatMap[platform] || 'feed',
      imageSize: sizeMap[platform] || 'square_hd',
    }))

    let progressDone = false
    let fakeProgress = 0
    const progressInterval = setInterval(() => {
      if (progressDone) return
      fakeProgress = Math.min(fakeProgress + 2, 90)
      updateState({ generatingProgress: fakeProgress })
    }, 300)

    const buildCreative = (task: typeof tasks[0], imageUrl: string): MockCreative => {
      const platformFormat = PLATFORM_FORMATS[task.platform]?.[task.format]
      const width = platformFormat?.width || 1080
      const height = platformFormat?.height || 1080
      return {
        id: `creative-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${task.platform}`,
        campaignId: 'campaign-new',
        platform: task.platform,
        format: task.format,
        width, height, imageUrl,
        header: {
          text: concept.name.toUpperCase(), font: 'Playfair Display', size: 42,
          color: '#ffffff', position: { x: 50, y: 100 }, visible: true,
        },
        description: {
          text: concept.description.substring(0, 60) + '...',
          font: 'Outfit', size: 16, color: brandColors.secondary,
          position: { x: 50, y: 170 }, visible: true,
        },
        cta: { text: 'Shop Now', style: 'primary', url: '', visible: true },
        overlay: { color: '#000000', opacity: 0.3 },
        version: 1, status: 'DRAFT', createdAt: new Date(),
      }
    }

    const placeholderUrl = (task: typeof tasks[0]) => {
      const pf = PLATFORM_FORMATS[task.platform]?.[task.format]
      const w = pf?.width || 1080
      const h = pf?.height || 1080
      const fg = brandColors.primary.replace(/^#/, '')
      const bg = brandColors.accent.replace(/^#/, '')
      return `https://placehold.co/${w}x${h}/${fg}/${bg}?text=${encodeURIComponent(task.platform)}`
    }

    const imageGenEnabled = process.env.NEXT_PUBLIC_ENABLE_IMAGE_GEN !== 'false'
    const imageGenEndpoint = process.env.NEXT_PUBLIC_IMAGE_GEN_ENDPOINT || '/api/generate-image'

    try {
      const results = await Promise.allSettled(
        tasks.map(async (task) => {
          if (!imageGenEnabled) return buildCreative(task, placeholderUrl(task))
          try {
            const res = await fetch(imageGenEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: `Marketing campaign visual for "${concept.name}": ${concept.description}. ${concept.colorMood}. Professional, eye-catching, modern design, using ${brandColors.primary} and ${brandColors.accent} color scheme`,
                negative_prompt: 'text, watermark, logo, blurry, low quality, ugly',
                image_size: task.imageSize,
                num_images: 1,
              }),
            })
            if (!res.ok) throw new Error('Generation failed')
            const data = await res.json()
            const imageUrl = data?.images?.[0]?.url
            if (!imageUrl || typeof imageUrl !== 'string') throw new Error('Invalid response')
            return buildCreative(task, imageUrl)
          } catch (error) {
            console.warn(`Image generation failed for ${task.platform}:`, error instanceof Error ? error.message : 'Unknown error')
            toast.error(`Failed to generate image for ${task.platform}`)
            return buildCreative(task, placeholderUrl(task))
          }
        })
      )
      const creatives = results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
      updateState({ generatedCreatives: creatives, generatingProgress: 100 })
    } catch (criticalError) {
      console.error('Critical generation failure:', criticalError)
      const fallbackCreatives = tasks.map(task => buildCreative(task, placeholderUrl(task)))
      updateState({ generatedCreatives: fallbackCreatives, generatingProgress: 100 })
    } finally {
      progressDone = true
      clearInterval(progressInterval)
      setIsGenerating(false)
      setTimeout(() => setStep(4), 500)
    }
  }

  const canProceed = () => {
    if (step === 1) return !!(state.brandId && state.campaignName && state.objective && state.platforms.length > 0)
    if (step === 2) return state.selectedConcept !== null
    if (step === 3) return state.generatedCreatives.length > 0
    if (step === 4) return state.approvedCreatives.length > 0
    return true
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          {['Brief', 'Concepts', 'Generation', 'Review', 'Complete'].map((name, idx) => {
            const stepNum = idx + 1
            const isCompleted = step > stepNum
            const isCurrent = step === stepNum
            return (
              <div key={name} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  {isCompleted ? (
                    <button
                      onClick={() => setStep(stepNum)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                      <CheckmarkCircle02Icon className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {stepNum}
                    </div>
                  )}
                  <span className={`text-xs ${
                    isCompleted ? 'font-medium text-primary' : isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}>
                    {name}
                  </span>
                </div>
                {idx < 4 && <div className={`mx-2 h-px flex-1 ${step > stepNum ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            )
          })}
        </div>
        <Progress value={(step / 5) * 100} className="h-2" />
      </div>

      {/* Steps */}
      {step === 1 && (
        <BriefStep
          brandId={state.brandId}
          campaignName={state.campaignName}
          objective={state.objective}
          platforms={state.platforms}
          description={state.description}
          brands={brands}
          isGenerating={isGenerating}
          onUpdate={updateState}
          onGenerate={handleGenerateConcepts}
          canProceed={canProceed()}
        />
      )}

      {step === 2 && (
        <ConceptsStep
          concepts={state.generatedConcepts}
          selectedConcept={state.selectedConcept}
          isGenerating={isGenerating}
          onSelectConcept={handleSelectConcept}
          onRegenerate={handleGenerateConcepts}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <GenerationStep
          platforms={state.platforms}
          generatingProgress={state.generatingProgress}
          generatedCreatives={state.generatedCreatives}
        />
      )}

      {step === 4 && (
        <ReviewStep
          generatedCreatives={state.generatedCreatives}
          approvedCreatives={state.approvedCreatives}
          onApproveAll={() => updateState({ approvedCreatives: state.generatedCreatives.map(c => c.id) })}
          onToggleApprove={(id) => {
            const approved = state.approvedCreatives.includes(id)
            updateState({
              approvedCreatives: approved
                ? state.approvedCreatives.filter(i => i !== id)
                : [...state.approvedCreatives, id]
            })
          }}
          onBack={() => setStep(2)}
          onContinue={() => setStep(5)}
          canProceed={canProceed()}
        />
      )}

      {step === 5 && (
        <CompleteStep
          campaignName={state.campaignName}
          selectedConcept={state.selectedConcept}
          platforms={state.platforms}
          approvedCreatives={state.approvedCreatives}
          generatedCreatives={state.generatedCreatives}
          onSave={saveCampaign}
        />
      )}
    </div>
  )
}
