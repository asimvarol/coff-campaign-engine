import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@repo/ui'
import { Package, Wand2 } from 'lucide-react'

export function ModeCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-6 w-6" />
          </div>
          <CardTitle>Product Photoshoot</CardTitle>
          <CardDescription>
            Upload product image and generate professional photos with AI backgrounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/photoshoot/product">
            <Button className="w-full">
              Start Product Photoshoot
              <span className="ml-2 text-xs opacity-80">(10 credits)</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground">
            <Wand2 className="h-6 w-6" />
          </div>
          <CardTitle>Free Generation</CardTitle>
          <CardDescription>
            Generate any creative with AI using natural language and brand DNA styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/photoshoot/free">
            <Button variant="secondary" className="w-full">
              Start Free Generation
              <span className="ml-2 text-xs opacity-80">(3 credits)</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
