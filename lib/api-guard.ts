import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'

export async function authMiddleware(
  request: NextRequest,
  allowedRoles?: string[]
): Promise<{ token: any; response?: NextResponse } | { error: NextResponse }> {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return { error: NextResponse.json({ error: 'Autentikasi diperlukan' }, { status: 401 }) }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = token.role as string
    if (!allowedRoles.includes(userRole)) {
      return { error: NextResponse.json({ error: 'Akses ditolak untuk peran ini' }, { status: 403 }) }
    }
  }

  return { token, response: undefined }
}

export function validateBody<T>(schema: ZodSchema<T>, body: unknown): { data: T } | { error: NextResponse } {
  try {
    const data = schema.parse(body)
    return { data }
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        error: NextResponse.json(
          { error: 'Validasi gagal', details: err.issues.map((e) => ({ path: e.path.join('.'), message: e.message })) },
          { status: 400 }
        ),
      }
    }
    return { error: NextResponse.json({ error: 'Validasi gagal' }, { status: 400 }) }
  }
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetTime: number }>()

  return (identifier: string): { allowed: boolean; remaining: number } => {
    const now = Date.now()
    const record = hits.get(identifier)

    if (!record || now > record.resetTime) {
      hits.set(identifier, { count: 1, resetTime: now + windowMs })
      return { allowed: true, remaining: maxRequests - 1 }
    }

    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0 }
    }

    record.count += 1
    return { allowed: true, remaining: maxRequests - record.count }
  }
}

export const loginRateLimiter = createRateLimiter(10, 15 * 60 * 1000) // 10 requests per 15 menit
export const apiRateLimiter = createRateLimiter(100, 60 * 1000) // 100 requests per menit
