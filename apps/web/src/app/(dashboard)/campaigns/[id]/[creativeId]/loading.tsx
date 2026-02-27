export default function CreativeEditorLoading() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header Skeleton */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="mb-2 h-5 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>

      {/* Editor Layout Skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Preview */}
        <div className="flex flex-1 items-center justify-center bg-muted/30 p-8">
          <div className="overflow-hidden rounded-lg shadow-2xl" style={{ width: 540, height: 960 }}>
            <div className="h-full w-full animate-pulse bg-muted" />
          </div>
        </div>

        {/* Edit Panel */}
        <div className="w-96 overflow-y-auto border-l bg-card p-6">
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>

            {/* Form Fields */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
