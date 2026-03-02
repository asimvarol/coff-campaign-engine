'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent } from '@repo/ui'

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            C
          </div>
          <span className="font-semibold">Coff Campaign</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sidebar using Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0 md:hidden">
          <Sidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
    </>
  )
}
