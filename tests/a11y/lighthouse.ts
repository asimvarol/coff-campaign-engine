/**
 * Lighthouse accessibility & performance audit
 * Run: bun run tests/a11y/lighthouse.ts
 *
 * Requires:
 * - Web server running on localhost:3001
 * - Chrome installed
 * - lighthouse: bunx lighthouse
 */

const WEB_URL = process.env.WEB_URL || 'http://localhost:3001'

const PAGES = [
  '/',
  '/brands',
  '/campaigns',
  '/analytics',
  '/publish',
  '/photoshoot',
  '/settings',
]

const THRESHOLDS = {
  performance: 70,
  accessibility: 90,
  'best-practices': 80,
  seo: 85,
}

interface LighthouseScore {
  page: string
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
}

async function runLighthouse(page: string): Promise<LighthouseScore | null> {
  const url = `${WEB_URL}${page}`
  const outPath = `/tmp/lighthouse-${page.replace(/\//g, '_') || 'home'}.json`

  try {
    const proc = Bun.spawn([
      'bunx', 'lighthouse', url,
      '--output=json',
      `--output-path=${outPath}`,
      '--chrome-flags=--headless --no-sandbox',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--quiet',
    ], { stdout: 'pipe', stderr: 'pipe' })

    await proc.exited

    const file = Bun.file(outPath)
    if (!(await file.exists())) return null

    const report = await file.json()
    const cats = report.categories

    return {
      page,
      performance: Math.round((cats.performance?.score || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
      seo: Math.round((cats.seo?.score || 0) * 100),
    }
  } catch (error) {
    console.error(`Failed to audit ${page}:`, error)
    return null
  }
}

async function run() {
  console.log(`\nLighthouse Audit: ${WEB_URL}`)
  console.log(`Pages: ${PAGES.length}\n`)

  const scores: LighthouseScore[] = []
  let failures = 0

  for (const page of PAGES) {
    process.stdout.write(`Auditing ${page}... `)
    const score = await runLighthouse(page)

    if (!score) {
      console.log('SKIP (lighthouse not available or page error)')
      continue
    }

    scores.push(score)

    const perf = score.performance >= THRESHOLDS.performance ? 'ok' : 'LOW'
    const a11y = score.accessibility >= THRESHOLDS.accessibility ? 'ok' : 'LOW'
    const bp = score.bestPractices >= THRESHOLDS['best-practices'] ? 'ok' : 'LOW'
    const seo = score.seo >= THRESHOLDS.seo ? 'ok' : 'LOW'

    console.log(`perf=${score.performance}(${perf}) a11y=${score.accessibility}(${a11y}) bp=${score.bestPractices}(${bp}) seo=${score.seo}(${seo})`)

    if (score.accessibility < THRESHOLDS.accessibility) failures++
    if (score.performance < THRESHOLDS.performance) failures++
  }

  if (scores.length === 0) {
    console.log('\nNo pages audited. Make sure web server is running and lighthouse is available.')
    console.log('Install: bun add -g lighthouse')
    return
  }

  // Summary
  const avgPerf = Math.round(scores.reduce((s, r) => s + r.performance, 0) / scores.length)
  const avgA11y = Math.round(scores.reduce((s, r) => s + r.accessibility, 0) / scores.length)
  const avgBP = Math.round(scores.reduce((s, r) => s + r.bestPractices, 0) / scores.length)
  const avgSEO = Math.round(scores.reduce((s, r) => s + r.seo, 0) / scores.length)

  console.log('\n=== Averages ===')
  console.log(`Performance:    ${avgPerf} (threshold: ${THRESHOLDS.performance})`)
  console.log(`Accessibility:  ${avgA11y} (threshold: ${THRESHOLDS.accessibility})`)
  console.log(`Best Practices: ${avgBP} (threshold: ${THRESHOLDS['best-practices']})`)
  console.log(`SEO:            ${avgSEO} (threshold: ${THRESHOLDS.seo})`)

  if (failures > 0) {
    console.log(`\n${failures} page(s) below threshold`)
  } else {
    console.log('\nAll pages meet thresholds')
  }
}

run().catch(console.error)
