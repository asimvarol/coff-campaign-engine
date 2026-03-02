'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@repo/ui'
import Image from 'next/image'
import { useBrand } from '@/lib/brand-context'
import { PlusIcon, ChevronDownIcon, CheckIcon, Trash2Icon } from '@/lib/icons'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui'
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

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { brands, selectedBrand, selectedBrandId, selectBrand, deleteBrand } = useBrand()
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null)

  const handleDeleteClick = (brandId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBrandToDelete(brandId)
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      await deleteBrand(brandToDelete)
      setBrandToDelete(null)
    }
    setDeleteAlertOpen(false)
  }

  return (
    <div className="flex w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles01Icon className="h-4 w-4" />
        </div>
        <span className="flex-1 text-lg font-semibold">Coff Campaign</span>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Brand Selector */}
      <div className="border-b border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted">
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
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[232px]">
            {brands.length > 0 && (
              <>
                {brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand.id}
                    onClick={() => selectBrand(brand.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2",
                      brand.id === selectedBrandId && "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded bg-muted">
                      <Image src={brand.logo.primary} alt={brand.name} fill unoptimized className="object-contain" />
                    </div>
                    <span className="flex-1 truncate">{brand.name}</span>
                    {brand.id === selectedBrandId && <CheckIcon className="h-4 w-4 shrink-0" />}
                    <button
                      onClick={(e) => handleDeleteClick(brand.id, e)}
                      className="ml-1 shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive"
                      title="Delete brand"
                    >
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href="/brand/new" className="flex items-center gap-3 px-3 py-2 text-muted-foreground">
                <PlusIcon className="h-4 w-4" />
                Add new brand
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this brand? This action cannot be undone and will remove all associated campaigns and creatives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
