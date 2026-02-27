'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@repo/ui'
import {
  Sparkles01Icon,
  Target03Icon,
  Camera01Icon,
  Calendar03Icon,
  Analytics01Icon,
  Lightning01Icon,
  Building03Icon,
  Menu01Icon,
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

  return (
    <div className="flex w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles01Icon className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold">Coff Campaign</span>
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
