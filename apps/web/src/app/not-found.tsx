import Link from 'next/link'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { ArrowLeft01Icon } from '@/lib/icons'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft01Icon className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Looking for something specific?
            </p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              <Link href="/campaigns">
                <Button variant="link" size="sm">Campaigns</Button>
              </Link>
              <Link href="/brand">
                <Button variant="link" size="sm">Brands</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="link" size="sm">Analytics</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
