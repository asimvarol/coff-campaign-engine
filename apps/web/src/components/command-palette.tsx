'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@repo/ui'

const routes = [
  { name: 'Brand DNA', href: '/brand', group: 'Pages' },
  { name: 'Campaigns', href: '/campaigns', group: 'Pages' },
  { name: 'Photoshoot', href: '/photoshoot', group: 'Pages' },
  { name: 'Publish Hub', href: '/publish', group: 'Pages' },
  { name: 'Content Calendar', href: '/publish/calendar', group: 'Pages' },
  { name: 'Analytics', href: '/analytics', group: 'Pages' },
  { name: 'AI Insights', href: '/analytics/insights', group: 'Pages' },
  { name: 'Reports', href: '/analytics/reports', group: 'Pages' },
  { name: 'Autopilot', href: '/autopilot', group: 'Pages' },
  { name: 'Agency', href: '/agency', group: 'Pages' },
  { name: 'Connected Accounts', href: '/publish/accounts', group: 'Pages' },
  { name: 'New Campaign', href: '/campaigns/new', group: 'Actions' },
  { name: 'Create Photoshoot', href: '/photoshoot/create', group: 'Actions' },
  { name: 'Schedule Post', href: '/publish/schedule', group: 'Actions' },
  { name: 'Add Brand', href: '/brand/new', group: 'Actions' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const pages = routes.filter((r) => r.group === 'Pages')
  const actions = routes.filter((r) => r.group === 'Actions')

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((route) => (
            <CommandItem key={route.href} onSelect={() => handleSelect(route.href)}>
              {route.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          {actions.map((route) => (
            <CommandItem key={route.href} onSelect={() => handleSelect(route.href)}>
              {route.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <CommandShortcut>⌘K to toggle</CommandShortcut>
      </div>
    </CommandDialog>
  )
}
