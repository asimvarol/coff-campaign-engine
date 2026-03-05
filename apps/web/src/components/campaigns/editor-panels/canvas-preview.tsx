'use client'

import Image from 'next/image'
import { MockCreative } from '@/lib/mock-data/campaigns'

interface CanvasPreviewProps {
  creative: MockCreative
}

export function CanvasPreview({ creative }: CanvasPreviewProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 p-8">
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl"
        style={{
          width: Math.min(creative.width / 2, 540),
          aspectRatio: `${creative.width}/${creative.height}`,
        }}
      >
        <Image
          src={creative.imageUrl}
          alt="Creative preview"
          fill
          unoptimized
          className="object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: creative.overlay.color,
            opacity: creative.overlay.opacity,
          }}
        />

        {creative.header.visible && (
          <div
            className="absolute"
            style={{
              left: `${creative.header.position.x}px`,
              top: `${creative.header.position.y}px`,
              color: creative.header.color,
              fontSize: `${creative.header.size / 2}px`,
              fontFamily: creative.header.font,
              fontWeight: 700,
              maxWidth: `${creative.width / 2 - 100}px`,
            }}
          >
            {creative.header.text}
          </div>
        )}

        {creative.description.visible && (
          <div
            className="absolute"
            style={{
              left: `${creative.description.position.x}px`,
              top: `${creative.description.position.y}px`,
              color: creative.description.color,
              fontSize: `${creative.description.size / 2}px`,
              fontFamily: creative.description.font,
              maxWidth: `${creative.width / 2 - 100}px`,
            }}
          >
            {creative.description.text}
          </div>
        )}

        {creative.cta.visible && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white"
              style={{ fontSize: '14px' }}
            >
              {creative.cta.text}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
