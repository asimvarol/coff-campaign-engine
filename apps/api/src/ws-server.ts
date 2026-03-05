import { addClient, removeClient, handleMessage } from './lib/ws'

const WS_PORT = Number(process.env.WS_PORT || 3003)

interface WSData {
  userId: string
  clientId: string
}

Bun.serve<WSData>({
  port: WS_PORT,
  fetch(req, server) {
    const url = new URL(req.url)

    if (url.pathname === '/ws') {
      const userId = url.searchParams.get('userId') || 'anonymous'
      const success = server.upgrade(req, { data: { userId, clientId: '' } })
      if (!success) return new Response('WebSocket upgrade failed', { status: 400 })
      return undefined as unknown as Response
    }

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'healthy', type: 'websocket' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not Found', { status: 404 })
  },
  websocket: {
    open(ws) {
      const clientId = addClient(ws as unknown as WebSocket, ws.data.userId)
      ws.data.clientId = clientId

      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        userId: ws.data.userId,
        timestamp: Date.now(),
      }))
    },
    message(ws, message) {
      handleMessage(ws.data.clientId, typeof message === 'string' ? message : String(message))
    },
    close(ws) {
      if (ws.data.clientId) removeClient(ws.data.clientId)
    },
  },
})

console.log(`Coff WebSocket server running on ws://localhost:${WS_PORT}/ws`)
