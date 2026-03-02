'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Router with transition delay
 * Use for programmatic navigation with smooth transitions
 */
export function useRouterTransition(delay = 150) {
  const router = useRouter()

  const push = useCallback(
    (href: string) => {
      setTimeout(() => {
        router.push(href)
      }, delay)
    },
    [router, delay]
  )

  const replace = useCallback(
    (href: string) => {
      setTimeout(() => {
        router.replace(href)
      }, delay)
    },
    [router, delay]
  )

  return {
    push,
    replace,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    prefetch: router.prefetch,
  }
}
