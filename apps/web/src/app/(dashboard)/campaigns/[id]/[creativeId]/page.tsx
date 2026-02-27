import { CreativeEditor } from '@/components/campaigns/creative-editor'
import { mockCreatives } from '@/lib/mock-data/campaigns'
import { notFound } from 'next/navigation'

export default async function CreativeEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string; creativeId: string }> 
}) {
  const resolvedParams = await params
  const creative = mockCreatives.find(c => c.id === resolvedParams.creativeId)
  
  if (!creative) {
    notFound()
  }

  return <CreativeEditor creative={creative} campaignId={resolvedParams.id} />
}
