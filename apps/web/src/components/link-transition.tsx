'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentProps, MouseEvent } from 'react'

type LinkTransitionProps = ComponentProps<typeof Link> & {
  delay?: number
}

/**
 * Link with smooth transition delay
 * Allows exit animations to complete before navigation
 */
export function LinkTransition({
  href,
  onClick,
  delay = 150,
  ...props
}: LinkTransitionProps) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If external link or has target, use default behavior
    if (
      typeof href === 'string' &&
      (href.startsWith('http') || href.startsWith('mailto:'))
    ) {
      onClick?.(e)
      return
    }

    if (props.target) {
      onClick?.(e)
      return
    }

    e.preventDefault()

    // Call original onClick if provided
    onClick?.(e)

    // Delay navigation for exit animation
    setTimeout(() => {
      router.push(href.toString())
    }, delay)
  }

  return <Link {...props} href={href} onClick={handleClick} />
}
