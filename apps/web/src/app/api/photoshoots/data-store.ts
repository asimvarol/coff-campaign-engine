export interface PhotoshootRecord {
  id: string
  name: string
  status: 'GENERATING' | 'COMPLETED'
  brandId?: string
  brandName?: string
  templates: string[]
  productImage: string
  images: Array<{ id: string; url: string; template: string }>
  createdAt: string
  updatedAt: string
}

const store = new Map<string, PhotoshootRecord>()

export function getAllPhotoshoots(): PhotoshootRecord[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getPhotoshoot(id: string): PhotoshootRecord | undefined {
  return store.get(id)
}

export function createPhotoshoot(data: Omit<PhotoshootRecord, 'id' | 'createdAt' | 'updatedAt'>): PhotoshootRecord {
  const id = `ps-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const now = new Date().toISOString()
  const record: PhotoshootRecord = { ...data, id, createdAt: now, updatedAt: now }
  store.set(id, record)
  return record
}

export function updatePhotoshoot(id: string, data: Partial<PhotoshootRecord>): PhotoshootRecord | undefined {
  const existing = store.get(id)
  if (!existing) return undefined
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() }
  store.set(id, updated)
  return updated
}
