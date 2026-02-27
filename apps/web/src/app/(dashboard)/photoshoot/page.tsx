import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { Camera, Upload } from 'lucide-react'

export default function PhotoshootPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Photoshoot Studio</h1>
        <p className="text-muted-foreground">AI-powered product photography</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Camera className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Product Photoshoot</CardTitle>
            <CardDescription>Upload product image and generate professional photos with AI backgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Upload product image</p>
              </div>
            </div>
            <Button className="w-full">Generate Photoshoot (10 credits)</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Camera className="mb-2 h-8 w-8 text-accent" />
            <CardTitle>Free Generation</CardTitle>
            <CardDescription>Generate any creative with AI using brand DNA styling</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="mb-4 w-full rounded-lg border border-input bg-background p-3 text-sm"
              rows={6}
              placeholder="Describe what you want to generate..."
            />
            <Button className="w-full">Generate (3 credits)</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">Available Templates</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          {['Minimalist Studio', 'Lifestyle Scene', 'Nature/Outdoor', 'Luxury', 'Seasonal', 'Abstract', 'Flat Lay', 'In Use'].map((template) => (
            <div key={template} className="rounded-lg border border-border p-3 text-center text-sm">
              {template}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
