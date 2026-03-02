import { MobileSidebar } from '@/components/mobile-sidebar'
import { BrandProvider } from '@/lib/brand-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BrandProvider>
      <div className="flex h-screen overflow-hidden">
        <MobileSidebar />
        <main className="flex-1 overflow-y-auto bg-background pt-14 md:pt-0">
          <div className="mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </BrandProvider>
  )
}
