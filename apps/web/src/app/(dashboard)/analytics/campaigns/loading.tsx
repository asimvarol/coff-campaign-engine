import { Card, CardContent, CardHeader } from '@repo/ui'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <Card>
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table header */}
            <div className="flex gap-4 border-b border-border pb-3">
              {[80, 60, 80, 60, 40, 40, 50].map((w, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${w}px` }} />
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                <div className="h-6 w-10 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
