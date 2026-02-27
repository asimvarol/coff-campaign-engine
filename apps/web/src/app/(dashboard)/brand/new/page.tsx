import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@repo/ui'

export default function NewBrandPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Brand DNA</h1>
          <p className="text-muted-foreground">Enter your website URL and we'll analyze your brand identity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Analysis</CardTitle>
            <CardDescription>
              We'll extract colors, typography, voice, values, and more from your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input id="brandName" placeholder="Golden Horn Jewellery" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input id="url" type="url" placeholder="https://goldenhornshop.com" />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Analyze Brand (20 credits)</Button>
              <Button variant="outline">Manual Entry</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 rounded-lg border border-border p-4">
          <h4 className="mb-2 font-medium">What we'll extract:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Logo and brand images</li>
            <li>• Color palette (primary, secondary, accent)</li>
            <li>• Typography (heading & body fonts)</li>
            <li>• Brand voice and tone</li>
            <li>• Core values and aesthetic</li>
            <li>• Target audience insights</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
