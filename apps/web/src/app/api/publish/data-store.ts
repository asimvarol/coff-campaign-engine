import type { Platform, PostStatus } from '@/lib/mock-data/publish'

export interface PublishPostRecord {
  id: string
  creativeId: string
  creativeThumbnail: string
  platform: Platform
  scheduledFor: string
  caption: string
  status: PostStatus
  postUrl?: string
  error?: string
  createdAt: string
}

const posts = new Map<string, PublishPostRecord>()
let nextId = 1

export function getAllPosts(): PublishPostRecord[] {
  return Array.from(posts.values()).sort(
    (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  )
}

export function getPost(id: string): PublishPostRecord | undefined {
  return posts.get(id)
}

export function createPost(data: Omit<PublishPostRecord, 'id' | 'createdAt'>): PublishPostRecord {
  const id = `pub-${nextId++}`
  const record: PublishPostRecord = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  }
  posts.set(id, record)
  return record
}

export function updatePost(id: string, data: Partial<PublishPostRecord>): PublishPostRecord | null {
  const existing = posts.get(id)
  if (!existing) return null
  const updated = { ...existing, ...data, id }
  posts.set(id, updated)
  return updated
}

export function deletePost(id: string): boolean {
  return posts.delete(id)
}
