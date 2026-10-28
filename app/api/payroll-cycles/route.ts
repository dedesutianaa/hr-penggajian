import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { payrollCycleSchema } from '@/lib/validations'

const identifier = 'api:payroll-cycles'

export async function GET(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any, [
    'PAYROLL_SPECIALIST',
    'FINANCE_CONTROLLER',
    'HR_BP',
    'IT_ADMIN',
  ])
  if ('error' in auth) return auth.error

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  const countResult = await query('SELECT COUNT(*) FROM "PayrollCycle"')
  const total = parseInt(countResult.rows[0].count)

  const result = await query(
    `SELECT "id", "period", "entityId", "country", "employees", "gross", "net", "tax", "social", "currency", "status", "progress", "anomalies", "variance", "cutoff", "payDate", "createdAt", "updatedAt" FROM "PayrollCycle" ORDER BY "period" DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  )

  return NextResponse.json({ data: result.rows, total, page, limit })
}

export async function POST(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any, [
    'PAYROLL_SPECIALIST',
    'FINANCE_CONTROLLER',
    'HR_BP',
    'IT_ADMIN',
  ])
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = payrollCycleSchema.parse(body)

    const result = await query(
      `INSERT INTO "PayrollCycle" ("period", "entityId", "country", "currency", "cutoff", "payDate", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [validation.period, validation.entityId, validation.country, validation.currency || 'IDR', validation.cutoff, validation.payDate]
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'CREATE_PAYROLL_CYCLE', $2, 'PayrollCycle', NULL, $3, 'Pembuatan siklus payroll baru', $4, $5, NOW())`,
      [auth.token.id, validation.period, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal membuat siklus payroll' }, { status: 500 })
  }
}
