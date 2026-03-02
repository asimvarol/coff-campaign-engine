#!/usr/bin/env bun

/**
 * Environment variables checker
 * Run before deployment to ensure all required vars are set
 */

const required = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
]

const optional = [
  'REDIS_URL',
  'OPENAI_API_KEY',
  'FAL_AI_KEY',
  'SENTRY_DSN',
]

console.log('🔍 Checking environment variables...\n')

let hasErrors = false

// Check required
console.log('Required variables:')
for (const key of required) {
  const value = process.env[key]
  if (!value) {
    console.log(`  ❌ ${key} - MISSING`)
    hasErrors = true
  } else if (value.includes('YOUR_') || value.includes('your-')) {
    console.log(`  ⚠️  ${key} - PLACEHOLDER (needs real value)`)
    hasErrors = true
  } else {
    console.log(`  ✅ ${key} - OK`)
  }
}

// Check optional
console.log('\nOptional variables:')
for (const key of optional) {
  const value = process.env[key]
  if (!value) {
    console.log(`  ⏭️  ${key} - Not set (optional)`)
  } else {
    console.log(`  ✅ ${key} - Set`)
  }
}

console.log()

if (hasErrors) {
  console.error('❌ Environment check failed!')
  console.error('Please set all required variables in .env.local')
  process.exit(1)
}

console.log('✅ All required environment variables are set!')
process.exit(0)
