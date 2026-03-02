'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useBrand } from '@/lib/brand-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebarStore,
} from '@repo/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui'
import {
  Sparkles01Icon,
  Target03Icon,
  Camera01Icon,
  Calendar03Icon,
  Analytics01Icon,
  Lightning01Icon,
  Building03Icon,
  ChevronDownIcon,
  PlusIcon,
  CheckIcon,
  Settings02Icon,
} from '@/lib/icons'

const navigation = [
  { name: 'Campaigns', href: '/campaigns', icon: Target03Icon },
  { name: 'Brand DNA', href: '/brand', icon: Sparkles01Icon },
  { name: 'Photoshoot', href: '/photoshoot', icon: Camera01Icon },
  { name: 'Publish', href: '/publish', icon: Calendar03Icon },
  { name: 'Analytics', href: '/analytics', icon: Analytics01Icon },
  { name: 'Autopilot', href: '/autopilot', icon: Lightning01Icon },
  { name: 'Agency', href: '/agency', icon: Building03Icon },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { brands, selectedBrand, selectBrand } = useBrand()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles01Icon className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">Coff Campaign</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Brand Selector */}
        <SidebarGroup>
          <SidebarGroupLabel>Brand</SidebarGroupLabel>
          <SidebarGroupContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent">
                  {selectedBrand ? (
                    <>
                      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded bg-muted">
                        <Image 
                          src={selectedBrand.logo.primary} 
                          alt={selectedBrand.name} 
                          fill 
                          unoptimized 
                          className="object-contain" 
                        />
                      </div>
                      <span className="flex-1 truncate text-left text-sm">{selectedBrand.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted">
                        <Sparkles01Icon className="h-3 w-3" />
                      </div>
                      <span className="flex-1 text-left text-sm text-muted-foreground">Select brand</span>
                    </>
                  )}
                  <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px]">
                {brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand.id}
                    onClick={() => selectBrand(brand.id)}
                    className="flex items-center gap-2"
                  >
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded bg-muted">
                      <Image src={brand.logo.primary} alt={brand.name} fill unoptimized className="object-contain" />
                    </div>
                    <span className="flex-1">{brand.name}</span>
                    {selectedBrand?.id === brand.id && <CheckIcon className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
                {brands.length > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem asChild>
                  <Link href="/brand/new" className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Brand DNA
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings02Icon className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
