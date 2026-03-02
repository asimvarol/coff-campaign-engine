import { BrandProvider } from '@/lib/brand-context'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@repo/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BrandProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BrandProvider>
  )
}
