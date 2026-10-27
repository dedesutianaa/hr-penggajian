import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { leaveRequestSchema } from '@/lib/validations'

const identifier = 'api:leave-requests'

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
  const offset = (page - 1) * limit
  const employeeId = searchParams.get('employeeId') || ''
  const status = searchParams.get('status') || ''

  let where = 'WHERE 1=1'
  let params: unknown[] = []

  if (employeeId) {
    where += ` AND "employeeId" = $${params.length + 1}`
    params.push(employeeId)
  }
  if (status) {
    where += ` AND "status" = $${params.length + 1}`
    params.push(status)
  }

  const countResult = await query(`SELECT COUNT(*) FROM "LeaveRequest" ${where}`, params)
  const total = parseInt(countResult.rows[0].count)

  const result = await query(
    `SELECT "id", "employeeId", "typeId", "startDate", "endDate", "days", "status", "approverId", "note", "createdAt", "updatedAt" FROM "LeaveRequest" ${where} ORDER BY "createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
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
    'KARYAWAN',
    'MANAJER',
    'HR_BP',
    'PAYROLL_SPECIALIST',
    'FINANCE_CONTROLLER',
    'IT_ADMIN',
  ])
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const validation = leaveRequestSchema.parse(body)

    const result = await query(
      `INSERT INTO "LeaveRequest" ("employeeId", "typeId", "startDate", "endDate", "days", "status", "approverId", "note", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [validation.employeeId, validation.typeId, validation.startDate, validation.endDate, validation.days, validation.status || 'MENUNJU', validation.approverId, validation.note]
    )

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'CREATE_LEAVE_REQUEST', $2, 'LeaveRequest', NULL, $3, 'Pengajuan cuti baru', $4, $5, NOW())`,
      [auth.token.id, validation.employeeId, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal membuat pengajuan cuti' }, { status: 500 })
  }
}
