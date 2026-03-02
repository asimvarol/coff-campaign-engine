'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search01Icon } from '@/lib/icons'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  href: string
  keywords?: string[]
}

const commands: CommandItem[] = [
  { id: 'brand', title: 'Brand DNA', href: '/brand', keywords: ['brand', 'dna', 'identity'] },
  { id: 'campaigns', title: 'Campaigns', href: '/campaigns', keywords: ['campaign', 'marketing'] },
  { id: 'photoshoot', title: 'Photoshoot Studio', href: '/photoshoot', keywords: ['photo', 'image', 'studio'] },
  { id: 'calendar', title: 'Publishing Calendar', href: '/publish/calendar', keywords: ['publish', 'calendar', 'schedule'] },
  { id: 'analytics', title: 'Analytics', href: '/analytics', keywords: ['analytics', 'stats', 'data'] },
  { id: 'agency', title: 'Agency Mode', href: '/agency', keywords: ['agency', 'team', 'multi'] },
  { id: 'autopilot', title: 'Autopilot', href: '/autopilot', keywords: ['autopilot', 'auto', 'ai'] },
]

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const filtered = commands.filter((cmd) => {
    const searchLower = search.toLowerCase()
    return (
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some((k) => k.includes(searchLower))
    )
  })

  const handleSelect = (href: string) => {
    setOpen(false)
    setSearch('')
    router.push(href)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-card p-4 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-2 border-b pb-3">
              <Search01Icon className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
                autoFocus
              />
              <kbd className="rounded bg-muted px-2 py-1 text-xs">⌘K</kbd>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <div className="font-medium">{cmd.title}</div>
                  {cmd.subtitle && (
                    <div className="text-xs text-muted-foreground">{cmd.subtitle}</div>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
