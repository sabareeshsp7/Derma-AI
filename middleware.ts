import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { hasValidJwtExpiry } from "@/lib/jwt"

export async function middleware(req: NextRequest) {
  const rawAccessToken = req.cookies.get('sb-access-token')?.value || req.cookies.get('accessToken')?.value
  const hasValidToken = hasValidJwtExpiry(rawAccessToken)
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

