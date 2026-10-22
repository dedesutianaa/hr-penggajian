import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { entitySchema } from '@/lib/validations'

const identifier = 'api:entities:id'

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
    `SELECT "id", "name", "country", "currency", "headcount", "payrollMode", "status", "createdAt", "updatedAt" FROM "Entity" WHERE "id" = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
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

  const auth = await authMiddleware(req as any, ['HR_BP', 'IT_ADMIN', 'FINANCE_CONTROLLER'])
  if ('error' in auth) return auth.error

  const { id } = await params

  try {
    const body = await request.json()
    const validation = entitySchema.parse(body)

    const result = await query(
      `UPDATE "Entity" SET "name" = $1, "country" = $2, "currency" = $3, "headcount" = $4, "payrollMode" = $5, "status" = $6, "updatedAt" = NOW() WHERE "id" = $7 RETURNING *`,
      [validation.name, validation.country, validation.currency || 'IDR', validation.headcount || 0, validation.payrollMode || 'IN_HOUSE', validation.status || 'AKTIF', id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
    }

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'UPDATE_ENTITY', $2, 'Entity', NULL, $3, 'Perubahan data entitas', $4, $5, NOW())`,
      [auth.token.id, validation.name, JSON.stringify(validation), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Gagal memperbarui entitas' }, { status: 500 })
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
  const result = await query('DELETE FROM "Entity" WHERE "id" = $1 RETURNING "id"', [id])

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
  }

  await query(
    `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
     VALUES ($1, 'DELETE_ENTITY', $2, 'Entity', 'Dihapus', NULL, 'Menghapus entitas', $3, $4, NOW())`,
    [auth.token.id, id, req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
  )

  return NextResponse.json({ message: 'Entity deleted' })
}
