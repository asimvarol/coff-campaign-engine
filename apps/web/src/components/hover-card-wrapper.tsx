'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HoverCardWrapperProps {
  children: ReactNode
  className?: string
  scale?: number
  lift?: boolean
}

/**
 * Smooth hover effect for cards
 * Scales and lifts on hover
 */
export function HoverCardWrapper({
  children,
  className,
  scale = 1.02,
  lift = true,
}: HoverCardWrapperProps) {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      whileHover={{
        scale,
        y: lift ? -4 : 0,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Glow effect on hover
 */
export function HoverGlow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
