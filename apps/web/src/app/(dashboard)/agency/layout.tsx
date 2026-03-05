import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Agency Overview' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
