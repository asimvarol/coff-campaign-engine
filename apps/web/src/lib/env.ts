/**
 * Environment variables validation
 * Ensures required env vars are present at build/runtime
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]
  
  if (!value && !defaultValue) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`)
    }
    console.warn(`Missing environment variable: ${key}`)
    return ''
  }
  
  return value || defaultValue || ''
}

export const env = {
  // App
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',

  // URLs
  webUrl: getEnvVar('NEXT_PUBLIC_WEB_URL', 'http://localhost:3001'),
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3002'),

  // Database (optional in dev)
  databaseUrl: getEnvVar('DATABASE_URL', ''),
  redisUrl: getEnvVar('REDIS_URL', ''),

  // Auth
  nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:3001'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
  
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID', ''),
  googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', ''),

  // Feature flags
  enableAutopilot: getEnvVar('ENABLE_AUTOPILOT', 'true') === 'true',
  enableAgencyMode: getEnvVar('ENABLE_AGENCY_MODE', 'true') === 'true',
} as const

// Validate required env vars in production
if (env.isProd) {
  const required = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`)
  }
}
