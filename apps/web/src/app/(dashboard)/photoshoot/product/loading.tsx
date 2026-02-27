import { Card, CardContent } from '@repo/ui'

export default function ProductPhotoshootLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="mb-2 h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-5 w-96 animate-pulse rounded bg-muted" />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}
