import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@repo/ui'

export default function NewCampaignPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Campaign</h1>
          <p className="text-muted-foreground">Create an AI-powered multi-platform campaign</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Brief</CardTitle>
              <CardDescription>Tell us about your campaign goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input id="campaignName" placeholder="Mother's Day Collection 2026" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <select id="brand" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Select brand...</option>
                  <option>Golden Horn Jewellery</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <select id="objective" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Awareness</option>
                  <option>Engagement</option>
                  <option>Conversion</option>
                  <option>Traffic</option>
                  <option>Product Launch</option>
                  <option>Seasonal</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Target Platforms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X/Twitter', 'Pinterest'].map((platform) => (
                    <label key={platform} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full">Generate Campaign Concepts (5 credits)</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
