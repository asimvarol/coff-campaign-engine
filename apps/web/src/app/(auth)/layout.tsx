'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
    <div className="fixed inset-0 overflow-hidden opacity-20">
      {/* Column 1 */}
      <div className="absolute left-[5%] top-0 flex flex-col gap-4 animate-[scroll-up_25s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(0, 2), ...MASONRY_IMAGES.slice(0, 2)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden"
            style={{ width: '200px', height: i % 2 === 0 ? '300px' : '250px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 2 */}
      <div className="absolute left-[25%] top-0 flex flex-col gap-4 animate-[scroll-down_30s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(2, 4), ...MASONRY_IMAGES.slice(2, 4)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden"
            style={{ width: '180px', height: i % 2 === 0 ? '280px' : '220px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 3 */}
      <div className="absolute left-[45%] top-0 flex flex-col gap-4 animate-[scroll-up_35s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(4, 6), ...MASONRY_IMAGES.slice(4, 6)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden"
            style={{ width: '190px', height: i % 2 === 0 ? '260px' : '290px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 4 */}
      <div className="absolute left-[65%] top-0 flex flex-col gap-4 animate-[scroll-down_28s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(6, 8), ...MASONRY_IMAGES.slice(6, 8)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden"
            style={{ width: '200px', height: i % 2 === 0 ? '240px' : '270px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Column 5 */}
      <div className="absolute left-[85%] top-0 flex flex-col gap-4 animate-[scroll-up_32s_linear_infinite]">
        {[...MASONRY_IMAGES.slice(0, 2), ...MASONRY_IMAGES.slice(0, 2)].map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden"
            style={{ width: '180px', height: i % 2 === 0 ? '300px' : '250px' }}
          >
            <Image src={src} alt="" fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Masonry Background */}
      <AnimatedMasonryBackground />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Form with glassmorphism */}
          <div className="order-2 lg:order-1">
            {children}
          </div>

          {/* Right side - Branding */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-6">
            {/* Logo */}
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-xl border border-primary/20 mb-4">
              <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Coff Campaign Engine
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                AI-powered campaign management and optimization platform. Create stunning campaigns in minutes, not days.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="space-y-1 p-4 rounded-xl bg-card/30 backdrop-blur-xl border border-border/50">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-xs text-muted-foreground">Campaigns</div>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-card/30 backdrop-blur-xl border border-border/50">
                <div className="text-3xl font-bold text-primary">200K+</div>
                <div className="text-xs text-muted-foreground">Creatives</div>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-card/30 backdrop-blur-xl border border-border/50">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/20 backdrop-blur-xl border border-border/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">AI-powered creative generation</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/20 backdrop-blur-xl border border-border/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">Multi-platform publishing</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/20 backdrop-blur-xl border border-border/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">Automatic optimization</span>
              </div>
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
