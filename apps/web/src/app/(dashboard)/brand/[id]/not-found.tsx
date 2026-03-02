import Link from 'next/link'
import { Button } from '@repo/ui'
import { ArrowLeftIcon } from '@/lib/icons'

export default function BrandNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Brand Not Found</h1>
      <p className="text-muted-foreground">
        The brand you're looking for doesn't exist or has been deleted.
      </p>
      <Link href="/brand">
        <Button>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Brands
        </Button>
      </Link>
    </div>
  )
}
