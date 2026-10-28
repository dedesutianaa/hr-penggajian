import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { payrollCycleSchema } from '@/lib/validations'

const identifier = 'api:payroll-cycles:id'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params
  const result = await query(
    `SELECT "id", "period", "entityId", "country", "employees", "gross", "net", "tax", "social", "currency", "status", "progress", "anomalies", "variance", "cutoff", "payDate", "createdAt", "updatedAt" FROM "PayrollCycle" WHERE "id" = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Payroll cycle not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params

  // Maker-checker enforcement: pengubah terakhir tidak boleh menyetujui siklus yang sama
  const lastChange = await query(
    `SELECT "actorId" FROM "AuditLog" WHERE "target" = $1 AND "action" = 'UPDATE_PAYROLL_CYCLE' ORDER BY "at" DESC LIMIT 1`,
    [id]
  )
  if (lastChange.rows.length > 0 && lastChange.rows[0].actorId === auth.token.id) {
    return NextResponse.json(
      { error: 'Maker-checker: Anda tidak dapat menyetujui siklus yang sendiri mengubah' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const validation = payrollCycleSchema.parse(body)

    const result = await query(
      `UPDATE "PayrollCycle" SET "status" = $1, "progress" = $2, "anomalies" = $3, "variance" = $4, "payDate" = $5, "updatedAt" = NOW() WHERE "id" = $6 RETURNING *`,
      [validation.status, validation.progress, validation.anomalies, validation.variance, validation.payDate, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Payroll cycle not found' }, { status: 404 })
    }

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'UPDATE_PAYROLL_CYCLE', $2, 'PayrollCycle', NULL, $3, 'Perubahan siklus payroll', $4, $5, NOW())`,
      [auth.token.id, id, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal memperbarui siklus payroll' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any, ['PAYROLL_SPECIALIST', 'IT_ADMIN'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const result = await query('DELETE FROM "PayrollCycle" WHERE "id" = $1 RETURNING "id"', [id])

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Payroll cycle not found' }, { status: 404 })
  }

  await query(
    `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
     VALUES ($1, 'DELETE_PAYROLL_CYCLE', $2, 'PayrollCycle', 'Dihapus', NULL, 'Menghapus siklus payroll', $3, $4, NOW())`,
    [auth.token.id, id, req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
  )

  return NextResponse.json({ message: 'Payroll cycle deleted' })
}
