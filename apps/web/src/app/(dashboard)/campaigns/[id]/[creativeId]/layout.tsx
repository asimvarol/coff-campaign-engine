import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Creative Editor' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
