import Link from 'next/link'
import { Button } from '@repo/ui'
import { ArrowLeftIcon } from '@/lib/icons'

export default function CampaignNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Campaign Not Found</h1>
      <p className="text-muted-foreground">
        The campaign you're looking for doesn't exist or has been deleted.
      </p>
      <Link href="/campaigns">
        <Button>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </Link>
    </div>
  )
}
