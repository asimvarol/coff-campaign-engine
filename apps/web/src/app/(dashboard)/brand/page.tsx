import { Button } from '@repo/ui'
import { Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function BrandPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand DNA</h1>
          <p className="text-muted-foreground">Extract and manage your brand identities</p>
        </div>
        <Link href="/brand/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No brands yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Create your first brand by analyzing a website. We'll extract colors, fonts, voice, and more.
        </p>
        <Link href="/brand/new" className="mt-6">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Brand
          </Button>
        </Link>
      </div>
    </div>
  )
}
