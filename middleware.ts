import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  response.headers.set('x-ua', request.headers.get('user-agent') || '')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
