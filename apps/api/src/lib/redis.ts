import Redis from 'ioredis'

let redis: Redis | null = null

function getClient(): Redis | null {
  if (redis) return redis
  const url = process.env.REDIS_URL
  if (!url) return null

  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 200, 2000),
      lazyConnect: true,
    })
    redis.on('error', (err) => console.error('Redis error:', err))
    return redis
  } catch {
    return null
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getClient()
  if (!client) return null

  try {
    const value = await client.get(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const client = getClient()
  if (!client) return

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value))
  } catch {
    // Silently fail — cache is optional
  }
}

export async function cacheDel(key: string): Promise<void> {
  const client = getClient()
  if (!client) return

  try {
    await client.del(key)
  } catch {
    // Silently fail
  }
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  const client = getClient()
  if (!client) return

  try {
    const keys = await client.keys(pattern)
    if (keys.length > 0) await client.del(...keys)
  } catch {
    // Silently fail
  }
}

export function buildCacheKey(...parts: string[]): string {
  return `coff:${parts.join(':')}`
}
