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
          <div className="mx-auto max-w-[1400px] p-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </BrandProvider>
  )
}
