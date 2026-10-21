import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { employeeSchema } from '@/lib/validations'

const identifier = 'api:employees'

export async function GET(request: Request) {
  const req = request as unknown as Request & { headers: { get: (key: string) => string | null } }
  const rateCheck = apiRateLimiter(identifier)
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const auth = await authMiddleware(req as any)
  if ('error' in auth) return auth.error

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const offset = (page - 1) * limit

  let where = ''
  let params: unknown[] = []

  if (search) {
    where = 'WHERE "name" ILIKE $1 OR "email" ILIKE $1 OR "nik" ILIKE $1'
    params = [`%${search}%`]
  }

  const countResult = await query(`SELECT COUNT(*) FROM "Employee" ${where}`, params)
  const total = parseInt(countResult.rows[0].count)

  const result = await query(
    `SELECT "id", "nik", "npwp", "bpjs", "name", "email", "phone", "role", "department", "entity", "country", "location", "type", "status", "joinDate", "lastDay", "manager", "grade", "salary", "currency", "bank", "account", "accountVerified", "taxStatus", "photoUrl", "tone", "createdAt", "updatedAt" FROM "Employee" ${where} ORDER BY "name" LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
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
    'HR_BP',
    'PAYROLL_SPECIALIST',
    'FINANCE_CONTROLLER',
    'IT_ADMIN',
  ])
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = employeeSchema.parse(body)

    const result = await query(
      `INSERT INTO "Employee" ("nik", "npwp", "bpjs", "name", "email", "phone", "role", "department", "entity", "country", "location", "type", "status", "joinDate", "manager", "grade", "salary", "currency", "bank", "account", "accountVerified", "taxStatus", "photoUrl", "tone", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, NOW(), NOW())
       RETURNING *`,
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
      ]
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'CREATE_EMPLOYEE', $2, 'Employee', NULL, $3, 'Pembuatan karyawan baru', $4, $5, NOW())`,
      [auth.token.id, validation.email, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal membuat karyawan' }, { status: 500 })
  }
}
