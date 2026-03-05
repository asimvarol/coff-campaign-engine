import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { PlusIcon, ZapIcon } from '@/lib/icons'

export const metadata = { title: 'Autopilot | Coff' }

export default function AutopilotPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autopilot</h1>
          <p className="text-muted-foreground">Automatic campaign optimization</p>
        </div>
        <Button size="lg">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Rule
        </Button>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Active Rules</CardDescription>
            <CardTitle className="text-2xl font-mono">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Actions Today</CardDescription>
            <CardTitle className="text-2xl font-mono">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Savings</CardDescription>
            <CardTitle className="text-2xl font-mono">$0</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Saved from auto-optimizations this month</p>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold">Recent Actions</h3>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ZapIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium">No actions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Autopilot actions will appear here once rules are active</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Active Rules</h3>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <PlusIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium">No rules configured</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first autopilot rule to start optimizing campaigns automatically</p>
            <Button className="mt-4" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
