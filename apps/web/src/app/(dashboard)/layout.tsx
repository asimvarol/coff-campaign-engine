import { MobileSidebar } from '@/components/mobile-sidebar'
import { BrandProvider } from '@/lib/brand-context'
import { PageTransition } from '@/components/page-transition'
import { CommandPalette } from '@/components/command-palette'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BrandProvider>
      <CommandPalette />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <MobileSidebar />
        <main id="main-content" className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-[1200px] p-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </BrandProvider>
  )
}
