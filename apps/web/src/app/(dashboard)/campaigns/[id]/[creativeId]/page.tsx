import { CreativeEditor } from '@/components/campaigns/creative-editor'
import { mockCreatives } from '@/lib/mock-data/campaigns'
import { notFound } from 'next/navigation'

export default function CreativeEditorPage({ 
  params 
}: { 
  params: { id: string; creativeId: string } 
}) {
  const creative = mockCreatives.find(c => c.id === params.creativeId)
  
  if (!creative) {
    notFound()
  }

  return <CreativeEditor creative={creative} campaignId={params.id} />
}
