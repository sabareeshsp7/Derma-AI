type JwtPayload = {
  exp?: number
  sub?: string
  email?: string
  [key: string]: unknown
}

function decodeBase64Url(input: string): string {
  const normalizedInput = input.replace(/-/g, '+').replace(/_/g, '/')
  const paddedInput = normalizedInput.padEnd(Math.ceil(normalizedInput.length / 4) * 4, '=')

  if (typeof atob === 'function') {
    const binary = atob(paddedInput)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  return Buffer.from(paddedInput, 'base64').toString('utf-8')
}

export function decodeJwtPayload(token?: string): JwtPayload | null {
  if (!token) {
    return null
  }

  try {
    const parts = token.split('.')
    if (parts.length < 2) {
      return null
    }

    return JSON.parse(decodeBase64Url(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

export function hasValidJwtExpiry(token?: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) {
    return false
  }

  if (!payload.exp) {
    return true
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return payload.exp > nowInSeconds
}
