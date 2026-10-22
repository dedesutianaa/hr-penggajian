import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { employeeSchema } from '@/lib/validations'

const identifier = 'api:employees:id'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any)
  if ('error' in auth) return auth.error

  const { id } = await params
  const result = await query(
    `SELECT "id", "nik", "npwp", "bpjs", "name", "email", "phone", "role", "department", "entity", "country", "location", "type", "status", "joinDate", "lastDay", "manager", "grade", "salary", "currency", "bank", "account", "accountVerified", "taxStatus", "photoUrl", "tone", "createdAt", "updatedAt" FROM "Employee" WHERE "id" = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
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
    'HR_BP',
    'PAYROLL_SPECIALIST',
    'FINANCE_CONTROLLER',
    'IT_ADMIN',
  ])
  if ('error' in auth) return auth.error

  const { id } = await params

  const beforeResult = await query(`SELECT * FROM "Employee" WHERE "id" = $1`, [id])
  if (beforeResult.rows.length === 0) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const validation = employeeSchema.parse(body)

    const result = await query(
      `UPDATE "Employee" SET "nik" = $1, "npwp" = $2, "bpjs" = $3, "name" = $4, "email" = $5, "phone" = $6, "role" = $7, "department" = $8, "entity" = $9, "country" = $10, "location" = $11, "type" = $12, "status" = $13, "joinDate" = $14, "manager" = $15, "grade" = $16, "salary" = $17, "currency" = $18, "bank" = $19, "account" = $20, "accountVerified" = $21, "taxStatus" = $22, "photoUrl" = $23, "tone" = $24, "updatedAt" = NOW() WHERE "id" = $25 RETURNING *`,
      [
        validation.nik,
        validation.npwp,
        validation.bpjs,
        validation.name,
        validation.email,
        validation.phone,
        validation.role,
        validation.department,
        validation.entity,
        validation.country,
        validation.location,
        validation.type,
        validation.status,
        validation.joinDate,
        validation.manager,
        validation.grade,
        validation.salary,
        validation.currency || 'IDR',
        validation.bank,
        validation.account,
        validation.accountVerified !== undefined ? validation.accountVerified : false,
        validation.taxStatus || 'TK/0',
        validation.photoUrl,
        validation.tone || 'mint',
        id,
      ]
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'UPDATE_EMPLOYEE', $2, 'Employee', $3, $4, 'Perubahan data karyawan', $5, $6, NOW())`,
      [
        auth.token.id,
        validation.email,
        JSON.stringify(beforeResult.rows[0]),
        JSON.stringify(validation),
        req.headers.get('x-forwarded-for') ?? undefined,
        req.headers.get('user-agent') ?? undefined,
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal memperbarui karyawan' }, { status: 500 })
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

  const auth = await authMiddleware(req as any, ['HR_BP', 'IT_ADMIN'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const result = await query('DELETE FROM "Employee" WHERE "id" = $1 RETURNING "id"', [id])

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  }

  await query(
    `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
     VALUES ($1, 'DELETE_EMPLOYEE', $2, 'Employee', 'Dihapus', NULL, 'Menghapus data karyawan', $3, $4, NOW())`,
    [auth.token.id, id, req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
  )

  return NextResponse.json({ message: 'Employee deleted' })
}
