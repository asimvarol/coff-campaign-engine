import { CampaignWizard } from '@/components/campaigns/campaign-wizard'

export default function NewCampaignPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Campaign</h1>
        <p className="text-muted-foreground">Create an AI-powered multi-platform campaign</p>
      </div>

      <CampaignWizard />
    </div>
  )
}
