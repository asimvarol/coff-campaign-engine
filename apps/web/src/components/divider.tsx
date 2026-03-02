import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children?: ReactNode
}

export function Divider({
  orientation = 'horizontal',
  className,
  children,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('h-full w-px bg-border', className)}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (children) {
    return (
      <div
        className={cn('flex items-center gap-4', className)}
        role="separator"
        aria-orientation="horizontal"
      >
        <div className="flex-1 border-t border-border" />
        <span className="text-sm text-muted-foreground">{children}</span>
        <div className="flex-1 border-t border-border" />
      </div>
    )
  }

  return (
    <div
      className={cn('w-full border-t border-border', className)}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}
