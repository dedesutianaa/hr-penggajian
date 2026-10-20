import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { departmentSchema } from '@/lib/validations'

const identifier = 'api:departments'

export async function GET(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any)
  if ('error' in auth) return auth.error

  const { searchParams } = new URL(req.url)
  const entityId = searchParams.get('entityId') || ''
  let where = 'WHERE 1=1'
  let params: unknown[] = []

  if (entityId) {
    where += ` AND "entityId" = $${params.length + 1}`
    params.push(entityId)
  }

  const result = await query(
    `SELECT "id", "name", "entityId", "headcount", "createdAt", "updatedAt" FROM "Department" ${where} ORDER BY "name"`,
    params
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
    const validation = departmentSchema.parse(body)

    const result = await query(
      `INSERT INTO "Department" ("name", "entityId", "headcount", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [validation.name, validation.entityId, validation.headcount || 0]
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'CREATE_DEPARTMENT', $2, 'Department', NULL, $3, 'Pembuatan departemen baru', $4, $5, NOW())`,
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
    return NextResponse.json({ error: 'Gagal membuat departemen' }, { status: 500 })
  }
}
