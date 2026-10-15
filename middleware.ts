import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rute yang memerlukan autentikasi
const protectedRoutes = [
  '/payroll',
  '/slip-gaji',
  '/kompensasi',
  '/karyawan',
  '/organisasi',
  '/onboarding',
  '/kehadiran',
  '/cuti',
  '/rekrutmen',
  '/laporan',
  '/approval',
  '/helpdesk',
  '/audit',
  '/pengaturan',
  '/saya',
  '/benefit',
  '/performa',
]

// Rute yang hanya boleh diakses jika BELUM login (redirect ke dashboard jika login)
const authRoutes = ['/masuk', '/verifikasi']

// Role yang diperlukan untuk rute spesifik (prefix: role yang diizinkan)
const roleRoutes: Record<string, string[]> = {
  '/audit': ['AUDITOR', 'IT_ADMIN', 'HR_BP', 'FINANCE_CONTROLLER', 'PAYROLL_SPECIALIST'],
  '/pengaturan': ['IT_ADMIN', 'HR_BP'],
  '/payroll': ['PAYROLL_SPECIALIST', 'FINANCE_CONTROLLER', 'HR_BP', 'IT_ADMIN'],
  '/slip-gaji': ['PAYROLL_SPECIALIST', 'FINANCE_CONTROLLER', 'HR_BP', 'IT_ADMIN'],
  '/kompensasi': ['HR_BP', 'FINANCE_CONTROLLER', 'IT_ADMIN'],
  '/approval': ['MANAJER', 'HR_BP', 'PAYROLL_SPECIALIST', 'FINANCE_CONTROLLER', 'IT_ADMIN'],
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // Static file bypass
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    /\.(png|jpg|svg|ico)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Security headers
  const response = NextResponse.next()
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
  )
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('X-Powered-By', '')

  // Auth guard
  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`))
  const isProtectedRoute = protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  )

  if (!token) {
    if (isProtectedRoute) {
      const loginUrl = new URL('/masuk', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // Jika sudah login dan akses halaman login, arahkan ke dashboard
  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Role-based access control
  if (isProtectedRoute && token.role) {
    const userRole = token.role as string
    for (const [prefix, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL('/akses-ditolak', request.url))
        }
        break
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
}
