/**
 * Mock delay configuration for development
 * In production (USE_API=true), these delays are skipped
 */
export const MOCK_DELAYS = {
  /** Short delay for simple operations (200ms) */
  SHORT: 200,
  /** Medium delay for moderate operations (500ms) */
  MEDIUM: 500,
  /** Long delay for complex operations (1000ms) */
  LONG: 1000,
  /** Extra long delay for background jobs (2000ms) */
  EXTRA_LONG: 2000,
} as const

/**
 * Helper to add mock delay in development only
 * @param ms Delay duration in milliseconds
 */
export async function mockDelay(ms: number): Promise<void> {
  const isProduction = process.env.USE_API === 'true'
  if (!isProduction) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
