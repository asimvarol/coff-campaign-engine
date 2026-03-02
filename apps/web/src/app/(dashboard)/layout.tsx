import { MobileSidebar } from '@/components/mobile-sidebar'
import { BrandProvider } from '@/lib/brand-context'
import { PageTransition } from '@/components/page-transition'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BrandProvider>
      <div className="flex min-h-screen">
        <MobileSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </BrandProvider>
  )
}
