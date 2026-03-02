import { MobileSidebar } from '@/components/mobile-sidebar'
import { BrandProvider } from '@/lib/brand-context'

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
          {children}
        </main>
      </div>
    </BrandProvider>
  )
}
