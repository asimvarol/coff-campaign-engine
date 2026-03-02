import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Campaigns',
  description: 'Manage your marketing campaigns with AI-powered insights',
  path: '/campaigns',
})

export { default } from '@/components/campaigns/campaign-list'
