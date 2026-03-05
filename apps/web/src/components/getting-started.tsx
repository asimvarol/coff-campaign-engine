'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui'
import { useBrand } from '@/lib/brand-context'

interface ChecklistItem {
  id: string
  label: string
  description: string
  href: string
  cta: string
}

const CHECKLIST: ChecklistItem[] = [
  { id: 'brand', label: 'Add your brand', description: 'Extract brand DNA from your website', href: '/brand/new', cta: 'Add Brand' },
  { id: 'campaign', label: 'Create a campaign', description: 'Generate AI-powered creatives', href: '/campaigns/new', cta: 'New Campaign' },
  { id: 'publish', label: 'Connect social accounts', description: 'Link platforms to start publishing', href: '/publish/accounts', cta: 'Connect' },
]

export function GettingStarted() {
  const { brands } = useBrand()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('coff-getting-started-dismissed')
    if (stored === 'true') setDismissed(true)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('coff-getting-started-dismissed', 'true')
  }

  // Don't show if user has brands (they've started) or dismissed
  if (dismissed || brands.length > 0) return null

  return (
    <Card className="mb-6 border-primary/30 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Getting Started</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs text-muted-foreground">
          Dismiss
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {CHECKLIST.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={item.href}>{item.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
