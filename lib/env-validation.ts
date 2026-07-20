/**
 * Environment Variable Validation
 * Validates required environment variables at startup.
 * The app uses MongoDB Atlas as the only database.
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
] as const

const optionalEnvVars = [
  'CLOUDINARY_URL',
  'API_URL',
] as const

export function validateEnvironment() {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  // Check optional but important variables
  for (const key of optionalEnvVars) {
    if (!process.env[key]) {
      warnings.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please set these in your Vercel Dashboard → Settings → Environment Variables`
    )
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(
      `⚠️  Warning: Some optional services may not work:\n${warnings.join('\n')}`
    )
  }

  return true
}

// Run validation at module load time (except in tests)
if (process.env.NODE_ENV !== 'test') {
  validateEnvironment()
}
