/**
 * Supabase Authentication Library
 * Simple authentication using Supabase
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type SupabaseConfig = {
  url: string
  anonKey: string
}

const missingConfigMessage =
  'Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart Next.js.'

const placeholderConfigMessage =
  'Supabase is still using placeholder values. Replace NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with real project credentials in .env.local and restart Next.js.'

const invalidUrlMessage =
  'NEXT_PUBLIC_SUPABASE_URL is invalid. Expected an absolute URL like https://<project-ref>.supabase.co'

function getSupabaseConfig(): SupabaseConfig {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim()

  if (!url || !anonKey) {
    throw new Error(missingConfigMessage)
  }

  if (
    url.includes('your-project.supabase.co') ||
    url.includes('your_supabase_url') ||
    anonKey.includes('your_supabase_anon_key')
  ) {
    throw new Error(placeholderConfigMessage)
  }

  try {
    const parsed = new URL(url)
    if (!parsed.protocol.startsWith('http')) {
      throw new Error('invalid protocol')
    }
  } catch {
    throw new Error(invalidUrlMessage)
  }

  return { url, anonKey }
}

export function isAuthConfigurationError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  return [missingConfigMessage, placeholderConfigMessage, invalidUrlMessage].includes(error.message)
}

let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseConfig = getSupabaseConfig()
  supabaseInstance = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  return supabaseInstance
}

// Client for browser usage
export const supabase = {
  auth: {
    signUp: (...args: Parameters<SupabaseClient['auth']['signUp']>) => getSupabaseClient().auth.signUp(...args),
    signInWithPassword: (...args: Parameters<SupabaseClient['auth']['signInWithPassword']>) => getSupabaseClient().auth.signInWithPassword(...args),
    signOut: (...args: Parameters<SupabaseClient['auth']['signOut']>) => getSupabaseClient().auth.signOut(...args),
    getSession: (...args: Parameters<SupabaseClient['auth']['getSession']>) => getSupabaseClient().auth.getSession(...args),
    getUser: (...args: Parameters<SupabaseClient['auth']['getUser']>) => getSupabaseClient().auth.getUser(...args),
  },
}

/**
 * Sign up a new user with Supabase
 */
export async function signUp(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Signup error:', error)
    throw new Error(err.message || 'Registration failed')
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session,
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresIn: data.session?.expires_in || 3600,
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Sign in error:', error)
    throw new Error(err.message || 'Login failed')
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Sign out error:', error)
    throw new Error(err.message || 'Sign out failed')
  }
}

/**
 * Get current user session
 */
export async function getUserSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}
