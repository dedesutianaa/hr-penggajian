import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authMiddleware, apiRateLimiter } from '@/lib/api-guard'
import { employeeSchema } from '@/lib/validations'

const identifier = 'api:employees:import'

function parseCSV(csv: string): string[][] {
  const lines = csv.split('\n').filter((line) => line.trim().length > 0)
  return lines.map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')))
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
    const { csv } = body

    if (!csv || typeof csv !== 'string') {
      return NextResponse.json({ error: 'CSV data wajib diisi' }, { status: 400 })
    }

    const rows = parseCSV(csv)
    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV harus memiliki header dan minimal 1 data baris' }, { status: 400 })
    }

    const header = rows[0]
    const expectedHeader = ['nik', 'npwp', 'bpjs', 'name', 'email', 'phone', 'role', 'department', 'entity', 'country', 'location', 'type', 'status', 'joinDate', 'manager', 'grade', 'salary', 'currency', 'bank', 'account', 'accountVerified', 'taxStatus', 'photoUrl', 'tone']

    const headerMismatch = expectedHeader.filter((h) => !header.includes(h))
    if (headerMismatch.length > 0) {
      return NextResponse.json(
        { error: `Kolom CSV tidak lengkap: ${headerMismatch.join(', ')}` },
        { status: 400 }
      )
    }

    const colIndex = (name: string) => header.indexOf(name)
    const results: Array<{ row: number; success: boolean; data?: any; error?: string }> = []
    let imported = 0

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const raw = {
        nik: row[colIndex('nik')] || null,
        npwp: row[colIndex('npwp')] || null,
        bpjs: row[colIndex('bpjs')] || null,
        name: row[colIndex('name')] || '',
        email: row[colIndex('email')] || '',
        phone: row[colIndex('phone')] || null,
        role: row[colIndex('role')] || '',
        department: row[colIndex('department')] || '',
        entity: row[colIndex('entity')] || '',
        country: row[colIndex('country')] || '',
        location: row[colIndex('location')] || '',
        type: row[colIndex('type')] || 'TETAP',
        status: row[colIndex('status')] || 'AKTIF',
        joinDate: row[colIndex('joinDate')] || new Date().toISOString(),
        manager: row[colIndex('manager')] || null,
        grade: row[colIndex('grade')] || null,
        salary: row[colIndex('salary')] ? parseInt(row[colIndex('salary')]!) : null,
        currency: row[colIndex('currency')] || 'IDR',
        bank: row[colIndex('bank')] || null,
        account: row[colIndex('account')] || null,
        accountVerified: row[colIndex('accountVerified')]?.toLowerCase() === 'true',
        taxStatus: row[colIndex('taxStatus')] || 'TK/0',
        photoUrl: row[colIndex('photoUrl')] || null,
        tone: row[colIndex('tone')] || 'mint',
      }

      const validation = employeeSchema.safeParse(raw)
      if (!validation.success) {
        results.push({
          row: i + 1,
          success: false,
          error: validation.error.issues.map((e: { message: string }) => e.message).join('; '),
        })
        continue
      }

      try {
        await query(
          `INSERT INTO "Employee" ("nik", "npwp", "bpjs", "name", "email", "phone", "role", "department", "entity", "country", "location", "type", "status", "joinDate", "manager", "grade", "salary", "currency", "bank", "account", "accountVerified", "taxStatus", "photoUrl", "tone", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW(), NOW())
           RETURNING "id"`,
          [
            validation.data.nik,
            validation.data.npwp,
            validation.data.bpjs,
            validation.data.name,
            validation.data.email,
            validation.data.phone,
            validation.data.role,
            validation.data.department,
            validation.data.entity,
            validation.data.country,
            validation.data.location,
            validation.data.type,
            validation.data.status,
            validation.data.joinDate,
            validation.data.manager,
            validation.data.grade,
            validation.data.salary,
            validation.data.currency,
            validation.data.bank,
            validation.data.account,
            validation.data.accountVerified,
            validation.data.taxStatus,
            validation.data.photoUrl,
            validation.data.tone,
          ]
        )
        imported++
        results.push({ row: i + 1, success: true, data: validation.data })
      } catch (dbError: any) {
        results.push({
          row: i + 1,
          success: false,
          error: dbError.message ?? 'Gagal menyimpan ke database',
        })
      }
    }

    await query(
      `INSERT INTO "AuditLog" ("actorId", "action", "target", "field", "before", "after", "reason", "ipAddress", "userAgent", "createdAt")
       VALUES ($1, 'IMPORT_EMPLOYEES', $2, 'Employee', NULL, $3, 'Impor data karyawan dari CSV', $4, $5, NOW())`,
      [auth.token.id, JSON.stringify({ total: rows.length - 1, imported, failed: rows.length - 1 - imported }), req.headers.get('x-forwarded-for') ?? undefined, req.headers.get('user-agent') ?? undefined]
    )

    return NextResponse.json(
      {
        total: rows.length - 1,
        imported,
        failed: rows.length - 1 - imported,
        results,
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Gagal mengimpor data karyawan' }, { status: 500 })
  }
}
