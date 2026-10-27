import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'

const identifier = 'api:leave-requests:id'

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
    `SELECT "id", "employeeId", "typeId", "startDate", "endDate", "days", "status", "approverId", "note", "createdAt", "updatedAt" FROM "LeaveRequest" WHERE "id" = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Leave request not found' }, { status: 404 })
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
    'MANAJER',
    'HR_BP',
    'PAYROLL_SPECIALIST',
    'FINANCE_CONTROLLER',
    'IT_ADMIN',
  ])
  if ('error' in auth) return auth.error

  const { id } = await params

  try {
    const body = await request.json()
    const { status, approverId, note } = body

    const result = await query(
      `UPDATE "LeaveRequest" SET "status" = $1, "approverId" = $2, "note" = $3, "updatedAt" = NOW() WHERE "id" = $4 RETURNING *`,
      [status, approverId, note, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 })
    }

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'UPDATE_LEAVE_REQUEST', $2, 'LeaveRequest', NULL, $3, 'Perubahan status pengajuan cuti', $4, $5, NOW())`,
      [auth.token.id, id, JSON.stringify({ status, approverId, note }), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0])
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui pengajuan cuti' }, { status: 500 })
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
  const result = await query('DELETE FROM "LeaveRequest" WHERE "id" = $1 RETURNING "id"', [id])

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Leave request not found' }, { status: 404 })
  }

  await query(
    `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
     VALUES ($1, 'DELETE_LEAVE_REQUEST', $2, 'LeaveRequest', 'Dihapus', NULL, 'Menghapus pengajuan cuti', $3, $4, NOW())`,
    [auth.token.id, id, req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
  )

  return NextResponse.json({ message: 'Leave request deleted' })
}
