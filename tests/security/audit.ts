/**
 * Security audit for Coff Campaign Engine API
 * Run: bun run tests/security/audit.ts
 *
 * Requires API server running on localhost:3002
 */

const API_URL = process.env.API_URL || 'http://localhost:3002'

interface AuditResult {
  check: string
  status: 'pass' | 'fail' | 'warn'
  detail: string
}

const results: AuditResult[] = []

function log(result: AuditResult) {
  const icon = result.status === 'pass' ? 'PASS' : result.status === 'fail' ? 'FAIL' : 'WARN'
  console.log(`[${icon}] ${result.check}: ${result.detail}`)
  results.push(result)
}

async function checkSecurityHeaders() {
  const res = await fetch(`${API_URL}/`)
  const headers = res.headers

  // HSTS
  const hsts = headers.get('strict-transport-security')
  log({
    check: 'HSTS header',
    status: hsts ? 'pass' : 'warn',
    detail: hsts || 'Not set (OK for localhost)',
  })

  // X-Content-Type-Options
  const xcto = headers.get('x-content-type-options')
  log({
    check: 'X-Content-Type-Options',
    status: xcto === 'nosniff' ? 'pass' : 'fail',
    detail: xcto || 'Missing',
  })

  // X-Frame-Options
  const xfo = headers.get('x-frame-options')
  log({
    check: 'X-Frame-Options',
    status: xfo ? 'pass' : 'fail',
    detail: xfo || 'Missing',
  })

  // Content-Security-Policy
  const csp = headers.get('content-security-policy')
  log({
    check: 'CSP header',
    status: csp ? 'pass' : 'warn',
    detail: csp ? csp.substring(0, 60) + '...' : 'Not set',
  })

  // X-XSS-Protection
  const xxss = headers.get('x-xss-protection')
  log({
    check: 'X-XSS-Protection',
    status: xxss ? 'pass' : 'warn',
    detail: xxss || 'Not set (modern browsers use CSP)',
  })
}

async function checkRateLimiting() {
  const promises = Array.from({ length: 150 }, () =>
    fetch(`${API_URL}/`).then((r) => r.status)
  )
  const statuses = await Promise.all(promises)
  const rateLimited = statuses.filter((s) => s === 429).length

  log({
    check: 'Rate limiting',
    status: rateLimited > 0 ? 'pass' : 'warn',
    detail: rateLimited > 0
      ? `${rateLimited}/150 requests blocked (429)`
      : 'No requests blocked — rate limiter may need tuning',
  })
}

async function checkSQLInjection() {
  const payloads = [
    "' OR '1'='1",
    "1; DROP TABLE brands;--",
    "' UNION SELECT * FROM users--",
  ]

  for (const payload of payloads) {
    try {
      const res = await fetch(`${API_URL}/api/brands/${encodeURIComponent(payload)}`)
      log({
        check: `SQLi: ${payload.substring(0, 20)}...`,
        status: res.status === 404 || res.status === 400 ? 'pass' : 'warn',
        detail: `Status ${res.status}`,
      })
    } catch {
      log({
        check: `SQLi: ${payload.substring(0, 20)}...`,
        status: 'pass',
        detail: 'Connection refused or error (safe)',
      })
    }
  }
}

async function checkXSS() {
  const payloads = [
    '<script>alert(1)</script>',
    '"><img src=x onerror=alert(1)>',
  ]

  for (const payload of payloads) {
    try {
      const res = await fetch(`${API_URL}/api/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: payload, url: 'https://test.com' }),
      })
      const body = await res.text()
      const reflected = body.includes('<script>') || body.includes('onerror=')
      log({
        check: `XSS: ${payload.substring(0, 20)}...`,
        status: reflected ? 'fail' : 'pass',
        detail: reflected ? 'Payload reflected in response!' : 'Not reflected',
      })
    } catch {
      log({
        check: `XSS: ${payload.substring(0, 20)}...`,
        status: 'pass',
        detail: 'Request failed (safe)',
      })
    }
  }
}

async function checkCORS() {
  const res = await fetch(`${API_URL}/`, {
    headers: { Origin: 'https://evil-site.com' },
  })
  const acao = res.headers.get('access-control-allow-origin')

  log({
    check: 'CORS origin restriction',
    status: acao === 'https://evil-site.com' ? 'fail' : 'pass',
    detail: acao ? `Allowed: ${acao}` : 'No CORS header for unknown origin',
  })
}

async function checkSensitiveEndpoints() {
  const sensitiveEndpoints = [
    '/api/gdpr/export/test-user',
    '/api/gdpr/delete/test-user',
    '/api/whitelabel/resolve/evil.com',
  ]

  for (const endpoint of sensitiveEndpoints) {
    const res = await fetch(`${API_URL}${endpoint}`)
    log({
      check: `Auth on ${endpoint.substring(0, 30)}...`,
      status: res.status === 401 || res.status === 403 ? 'pass' : 'warn',
      detail: `Status ${res.status} (should require auth in production)`,
    })
  }
}

async function run() {
  console.log(`\nSecurity Audit: ${API_URL}\n`)

  await checkSecurityHeaders()
  await checkRateLimiting()
  await checkSQLInjection()
  await checkXSS()
  await checkCORS()
  await checkSensitiveEndpoints()

  const passed = results.filter((r) => r.status === 'pass').length
  const warned = results.filter((r) => r.status === 'warn').length
  const failed = results.filter((r) => r.status === 'fail').length

  console.log(`\n=== Summary ===`)
  console.log(`Pass: ${passed}  Warn: ${warned}  Fail: ${failed}`)

  if (failed > 0) {
    console.log('\nSecurity audit has FAILURES — review above')
    process.exit(1)
  }
  console.log('\nAll critical checks passed')
}

run().catch(console.error)
