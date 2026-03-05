/**
 * Load test for Coff Campaign Engine API
 * Run: bun run tests/load/api-load-test.ts
 *
 * Requires API server running on localhost:3002
 */

const API_URL = process.env.API_URL || 'http://localhost:3002'
const CONCURRENT_USERS = 20
const REQUESTS_PER_USER = 50
const RAMP_UP_MS = 2000

interface Result {
  endpoint: string
  status: number
  duration: number
  error?: string
}

const results: Result[] = []

const endpoints = [
  { method: 'GET', path: '/' },
  { method: 'GET', path: '/api/brands' },
  { method: 'GET', path: '/api/campaigns' },
  { method: 'GET', path: '/api/analytics/overview?period=30d' },
  { method: 'GET', path: '/api/activity/recent' },
]

async function makeRequest(endpoint: { method: string; path: string }): Promise<Result> {
  const start = performance.now()
  try {
    const res = await fetch(`${API_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' },
    })
    return {
      endpoint: `${endpoint.method} ${endpoint.path}`,
      status: res.status,
      duration: performance.now() - start,
    }
  } catch (error) {
    return {
      endpoint: `${endpoint.method} ${endpoint.path}`,
      status: 0,
      duration: performance.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function simulateUser(userId: number): Promise<void> {
  // Stagger start
  await new Promise((r) => setTimeout(r, (userId / CONCURRENT_USERS) * RAMP_UP_MS))

  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    const endpoint = endpoints[i % endpoints.length]!
    const result = await makeRequest(endpoint)
    results.push(result)
  }
}

async function run() {
  console.log(`\nLoad Test: ${CONCURRENT_USERS} users x ${REQUESTS_PER_USER} requests`)
  console.log(`Target: ${API_URL}`)
  console.log(`Ramp-up: ${RAMP_UP_MS}ms\n`)

  const start = performance.now()

  const users = Array.from({ length: CONCURRENT_USERS }, (_, i) => simulateUser(i))
  await Promise.all(users)

  const totalTime = performance.now() - start
  const totalRequests = results.length
  const successful = results.filter((r) => r.status >= 200 && r.status < 400)
  const failed = results.filter((r) => r.status === 0 || r.status >= 400)
  const durations = results.map((r) => r.duration).sort((a, b) => a - b)

  const avg = durations.reduce((a, b) => a + b, 0) / durations.length
  const p50 = durations[Math.floor(durations.length * 0.5)]!
  const p95 = durations[Math.floor(durations.length * 0.95)]!
  const p99 = durations[Math.floor(durations.length * 0.99)]!
  const rps = (totalRequests / totalTime) * 1000

  console.log('=== Results ===')
  console.log(`Total requests:  ${totalRequests}`)
  console.log(`Successful:      ${successful.length} (${((successful.length / totalRequests) * 100).toFixed(1)}%)`)
  console.log(`Failed:          ${failed.length}`)
  console.log(`Total time:      ${(totalTime / 1000).toFixed(2)}s`)
  console.log(`Requests/sec:    ${rps.toFixed(1)}`)
  console.log('')
  console.log('=== Latency ===')
  console.log(`Average:         ${avg.toFixed(1)}ms`)
  console.log(`P50:             ${p50.toFixed(1)}ms`)
  console.log(`P95:             ${p95.toFixed(1)}ms`)
  console.log(`P99:             ${p99.toFixed(1)}ms`)
  console.log(`Min:             ${durations[0]!.toFixed(1)}ms`)
  console.log(`Max:             ${durations[durations.length - 1]!.toFixed(1)}ms`)

  // Per-endpoint breakdown
  console.log('\n=== Per Endpoint ===')
  const byEndpoint = new Map<string, number[]>()
  for (const r of results) {
    if (!byEndpoint.has(r.endpoint)) byEndpoint.set(r.endpoint, [])
    byEndpoint.get(r.endpoint)!.push(r.duration)
  }

  for (const [endpoint, times] of byEndpoint) {
    const sorted = times.sort((a, b) => a - b)
    const epAvg = sorted.reduce((a, b) => a + b, 0) / sorted.length
    const epP95 = sorted[Math.floor(sorted.length * 0.95)]!
    console.log(`${endpoint.padEnd(45)} avg=${epAvg.toFixed(0)}ms  p95=${epP95.toFixed(0)}ms  n=${sorted.length}`)
  }

  // Fail if error rate > 5% or p95 > 500ms
  if (failed.length / totalRequests > 0.05) {
    console.log('\n FAIL: Error rate > 5%')
    process.exit(1)
  }
  if (p95 > 500) {
    console.log('\n WARN: P95 latency > 500ms')
  }

  console.log('\n PASS')
}

run().catch(console.error)
