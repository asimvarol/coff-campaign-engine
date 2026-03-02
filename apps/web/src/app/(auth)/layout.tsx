'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

// Custom hook for counting animation
function useCountUp(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const currentCount = startValue + (end - startValue) * easeProgress
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, started])

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString()

  return { count: formattedCount, start: () => setStarted(true) }
}

// Sample images for masonry background
const MASONRY_IMAGES = [
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=600', // Campaign creative
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400', // Social media
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500', // Analytics
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=450', // Charts
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400&h=550', // Marketing
  'https://images.unsplash.com/photo-1611926653670-2c5e16fc60d2?w=400&h=400', // Brand
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=500', // Creative
  'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=450', // Design
]

function AnimatedMasonryBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden opacity-50">
      {/* Column 1 */}
      <div className="absolute left-[5%] top-0 flex flex-col gap-3 animate-[scroll-up_25s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(0, 2), ...MASONRY_IMAGES.slice(0, 2)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-lg overflow-hidden shadow-lg"
            style={{ width: '200px', height: i % 2 === 0 ? '300px' : '250px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 2 */}
      <div className="absolute left-[30%] top-0 flex flex-col gap-3 animate-[scroll-down_30s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(2, 4), ...MASONRY_IMAGES.slice(2, 4)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-lg overflow-hidden shadow-lg"
            style={{ width: '180px', height: i % 2 === 0 ? '280px' : '220px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 3 */}
      <div className="absolute left-[55%] top-0 flex flex-col gap-3 animate-[scroll-up_35s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(4, 6), ...MASONRY_IMAGES.slice(4, 6)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-lg overflow-hidden shadow-lg"
            style={{ width: '190px', height: i % 2 === 0 ? '260px' : '290px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 4 */}
      <div className="absolute left-[80%] top-0 flex flex-col gap-3 animate-[scroll-down_28s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(6, 8), ...MASONRY_IMAGES.slice(6, 8)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-lg overflow-hidden shadow-lg"
            style={{ width: '200px', height: i % 2 === 0 ? '240px' : '270px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { count, start } = useCountUp(value, 2000, suffix === '%' ? 1 : 0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          start()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible, start])

  return (
    <div ref={ref} className="space-y-1">
      <div className="text-3xl font-bold text-primary">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form with animated background */}
      <div className="relative flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Animated Masonry Background */}
        <AnimatedMasonryBackground />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/85" />

        {/* Form Card */}
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background p-12">
        <div className="max-w-lg text-center space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold">Coff Campaign Engine</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered campaign management and optimization platform. Create stunning campaigns in minutes, not days.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Campaigns</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">200K+</div>
              <div className="text-sm text-muted-foreground">Creatives</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
