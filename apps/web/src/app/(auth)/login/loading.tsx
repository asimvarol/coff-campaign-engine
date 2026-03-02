import { Card, CardContent, CardHeader, Skeleton } from '@repo/ui'

export default function LoginLoading() {
  return (
    <Card className="border-border/50">
      <CardHeader className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
