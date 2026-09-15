import { query } from '@/lib/db'

export async function getEmployeeById(id: string) {
  const result = await query(
    `SELECT "id", "nik", "npwp", "bpjs", "name", "email", "phone", "role", "department", "entity", "country", "location", "type", "status", "joinDate", "lastDay", "manager", "grade", "salary", "currency", "bank", "account", "accountVerified", "taxStatus", "photoUrl", "tone", "createdAt", "updatedAt" FROM "Employee" WHERE "id" = $1`,
    [id]
  )
  return result.rows[0] ?? null
}

export async function getEmployees({
  search,
  department,
  status,
  page = 1,
  limit = 20,
}: {
  search?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}) {
  let where = 'WHERE 1=1'
  let params: unknown[] = []
  let paramIndex = 1

  if (search) {
    where += ` AND ("name" ILIKE $${paramIndex} OR "email" ILIKE $${paramIndex} OR "nik" ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }
  if (department) {
    where += ` AND "department" = $${paramIndex}`
    params.push(department)
    paramIndex++
  }
  if (status) {
    where += ` AND "status" = $${paramIndex}`
    params.push(status)
    paramIndex++
  }

  const countResult = await query(`SELECT COUNT(*) FROM "Employee" ${where}`, params)
  const total = parseInt(countResult.rows[0].count)

  const result = await query(
    `SELECT "id", "nik", "npwp", "bpjs", "name", "email", "phone", "role", "department", "entity", "country", "location", "type", "status", "joinDate", "lastDay", "manager", "grade", "salary", "currency", "bank", "account", "accountVerified", "taxStatus", "photoUrl", "tone", "createdAt", "updatedAt" FROM "Employee" ${where} ORDER BY "name" LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, (page - 1) * limit]
  )

  return { data: result.rows, total, page, limit }
}

export async function getEmploymentHistory(employeeId: string) {
  const result = await query(
    `SELECT "id", "effective", "inputDate", "title", "detail", "reason", "actor", "grade", "salary", "entity", "department", "position", "type", "status", "createdAt" FROM "EmploymentHistory" WHERE "employeeId" = $1 ORDER BY "effective" DESC`,
    [employeeId]
  )
  return result.rows
}

export async function getLeaveRequestsByEmployee(employeeId: string) {
  const result = await query(
    `SELECT "lr"."id", "lr"."typeId", "lt"."name" as "typeName", "lr"."startDate", "lr"."endDate", "lr"."days", "lr"."status", "lr"."approverId", "lr"."note", "lr"."createdAt", "lr"."updatedAt" FROM "LeaveRequest" "lr" JOIN "LeaveType" "lt" ON "lr"."typeId" = "lt"."id" WHERE "lr"."employeeId" = $1 ORDER BY "lr"."startDate" DESC`,
    [employeeId]
  )
  return result.rows
}

export async function getLeaveBalancesByEmployee(employeeId: string) {
  const result = await query(
    `SELECT "lb"."id", "lb"."employeeId", "lb"."typeId", "lt"."name" as "typeName", "lb"."used", "lb"."total", "lt"."annualDays", "lt"."rules" FROM "LeaveBalance" "lb" JOIN "LeaveType" "lt" ON "lb"."typeId" = "lt"."id" WHERE "lb"."employeeId" = $1`,
    [employeeId]
  )
  return result.rows
}

export async function getPayslipsByEmployee(employeeId: string) {
  const result = await query(
    `SELECT "p"."id", "p"."cycleId", "p"."employeeId", "p"."period", "p"."gross", "p"."deduction", "p"."net", "p"."status", "p"."downloadedAt", "p"."downloadedBy", "p"."createdAt", "p"."updatedAt", "c"."period" as "cyclePeriod" FROM "Payslip" "p" LEFT JOIN "PayrollCycle" "c" ON "p"."cycleId" = "c"."id" WHERE "p"."employeeId" = $1 ORDER BY "p"."period" DESC`,
    [employeeId]
  )
  return result.rows
}

