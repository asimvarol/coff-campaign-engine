'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from '@repo/ui'
import { ArrowLeft01Icon, Sparkles01Icon } from '@/lib/icons'
import type { CampaignConcept } from '@repo/types'

interface ConceptsStepProps {
  concepts: CampaignConcept[]
  selectedConcept: CampaignConcept | null
  isGenerating: boolean
  onSelectConcept: (concept: CampaignConcept) => void
  onRegenerate: () => void
  onBack: () => void
}

function ConceptSkeleton() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

export function ConceptsStep({
  concepts, selectedConcept, isGenerating,
  onSelectConcept, onRegenerate, onBack,
}: ConceptsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Concepts</CardTitle>
        <CardDescription>
          {isGenerating ? 'Generating fresh concepts...' : 'Select a concept or regenerate for new ideas'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {isGenerating ? (
            <>
              <ConceptSkeleton />
              <ConceptSkeleton />
              <ConceptSkeleton />
              <ConceptSkeleton />
            </>
          ) : (
            concepts.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => onSelectConcept(concept)}
                className={`rounded-lg border p-6 text-left transition-all ${
                  selectedConcept === concept
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
                    <span key={tag} className="text-xs text-primary">{tag}</span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={isGenerating}>
            <ArrowLeft01Icon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={onRegenerate} disabled={isGenerating}>
            {isGenerating ? (
              <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Generating...</>
            ) : (
              'Regenerate Concepts (5 credits)'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
