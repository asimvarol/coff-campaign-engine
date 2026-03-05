'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface WSOptions {
  userId: string
  room?: string
  onMessage?: (data: WSEvent) => void
}

export interface WSEvent {
  type: string
  userId?: string
  room?: string
  payload?: unknown
  timestamp?: number
  [key: string]: unknown
}

interface UseWebSocketReturn {
  isConnected: boolean
  send: (data: WSEvent) => void
  joinRoom: (room: string) => void
  leaveRoom: (room: string) => void
  presenceUsers: { userId: string; clientId: string }[]
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3003/ws'

export function useWebSocket({ userId, room, onMessage }: WSOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [presenceUsers, setPresenceUsers] = useState<{ userId: string; clientId: string }[]>([])
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(`${WS_URL}?userId=${encodeURIComponent(userId)}`)

    ws.onopen = () => {
      setIsConnected(true)
      if (room) {
        ws.send(JSON.stringify({ type: 'join', room }))
        // Request presence list
        ws.send(JSON.stringify({ type: 'presence:ping', room }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WSEvent

        if (data.type === 'presence:list') {
          setPresenceUsers(data.users as { userId: string; clientId: string }[])
          return
        }

        if (data.type === 'user:joined' || data.type === 'user:left') {
          // Refresh presence when users join/leave
          if (room) {
            ws.send(JSON.stringify({ type: 'presence:ping', room }))
          }
        }

        onMessageRef.current?.(data)
      } catch {
        // Ignore malformed messages
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      // Reconnect after 3s
      reconnectTimer.current = setTimeout(connect, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }, [userId, room])

  useEffect(() => {
    connect()

    return () => {
      clearTimeout(reconnectTimer.current)
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect])

  const send = useCallback((data: WSEvent) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ ...data, room: data.room || room }))
    }
  }, [room])

  const joinRoom = useCallback((newRoom: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'join', room: newRoom }))
    }
  }, [])

  const leaveRoom = useCallback((roomToLeave: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'leave', room: roomToLeave }))
    }
  }, [])

  return { isConnected, send, joinRoom, leaveRoom, presenceUsers }
}
