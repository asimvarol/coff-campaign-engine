export default function CampaignsLoading() {
  return (
    <div >
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 h-9 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-96 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Stats Skeleton */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="mb-2 h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Campaigns Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border bg-card">
            <div className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
                <div className="flex-1">
                  <div className="mb-2 h-5 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>

              {/* Badges */}
              <div className="mb-4 flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
              </div>

              {/* Platforms */}
              <div className="mb-4 flex gap-1">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