export async function getAuditLogByTarget(target: string, limit = 50) {
  const result = await query(
    `SELECT "al"."id", "al"."at", "al"."actorId", "u"."name" as "actorName", "al"."action", "al"."target", "al"."field", "al"."before", "al"."after", "al"."reason", "al"."ipAddress", "al"."userAgent" FROM "AuditLog" "al" LEFT JOIN "User" "u" ON "al"."actorId" = "u"."id" WHERE "al"."target" = $1 ORDER BY "al"."at" DESC LIMIT $2`,
    [target, limit]
  )
  return result.rows
}

export async function getPayrollCycles({
  page = 1,
  limit = 20,
}: { page?: number; limit?: number }) {
  const offset = (page - 1) * limit
  const countResult = await query('SELECT COUNT(*) FROM "PayrollCycle"')
  const total = parseInt(countResult.rows[0].count)

  const result = await query(
    `SELECT "id", "period", "entityId", "country", "employees", "gross", "net", "tax", "social", "currency", "status", "progress", "anomalies", "variance", "cutoff", "payDate", "createdAt", "updatedAt" FROM "PayrollCycle" ORDER BY "period" DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  )

  return { data: result.rows, total, page, limit }
}

export async function getPayrollCycleById(id: string) {
  const result = await query(
    `SELECT "id", "period", "entityId", "country", "employees", "gross", "net", "tax", "social", "currency", "status", "progress", "anomalies", "variance", "cutoff", "payDate", "createdAt", "updatedAt" FROM "PayrollCycle" WHERE "id" = $1`,
    [id]
  )
  return result.rows[0] ?? null
}

export async function getDepartments(entityId?: string) {
  let where = 'WHERE 1=1'
  let params: unknown[] = []
  if (entityId) {
    where += ` AND "entityId" = $1`
    params.push(entityId)
  }
  const result = await query(`SELECT * FROM "Department" ${where} ORDER BY "name"`, params)
  return result.rows
}

export async function getPositions(departmentId?: string) {
  let where = 'WHERE 1=1'
  let params: unknown[] = []
  if (departmentId) {
    where += ` AND "departmentId" = $1`
    params.push(departmentId)
  }
  const result = await query(`SELECT * FROM "Position" ${where} ORDER BY "title"`, params)
  return result.rows
}

export async function getAuditLogs({ limit = 100 }: { limit?: number }) {
  const result = await query(
    `SELECT "al"."id", "al"."at", "al"."actorId", "u"."name" as "actorName", "al"."action", "al"."target", "al"."field", "al"."before", "al"."after", "al"."reason", "al"."ipAddress", "al"."userAgent" FROM "AuditLog" "al" LEFT JOIN "User" "u" ON "al"."actorId" = "u"."id" ORDER BY "al"."at" DESC LIMIT $1`,
    [limit]
  )
  return result.rows
}

export async function getLeaveTypes(entityId?: string) {
  let where = 'WHERE 1=1'
  let params: unknown[] = []
  if (entityId) {
    where += ` AND "entityId" = $1`
    params.push(entityId)
  }
  const result = await query(`SELECT * FROM "LeaveType" ${where} ORDER BY "name"`, params)
  return result.rows
}

export async function getSalaryBands() {
  const result = await query('SELECT * FROM "SalaryBand" ORDER BY "grade"')
  return result.rows
}

export async function getBenefits() {
  const result = await query('SELECT * FROM "Benefit" ORDER BY "name"')
  return result.rows
}

export async function getIntegrations() {
  const result = await query('SELECT * FROM "Integration" ORDER BY "name"')
  return result.rows
}

export async function getWorkflows() {
  const result = await query('SELECT * FROM "WorkflowConfig" ORDER BY "name"')
  return result.rows
}

export async function getEntities() {
  const result = await query('SELECT * FROM "Entity" ORDER BY "name"')
  return result.rows
}

export async function getCostCenters(entityId?: string) {
  let where = 'WHERE 1=1'
  let params: unknown[] = []
  if (entityId) {
    where += ` AND "entityId" = $1`
    params.push(entityId)
  }
  const result = await query(`SELECT * FROM "CostCenter" ${where} ORDER BY "code"`, params)
  return result.rows
}

