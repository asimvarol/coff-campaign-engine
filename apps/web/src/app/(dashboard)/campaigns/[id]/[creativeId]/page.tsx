'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CreativeEditor } from '@/components/campaigns/creative-editor'
import { mockCreatives, type MockCreative } from '@/lib/mock-data/campaigns'
import { notFound } from 'next/navigation'

export default function CreativeEditorPage() {
  useEffect(() => { document.title = 'Creative Editor | Coff' }, [])

  const params = useParams()
  const id = params.id as string
  const creativeId = params.creativeId as string
  const [creative, setCreative] = useState<MockCreative | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCreative = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`)
        if (res.ok) {
          const data = await res.json()
          const found = data.data?.creatives?.find((c: { id: string }) => c.id === creativeId)
          if (found) {
            setCreative(found)
            setIsLoading(false)
            return
          }
        }
      } catch {
        // Fall through to mock data
      }

      // Fallback to mock data
      const mockCreative = mockCreatives.find(c => c.id === creativeId)
      if (mockCreative) {
        setCreative(mockCreative)
      }
      setIsLoading(false)
    }

    fetchCreative()
  }, [id, creativeId])

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>
  }

  if (!creative) {
    notFound()
  }

  return <CreativeEditor creative={creative} campaignId={id} />
}
