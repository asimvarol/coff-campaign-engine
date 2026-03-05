'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@repo/ui'
import { PLATFORM_LABELS } from '@/lib/mock-data/creative-formats'
import type { MockCreative } from '@/lib/mock-data/campaigns'
import Image from 'next/image'

interface GenerationStepProps {
  platforms: string[]
  generatingProgress: number
  generatedCreatives: MockCreative[]
}

export function GenerationStep({ platforms, generatingProgress, generatedCreatives }: GenerationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generating Creatives</CardTitle>
        <CardDescription>
          AI is creating {platforms.length * 2}+ creatives for {platforms.length} platforms...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="py-12 text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <Progress value={generatingProgress} className="mb-4" />
          <p className="text-lg font-semibold">{Math.round(generatingProgress)}%</p>
          <p className="text-sm text-muted-foreground">
            {generatedCreatives.length} creatives generated
          </p>
        </div>

        {generatedCreatives.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {generatedCreatives.map(creative => (
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
  )
}
