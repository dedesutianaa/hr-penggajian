import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { positionSchema } from '@/lib/validations'

const identifier = 'api:positions'

export async function GET(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any)
  if ('error' in auth) return auth.error

  const { searchParams } = new URL(req.url)
  const departmentId = searchParams.get('departmentId') || ''
  let where = 'WHERE 1=1'
  let params: unknown[] = []

  if (departmentId) {
    where += ` AND "departmentId" = $${params.length + 1}`
    params.push(departmentId)
  }

  const result = await query(
    `SELECT "id", "title", "grade", "departmentId", "entityId", "isActive", "headcount", "vacant", "createdAt", "updatedAt" FROM "Position" ${where} ORDER BY "title"`,
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
    const validation = positionSchema.parse(body)

    const result = await query(
      `INSERT INTO "Position" ("title", "grade", "departmentId", "entityId", "headcount", "vacant", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING *`,
      [validation.title, validation.grade, validation.departmentId, validation.entityId, validation.headcount || 0, validation.vacant || 0]
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'CREATE_POSITION', $2, 'Position', NULL, $3, 'Pembuatan posisi baru', $4, $5, NOW())`,
      [auth.token.id, validation.title, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal membuat posisi' }, { status: 500 })
  }
}
