import { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AuthProvider } from '@/lib/auth-provider'
import { Toaster } from 'sonner'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://coff.app'),
  title: {
    default: 'Coff - AI-Powered Marketing Campaign Engine',
    template: '%s | Coff',
  },
  description: 'AI-powered marketing campaign management platform. Create, manage, and optimize campaigns across all social platforms.',
  keywords: ['marketing', 'campaigns', 'AI', 'social media', 'automation', 'analytics'],
  authors: [{ name: 'Coff' }],
  creator: 'Coff',
  publisher: 'Coff',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://coff.app',
    title: 'Coff - AI-Powered Marketing Campaign Engine',
    description: 'AI-powered marketing campaign management platform',
    siteName: 'Coff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coff - AI-Powered Marketing Campaign Engine',
    description: 'AI-powered marketing campaign management platform',
    creator: '@coffapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
