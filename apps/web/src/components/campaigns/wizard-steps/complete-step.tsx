'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { CheckmarkCircle02Icon, Download04Icon } from '@/lib/icons'
import type { MockCreative } from '@/lib/mock-data/campaigns'
import type { CampaignConcept } from '@repo/types'
import { toast } from 'sonner'

interface CompleteStepProps {
  campaignName: string
  selectedConcept: CampaignConcept | null
  platforms: string[]
  approvedCreatives: string[]
  generatedCreatives: MockCreative[]
  onSave: (status: string) => void
}

export function CompleteStep({
  campaignName, selectedConcept, platforms,
  approvedCreatives, generatedCreatives, onSave,
}: CompleteStepProps) {
  const handleDownloadAll = async () => {
    for (const creative of generatedCreatives) {
      try {
        const res = await fetch(creative.imageUrl)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${creative.platform}-${creative.format}.png`
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        toast.error(`Failed to download ${creative.platform} creative`)
      }
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckmarkCircle02Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Campaign Ready!</CardTitle>
        <CardDescription>
          {approvedCreatives.length} creatives approved across {platforms.length} platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-4 font-semibold">Campaign Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{campaignName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Concept:</span>
              <span className="font-medium">{selectedConcept?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platforms:</span>
              <span className="font-medium">{platforms.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approved Creatives:</span>
              <span className="font-medium">{approvedCreatives.length}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="w-full" onClick={handleDownloadAll}>
            <Download04Icon className="mr-2 h-4 w-4" />
            Download All
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onSave('DRAFT')}>
            Save as Draft
          </Button>
          <Button className="w-full" onClick={() => onSave('PUBLISHED')}>
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
  )
}
