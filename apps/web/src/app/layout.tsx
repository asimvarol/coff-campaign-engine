import type { Metadata } from 'next'
import '@fontsource/google-sans-flex/400.css'
import '@fontsource/google-sans-flex/500.css'
import '@fontsource/google-sans-flex/600.css'
import '@fontsource/google-sans-flex/700.css'
import './globals.css'
import { AuthProvider } from '@/lib/auth-provider'

export const metadata: Metadata = {
  title: 'Coff Campaign Engine',
  description: 'AI-powered campaign management and optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
