'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon, Edit02Icon } from '@/lib/icons'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import type { MockCreative } from '@/lib/mock-data/campaigns'
import Image from 'next/image'

interface ReviewStepProps {
  generatedCreatives: MockCreative[]
  approvedCreatives: string[]
  onApproveAll: () => void
  onToggleApprove: (id: string) => void
  onBack: () => void
  onContinue: () => void
  canProceed: boolean
}

export function ReviewStep({
  generatedCreatives, approvedCreatives,
  onApproveAll, onToggleApprove, onBack, onContinue, canProceed,
}: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Review Creatives</CardTitle>
            <CardDescription>
              {approvedCreatives.length} of {generatedCreatives.length} creatives approved
            </CardDescription>
          </div>
          <Button onClick={onApproveAll} variant="outline">Approve All</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {generatedCreatives.map(creative => {
            const isApproved = approvedCreatives.includes(creative.id)
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
                    <span className="text-xs font-medium">{PLATFORM_LABELS[creative.platform]}</span>
                    <span className="text-xs text-muted-foreground">{creative.format}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isApproved ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => onToggleApprove(creative.id)}
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
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft01Icon className="mr-2 h-4 w-4" />
            Back to Concepts
          </Button>
          <Button size="lg" onClick={onContinue} disabled={!canProceed}>
            Continue
            <ArrowRight01Icon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
