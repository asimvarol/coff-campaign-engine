import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className,
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  const fallbackText = fallback || alt.charAt(0).toUpperCase()

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary',
          sizes[size],
          className
        )}
      >
        {fallbackText}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-full', sizes[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  )
}

interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string; fallback?: string }>
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          {...avatar}
          size={size}
          className="ring-2 ring-background"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted font-medium ring-2 ring-background',
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-12 w-12 text-base'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
