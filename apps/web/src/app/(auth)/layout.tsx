import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background p-12">
        <div className="max-w-lg text-center space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold">Coff Campaign Engine</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered campaign management and optimization platform. Create stunning campaigns in minutes, not days.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Campaigns</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">200K+</div>
              <div className="text-sm text-muted-foreground">Creatives</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
