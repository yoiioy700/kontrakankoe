import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge-compatible middleware — just check for the session cookie
// No Prisma/SQLite imports here (Edge Runtime doesn't support fs)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const protectedRoutes = ['/dashboard', '/onboarding']
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))

  if (isProtected) {
    // NextAuth v5 JWT session cookie name
    const sessionCookie =
      req.cookies.get('authjs.session-token') ||
      req.cookies.get('__Secure-authjs.session-token')

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|tagihan).*)'],
}
