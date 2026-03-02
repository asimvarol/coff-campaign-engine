import type { Metadata } from 'next'

export function createMetadata(page: {
  title: string
  description?: string
  path?: string
}): Metadata {
  const title = `${page.title} | Coff Campaign Engine`
  const description = page.description || 'AI-powered marketing campaign management platform'
  const url = `https://coff.app${page.path || ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Coff Campaign Engine',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
