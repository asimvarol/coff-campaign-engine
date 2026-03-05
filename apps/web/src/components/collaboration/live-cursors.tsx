'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { WSEvent } from '@/hooks/use-websocket'

interface CursorPosition {
  userId: string
  x: number
  y: number
  lastSeen: number
}

interface LiveCursorsProps {
  send: (data: WSEvent) => void
  room: string
  currentUserId: string
  onCursorEvent?: (data: WSEvent) => void
  children: React.ReactNode
}

const COLORS: Record<string, string> = {}
const PALETTE = [
  '#ec4899', '#3b82f6', '#22c55e', '#eab308',
  '#a855f7', '#f97316', '#14b8a6', '#ef4444',
]

function getCursorColor(userId: string): string {
  if (!COLORS[userId]) {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0
    }
    COLORS[userId] = PALETTE[Math.abs(hash) % PALETTE.length]!
  }
  return COLORS[userId]!
}

export function LiveCursors({ send, room, currentUserId, children }: LiveCursorsProps) {
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const throttleRef = useRef<number>(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    if (now - throttleRef.current < 50) return // 20fps throttle
    throttleRef.current = now

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    send({
      type: 'cursor:move',
      room,
      payload: {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      },
    })
  }, [send, room])

  // Listen for incoming cursor events via parent
  const handleCursorEvent = useCallback((data: WSEvent) => {
    if (data.type !== 'cursor:move' || !data.userId) return
    const payload = data.payload as { x: number; y: number }

    setCursors((prev) => {
      const next = new Map(prev)
      next.set(data.userId!, {
        userId: data.userId!,
        x: payload.x,
        y: payload.y,
        lastSeen: Date.now(),
      })
      return next
    })
  }, [])

  // Expose handler via ref pattern
  const handleCursorEventRef = useRef(handleCursorEvent)
  handleCursorEventRef.current = handleCursorEvent

  // Clean stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setCursors((prev) => {
        const next = new Map(prev)
        for (const [key, cursor] of next) {
          if (now - cursor.lastSeen > 5000) next.delete(key)
        }
        return next.size !== prev.size ? next : prev
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="relative" onMouseMove={handleMouseMove}>
      {children}
      {Array.from(cursors.values())
        .filter((c) => c.userId !== currentUserId)
        .map((cursor) => (
          <div
            key={cursor.userId}
            className="pointer-events-none absolute z-50 transition-all duration-100"
            style={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
            }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M0 0L16 12L8 14L4 20L0 0Z"
                fill={getCursorColor(cursor.userId)}
              />
            </svg>
            <span
              className="absolute left-4 top-4 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: getCursorColor(cursor.userId) }}
            >
              {cursor.userId.slice(0, 8)}
            </span>
          </div>
        ))}
    </div>
  )
}

export { type CursorPosition }
