type WSClient = {
  id: string
  userId: string
  ws: WebSocket
  rooms: Set<string>
}

const clients = new Map<string, WSClient>()
const rooms = new Map<string, Set<string>>()

let clientCounter = 0

export function addClient(ws: WebSocket, userId: string): string {
  const id = `ws_${++clientCounter}_${Date.now()}`
  clients.set(id, { id, userId, ws, rooms: new Set() })
  return id
}

export function removeClient(clientId: string): void {
  const client = clients.get(clientId)
  if (!client) return

  for (const room of client.rooms) {
    leaveRoom(clientId, room)
  }
  clients.delete(clientId)
}

export function joinRoom(clientId: string, room: string): void {
  const client = clients.get(clientId)
  if (!client) return

  client.rooms.add(room)
  if (!rooms.has(room)) rooms.set(room, new Set())
  rooms.get(room)!.add(clientId)

  broadcastToRoom(room, {
    type: 'user:joined',
    room,
    userId: client.userId,
    timestamp: Date.now(),
  }, clientId)
}

export function leaveRoom(clientId: string, room: string): void {
  const client = clients.get(clientId)
  if (!client) return

  client.rooms.delete(room)
  const roomClients = rooms.get(room)
  if (roomClients) {
    roomClients.delete(clientId)
    if (roomClients.size === 0) {
      rooms.delete(room)
    } else {
      broadcastToRoom(room, {
        type: 'user:left',
        room,
        userId: client.userId,
        timestamp: Date.now(),
      })
    }
  }
}

export function broadcastToRoom(room: string, data: unknown, excludeClientId?: string): void {
  const roomClients = rooms.get(room)
  if (!roomClients) return

  const message = JSON.stringify(data)
  for (const clientId of roomClients) {
    if (clientId === excludeClientId) continue
    const client = clients.get(clientId)
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message)
    }
  }
}

export function getRoomUsers(room: string): { userId: string; clientId: string }[] {
  const roomClients = rooms.get(room)
  if (!roomClients) return []

  const users: { userId: string; clientId: string }[] = []
  for (const clientId of roomClients) {
    const client = clients.get(clientId)
    if (client) {
      users.push({ userId: client.userId, clientId: client.id })
    }
  }
  return users
}

export function getClientById(clientId: string): WSClient | undefined {
  return clients.get(clientId)
}

export interface WSMessage {
  type: string
  room?: string
  payload?: unknown
  [key: string]: unknown
}

export function handleMessage(clientId: string, raw: string): void {
  let msg: WSMessage
  try {
    msg = JSON.parse(raw)
  } catch {
    return
  }

  const client = clients.get(clientId)
  if (!client) return

  switch (msg.type) {
    case 'join':
      if (typeof msg.room === 'string') joinRoom(clientId, msg.room)
      break

    case 'leave':
      if (typeof msg.room === 'string') leaveRoom(clientId, msg.room)
      break

    case 'cursor:move':
      if (msg.room) {
        broadcastToRoom(msg.room, {
          type: 'cursor:move',
          userId: client.userId,
          payload: msg.payload,
          timestamp: Date.now(),
        }, clientId)
      }
      break

    case 'creative:update':
      if (msg.room) {
        broadcastToRoom(msg.room, {
          type: 'creative:update',
          userId: client.userId,
          payload: msg.payload,
          timestamp: Date.now(),
        }, clientId)
      }
      break

    case 'comment:new':
      if (msg.room) {
        broadcastToRoom(msg.room, {
          type: 'comment:new',
          userId: client.userId,
          payload: msg.payload,
          timestamp: Date.now(),
        })
      }
      break

    case 'approval:update':
      if (msg.room) {
        broadcastToRoom(msg.room, {
          type: 'approval:update',
          userId: client.userId,
          payload: msg.payload,
          timestamp: Date.now(),
        })
      }
      break

    case 'presence:ping':
      if (msg.room) {
        const users = getRoomUsers(msg.room)
        client.ws.send(JSON.stringify({
          type: 'presence:list',
          room: msg.room,
          users,
          timestamp: Date.now(),
        }))
      }
      break

    default:
      // Forward unknown types to room as-is
      if (msg.room && client.rooms.has(msg.room)) {
        broadcastToRoom(msg.room, {
          ...msg,
          userId: client.userId,
          timestamp: Date.now(),
        }, clientId)
      }
  }
}
