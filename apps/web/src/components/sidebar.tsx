'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@repo/ui'
import Image from 'next/image'
import { useBrand } from '@/lib/brand-context'
import { Plus, ChevronDown, Check, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import {
  Sparkles01Icon,
  Target03Icon,
  Camera01Icon,
  Calendar03Icon,
  Analytics01Icon,
  Lightning01Icon,
  Building03Icon,
  Link01Icon,
  ClockIcon,
} from '@/lib/icons'

const navigation = [
  { name: 'Brand DNA', href: '/brand', icon: Sparkles01Icon },
  { name: 'Campaigns', href: '/campaigns', icon: Target03Icon },
  { name: 'Photoshoot', href: '/photoshoot', icon: Camera01Icon },
  { 
    name: 'Publish', 
    href: '/publish', 
    icon: Calendar03Icon,
    subItems: [
      { name: 'Calendar', href: '/publish/calendar', icon: Calendar03Icon },
      { name: 'Queue', href: '/publish/queue', icon: ClockIcon },
      { name: 'Accounts', href: '/publish/accounts', icon: Link01Icon },
    ],
  },
  { name: 'Analytics', href: '/analytics', icon: Analytics01Icon },
  { name: 'Autopilot', href: '/autopilot', icon: Lightning01Icon },
  { name: 'Agency', href: '/agency', icon: Building03Icon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { brands, selectedBrand, selectedBrandId, selectBrand, deleteBrand } = useBrand()
  const [brandMenuOpen, setBrandMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setBrandMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles01Icon className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold">Coff Campaign</span>
      </div>

      {/* Brand Selector */}
      <div ref={menuRef} className="relative border-b border-border p-3">
        <button
          onClick={() => setBrandMenuOpen(!brandMenuOpen)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
        >
          {selectedBrand ? (
            <>
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={selectedBrand.logo.primary} alt={selectedBrand.name} fill unoptimized className="object-contain" />
              </div>
              <span className="flex-1 truncate text-left font-medium">{selectedBrand.name}</span>
            </>
          ) : (
            <>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                <Sparkles01Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left text-muted-foreground">Select a brand</span>
            </>
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", brandMenuOpen && "rotate-180")} />
        </button>

        {/* Dropdown */}
        {brandMenuOpen && (
          <div className="absolute inset-x-3 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            {brands.length > 0 && (
              <div className="max-h-48 overflow-y-auto p-1">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => { selectBrand(brand.id); setBrandMenuOpen(false) }}
                    className={cn(
                      "group/item flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      brand.id === selectedBrandId ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded bg-muted">
                      <Image src={brand.logo.primary} alt={brand.name} fill unoptimized className="object-contain" />
                    </div>
                    <span className="flex-1 truncate text-left">{brand.name}</span>
                    {brand.id === selectedBrandId && <Check className="h-4 w-4 shrink-0" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBrand(brand.id); }}
                      className="ml-1 shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/item:opacity-100"
                      title="Delete brand"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </button>
                ))}
              </div>
            )}
            <div className="border-t border-border p-1">
              <Link
                href="/brand/new"
                onClick={() => setBrandMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add new brand
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const hasSubItems = 'subItems' in item && item.subItems
          
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
              
              {hasSubItems && isActive && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors',
                          isSubActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <subItem.icon className="h-3 w-3" />
                        {subItem.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted p-3 text-xs">
          <p className="font-medium text-foreground">Credits: 150</p>
          <p className="text-muted-foreground">Upgrade for unlimited</p>
        </div>
      </div>
    </div>
  )
}
