export default function CampaignDetailLoading() {
  return (
    <div >
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-muted" />
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-9 w-64 animate-pulse rounded bg-muted" />
                <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="flex items-center gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-20 animate-pulse rounded bg-muted" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
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

      {/* Creatives Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>

        {/* Creatives Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border bg-card">
              <div className="aspect-square animate-pulse bg-muted" />
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-muted" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-8 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
