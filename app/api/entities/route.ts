import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { entitySchema } from '@/lib/validations'

const identifier = 'api:entities'

export async function GET(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any)
  if ('error' in auth) return auth.error

  const result = await query(
    `SELECT "id", "name", "country", "currency", "headcount", "payrollMode", "status", "createdAt", "updatedAt" FROM "Entity" ORDER BY "name"`
  )
  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any, ['HR_BP', 'IT_ADMIN', 'FINANCE_CONTROLLER'])
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = entitySchema.parse(body)

    const result = await query(
      `INSERT INTO "Entity" ("name", "country", "currency", "headcount", "payrollMode", "status", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [validation.name, validation.country, validation.currency || 'IDR', validation.headcount || 0, validation.payrollMode || 'IN_HOUSE', validation.status || 'AKTIF']
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'CREATE_ENTITY', $2, 'Entity', NULL, $3, 'Pembuatan entitas baru', $4, $5, NOW())`,
      [auth.token.id, validation.name, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal membuat entitas' }, { status: 500 })
  }
}
