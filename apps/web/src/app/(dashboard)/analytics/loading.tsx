import { Card, CardContent, CardHeader } from '@repo/ui'

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><div className="h-4 w-20 animate-pulse rounded bg-muted" /></CardHeader>
            <CardContent><div className="h-8 w-16 animate-pulse rounded bg-muted" /></CardContent>
          </Card>
        ))}
      </div>
      <Card><CardContent className="p-6"><div className="h-64 animate-pulse rounded bg-muted" /></CardContent></Card>
    </div>
  )
}
