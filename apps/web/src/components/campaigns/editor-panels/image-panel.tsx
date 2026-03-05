'use client'

import { Button } from '@repo/ui'
import { Image01Icon, Magic01Icon } from '@/lib/icons'
import Image from 'next/image'
import { MockCreative } from '@/lib/mock-data/campaigns'

interface ImagePanelProps {
  creative: MockCreative
}

export function ImagePanel({ creative }: ImagePanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-4 font-semibold">Background Image</h3>
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={creative.imageUrl}
            alt="Background"
            width={300}
            height={200}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" aria-label="Upload new background image">
            <Image01Icon className="mr-2 h-4 w-4" />
            Upload New
          </Button>
          <Button variant="outline" className="flex-1" aria-label="Generate new background with AI">
            <Magic01Icon className="mr-2 h-4 w-4" />
            Generate New
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          Generate a new background (3 credits) or upload your own image.
        </p>
      </div>
    </div>
  )
}
