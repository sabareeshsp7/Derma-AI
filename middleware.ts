import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function hasValidAccessToken(token?: string): boolean {
  if (!token) return false

  try {
    const parts = token.split('.')
    if (parts.length < 2) return false

    const normalizedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(normalizedPayload, 'base64').toString()) as {
      exp?: number
    }

    if (!payload.exp) return true

    const nowInSeconds = Math.floor(Date.now() / 1000)
    return payload.exp > nowInSeconds
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const rawAccessToken = req.cookies.get('sb-access-token')?.value || req.cookies.get('accessToken')?.value
  const hasValidToken = hasValidAccessToken(rawAccessToken)
  const { pathname } = req.nextUrl

  if (
    !hasValidToken &&
    pathname.startsWith("/dashboard")
  ) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

