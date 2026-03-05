import { Button } from '@repo/ui'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-semibold">Page Not Found</h2>
      <p className="mb-6 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild><Link href="/campaigns">Go Home</Link></Button>
    </div>
  )
}
