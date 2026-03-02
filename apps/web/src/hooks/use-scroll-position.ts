'use client'

import { useState, useEffect } from 'react'

interface ScrollPosition {
  x: number
  y: number
}

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      })
    }

    window.addEventListener('scroll', updatePosition, { passive: true })
    updatePosition()

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

export function useIsScrolled(threshold = 10): boolean {
  const { y } = useScrollPosition()
  return y > threshold
}
