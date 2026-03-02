'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function NavLink({ href, children, icon, className }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link href={href}>
      <motion.div
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          className
        )}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {isActive && (
          <motion.div
            className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary"
            layoutId="activeNav"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        {icon && <span className="h-5 w-5">{icon}</span>}
        <span>{children}</span>
      </motion.div>
    </Link>
  )
}
