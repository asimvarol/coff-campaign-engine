'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContentUI,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
} from '@repo/ui'
import { mockConnectedAccounts, platforms, type Platform } from '@/lib/mock-data/publish'
import { toast } from 'sonner'
import { Link01Icon, Delete02Icon, CheckmarkCircle02Icon, AlertCircle01Icon } from '@/lib/icons'

export default function PublishAccountsPage() {
  const [accounts, setAccounts] = useState(mockConnectedAccounts)
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [disconnectAlertOpen, setDisconnectAlertOpen] = useState(false)
  const [disconnectId, setDisconnectId] = useState('')

  const handleConnect = async (platform: Platform) => {
    const newAccount = {
      id: `${Date.now()}`,
      platform,
      username: `${platform}_user`,
      handle: `@${platform}_user`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${platform}`,
      status: 'connected' as const,
      lastUsed: new Date().toISOString(),
      connectedAt: new Date().toISOString(),
    }

    setAccounts([...accounts, newAccount])
    setConnectDialogOpen(false)
    setSelectedPlatform(null)
    toast.success(`Connected to ${platform}`)
  }

  const handleDisconnect = (id: string) => {
    setDisconnectId(id)
    setDisconnectAlertOpen(true)
  }

  const handleConfirmDisconnect = () => {
    const account = accounts.find((acc) => acc.id === disconnectId)
    setAccounts(accounts.filter((acc) => acc.id !== disconnectId))
    setDisconnectAlertOpen(false)
    toast.success(`Disconnected ${account?.platform || 'account'}`)
  }

  const handleTestPost = (id: string) => {
    const account = accounts.find((acc) => acc.id === id)
    toast.success(`Test post sent to ${account?.platform}!`)
  }

  const connectedPlatformIds = accounts.map((acc) => acc.platform)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Connected Accounts</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your social media platform connections
          </p>
        </div>
        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Link01Icon className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Connect Social Account</DialogTitle>
              <DialogDescription>
                Select a platform to connect your account. You'll be redirected to authorize access.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
              {platforms.map((platform) => {
                const isConnected = connectedPlatformIds.includes(platform.id)
                return (
                  <button
                    key={platform.id}
                    onClick={() => !isConnected && handleConnect(platform.id)}
                    disabled={isConnected}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      isConnected
                        ? 'cursor-not-allowed border-muted bg-muted/30 opacity-50'
                        : 'cursor-pointer border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{platform.name}</p>
                      {isConnected && (
                        <p className="text-xs text-muted-foreground">Connected</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const platform = platforms.find((p) => p.id === account.platform)
          const lastUsedDate = new Date(account.lastUsed)
          const isExpired = account.status === 'expired'

          return (
            <Card key={account.id} className={isExpired ? 'border-destructive/50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                      style={{ backgroundColor: platform?.color }}
                    >
                      {platform?.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{account.username}</CardTitle>
                      <CardDescription className="text-xs">
                        {account.handle}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={isExpired ? 'destructive' : 'default'}
                    className="gap-1"
                  >
                    {isExpired ? (
                      <>
                        <AlertCircle01Icon className="h-3 w-3" />
                        Expired
                      </>
                    ) : (
                      <>
                        <CheckmarkCircle02Icon className="h-3 w-3" />
                        Connected
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last used</span>
                  <span>
                    {lastUsedDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTestPost(account.id)}
                    disabled={isExpired}
                  >
                    Test Post
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    <Delete02Icon className="h-4 w-4" />
                  </Button>
                </div>
                {isExpired && (
                  <p className="text-xs text-destructive">
                    Connection expired. Please reconnect to continue posting.
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {accounts.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link01Icon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No connected accounts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect your first social media account to start publishing
            </p>
            <Button className="mt-4" onClick={() => setConnectDialogOpen(true)}>
              <Link01Icon className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={disconnectAlertOpen} onOpenChange={setDisconnectAlertOpen}>
        <AlertDialogContentUI>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this account? You will need to reconnect to post again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDisconnect} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContentUI>
      </AlertDialog>
    </div>
  )
}
