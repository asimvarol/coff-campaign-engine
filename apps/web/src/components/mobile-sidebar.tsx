'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Menu, X } from 'lucide-react'

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

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
    </>
  )
}
