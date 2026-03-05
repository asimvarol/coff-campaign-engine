import { CampaignWizard } from '@/components/campaigns/campaign-wizard'

export const metadata = { title: 'New Campaign | Coff' }

export default function NewCampaignPage() {
  return (
    <div >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Campaign</h1>
        <p className="text-muted-foreground">Create an AI-powered multi-platform campaign</p>
      </div>

      <CampaignWizard />
    </div>
  )
}
