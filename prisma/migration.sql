-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (NextAuth)
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT UNIQUE,
  emailVerified TIMESTAMPTZ,
  image TEXT,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'KARYAWAN',
  entity TEXT,
  country TEXT,
  department TEXT,
  mfaEnabled BOOLEAN NOT NULL DEFAULT false,
  mfaSecret TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accounts (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"(provider, providerAccountId);

-- Sessions (NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sessionToken TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- VerificationTokens (NextAuth)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

-- Entities
CREATE TABLE IF NOT EXISTS "Entity" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  headcount INTEGER NOT NULL DEFAULT 0,
  payrollMode TEXT NOT NULL DEFAULT 'IN_HOUSE',
  status TEXT NOT NULL DEFAULT 'AKTIF',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS "Department" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  entityId TEXT NOT NULL,
  headcount INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Department_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id)
);

-- Cost Centers
CREATE TABLE IF NOT EXISTS "CostCenter" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  entityId TEXT NOT NULL,
  departmentId TEXT,
  owner TEXT,
  budgetPct INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "CostCenter_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id),
  CONSTRAINT "CostCenter_departmentId_fkey" FOREIGN KEY (departmentId) REFERENCES "Department"(id)
);

-- Positions
CREATE TABLE IF NOT EXISTS "Position" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  grade TEXT NOT NULL,
  departmentId TEXT NOT NULL,
  entityId TEXT NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT true,
  headcount INTEGER NOT NULL DEFAULT 0,
  vacant INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Position_departmentId_fkey" FOREIGN KEY (departmentId) REFERENCES "Department"(id),
  CONSTRAINT "Position_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id)
);

-- Employees
CREATE TABLE IF NOT EXISTS "Employee" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nik TEXT UNIQUE,
  npwp TEXT,
  bpjs TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  entity TEXT NOT NULL,
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'TETAP',
  status TEXT NOT NULL DEFAULT 'AKTIF',
  joinDate TIMESTAMPTZ NOT NULL,
  lastDay TIMESTAMPTZ,
  manager TEXT,
  grade TEXT,
  salary INTEGER,
  currency TEXT NOT NULL DEFAULT 'IDR',
  bank TEXT,
  account TEXT,
  accountVerified BOOLEAN NOT NULL DEFAULT false,
  taxStatus TEXT NOT NULL DEFAULT 'TK/0',
  photoUrl TEXT,
  tone TEXT NOT NULL DEFAULT 'mint',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Employment History
CREATE TABLE IF NOT EXISTS "EmploymentHistory" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  effective TIMESTAMPTZ NOT NULL,
  inputDate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  detail TEXT,
  reason TEXT,
  actor TEXT,
  grade TEXT,
  salary INTEGER,
  entity TEXT,
  department TEXT,
  position TEXT,
  type TEXT,
  status TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "EmploymentHistory_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);
CREATE INDEX IF NOT EXISTS "EmploymentHistory_employeeId_effective_idx" ON "EmploymentHistory"(employeeId, effective);

-- Payroll Cycles
CREATE TABLE IF NOT EXISTS "PayrollCycle" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  period TEXT NOT NULL,
  entityId TEXT NOT NULL,
  country TEXT NOT NULL,
  employees INTEGER NOT NULL DEFAULT 0,
  gross INTEGER NOT NULL DEFAULT 0,
  net INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  social INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'IDR',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  progress INTEGER NOT NULL DEFAULT 0,
  anomalies INTEGER NOT NULL DEFAULT 0,
  variance DOUBLE PRECISION NOT NULL DEFAULT 0,
  cutoff TIMESTAMPTZ,
  payDate TIMESTAMPTZ,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PayrollCycle_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id)
);
CREATE INDEX IF NOT EXISTS "PayrollCycle_entityId_period_idx" ON "PayrollCycle"(entityId, period);

-- Payroll Components
CREATE TABLE IF NOT EXISTS "PayrollComponent" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT NOT NULL,
  label TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PayrollComponent_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id) ON DELETE CASCADE
);

-- Payroll Results
CREATE TABLE IF NOT EXISTS "PayrollResult" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT NOT NULL,
  employeeId TEXT NOT NULL,
  gross INTEGER NOT NULL DEFAULT 0,
  deduction INTEGER NOT NULL DEFAULT 0,
  net INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  social INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'IDR',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PayrollResult_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id) ON DELETE CASCADE,
  CONSTRAINT "PayrollResult_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);
CREATE INDEX IF NOT EXISTS "PayrollResult_cycleId_employeeId_idx" ON "PayrollResult"(cycleId, employeeId);

-- Payslips
CREATE TABLE IF NOT EXISTS "Payslip" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT,
  employeeId TEXT NOT NULL,
  period TEXT NOT NULL,
  gross INTEGER NOT NULL DEFAULT 0,
  deduction INTEGER NOT NULL DEFAULT 0,
  net INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  downloadedAt TIMESTAMPTZ,
  downloadedBy TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Payslip_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id),
  CONSTRAINT "Payslip_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);
CREATE INDEX IF NOT EXISTS "Payslip_employeeId_period_idx" ON "Payslip"(employeeId, period);

-- Payroll Variance
CREATE TABLE IF NOT EXISTS "PayrollVariance" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT NOT NULL,
  employeeId TEXT NOT NULL,
  component TEXT NOT NULL,
  prev INTEGER NOT NULL DEFAULT 0,
  next INTEGER NOT NULL DEFAULT 0,
  delta DOUBLE PRECISION NOT NULL DEFAULT 0,
  reason TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PayrollVariance_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id) ON DELETE CASCADE,
  CONSTRAINT "PayrollVariance_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);

-- Payroll Anomalies
CREATE TABLE IF NOT EXISTS "PayrollAnomaly" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  owner TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PayrollAnomaly_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id) ON DELETE CASCADE
);

-- GL Journal Entries
CREATE TABLE IF NOT EXISTS "GLJournalEntry" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT NOT NULL,
  account TEXT NOT NULL,
  costCenter TEXT NOT NULL,
  debit INTEGER NOT NULL DEFAULT 0,
  credit INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "GLJournalEntry_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id) ON DELETE CASCADE
);

-- Payroll Approval Steps
CREATE TABLE IF NOT EXISTS "PayrollApprovalStep" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycleId TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'BELUM',
  at TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PayrollApprovalStep_cycleId_fkey" FOREIGN KEY (cycleId) REFERENCES "PayrollCycle"(id) ON DELETE CASCADE
);

-- Leave Types
CREATE TABLE IF NOT EXISTS "LeaveType" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  entityId TEXT NOT NULL,
  annualDays INTEGER NOT NULL DEFAULT 0,
  rules TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "LeaveType_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id)
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS "LeaveRequest" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  typeId TEXT NOT NULL,
  startDate TIMESTAMPTZ NOT NULL,
  endDate TIMESTAMPTZ NOT NULL,
  days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'MENUNJU',
  approverId TEXT,
  note TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id),
  CONSTRAINT "LeaveRequest_typeId_fkey" FOREIGN KEY (typeId) REFERENCES "LeaveType"(id),
  CONSTRAINT "LeaveRequest_approverId_fkey" FOREIGN KEY (approverId) REFERENCES "User"(id)
);
CREATE INDEX IF NOT EXISTS "LeaveRequest_employeeId_status_idx" ON "LeaveRequest"(employeeId, status);

-- Leave Balances
CREATE TABLE IF NOT EXISTS "LeaveBalance" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  typeId TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "LeaveBalance_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id),
  CONSTRAINT "LeaveBalance_typeId_fkey" FOREIGN KEY (typeId) REFERENCES "LeaveType"(id),
  UNIQUE(employeeId, typeId)
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS "AttendanceRecord" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  clockIn TEXT,
  clockOut TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'ABSEN',
  hours TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "AttendanceRecord_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);
CREATE INDEX IF NOT EXISTS "AttendanceRecord_employeeId_date_idx" ON "AttendanceRecord"(employeeId, date);

-- Shifts
CREATE TABLE IF NOT EXISTS "Shift" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  entityId TEXT NOT NULL,
  headcount INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Shift_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id)
);

-- Overtime Requests
CREATE TABLE IF NOT EXISTS "OvertimeRequest" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  hours DOUBLE PRECISION NOT NULL DEFAULT 0,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'MENUNJU',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "OvertimeRequest_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);

-- Onboarding Tasks
CREATE TABLE IF NOT EXISTS "OnboardingTask" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  label TEXT NOT NULL,
  owner TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  employeeId TEXT,
  dueDate TIMESTAMPTZ,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "OnboardingTask_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);

-- Offboarding Tasks
CREATE TABLE IF NOT EXISTS "OffboardingTask" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  label TEXT NOT NULL,
  owner TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  employeeId TEXT,
  dueDate TIMESTAMPTZ,
  clearance TEXT,
  finalPay TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "OffboardingTask_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);

-- Requisitions
CREATE TABLE IF NOT EXISTS "Requisition" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  role TEXT NOT NULL,
  dept TEXT NOT NULL,
  entity TEXT NOT NULL,
  headcount INTEGER NOT NULL DEFAULT 0,
  stage TEXT NOT NULL,
  days INTEGER NOT NULL DEFAULT 0,
  budget TEXT NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Candidates
CREATE TABLE IF NOT EXISTS "Candidate" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  stageId TEXT NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Candidate_stageId_fkey" FOREIGN KEY (stageId) REFERENCES "Requisition"(id)
);

-- Interviews
CREATE TABLE IF NOT EXISTS "Interview" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  time TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  panel TEXT NOT NULL,
  mode TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Reviews
CREATE TABLE IF NOT EXISTS "PerformanceReview" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  cycle TEXT NOT NULL,
  score DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  reviewerId TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PerformanceReview_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id),
  CONSTRAINT "PerformanceReview_reviewerId_fkey" FOREIGN KEY (reviewerId) REFERENCES "User"(id)
);

-- OKRs
CREATE TABLE IF NOT EXISTS "OKR" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  keyResults TEXT,
  tone TEXT NOT NULL DEFAULT 'lime',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Salary Bands
CREATE TABLE IF NOT EXISTS "SalaryBand" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  grade TEXT NOT NULL,
  title TEXT NOT NULL,
  min INTEGER NOT NULL DEFAULT 0,
  mid INTEGER NOT NULL DEFAULT 0,
  max INTEGER NOT NULL DEFAULT 0,
  headcount INTEGER NOT NULL DEFAULT 0,
  compa DOUBLE PRECISION NOT NULL DEFAULT 0,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Benefits
CREATE TABLE IF NOT EXISTS "Benefit" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  coverage TEXT NOT NULL,
  enrolled INTEGER NOT NULL DEFAULT 0,
  eligible INTEGER NOT NULL DEFAULT 0,
  tone TEXT NOT NULL DEFAULT 'mint',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS "Expense" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT NOT NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'MENUNJU',
  ocr BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Expense_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);

-- Tickets
CREATE TABLE IF NOT EXISTS "Ticket" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  employeeId TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'SEDANG',
  status TEXT NOT NULL DEFAULT 'TERBUKA',
  assignee TEXT,
  sla TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Ticket_employeeId_fkey" FOREIGN KEY (employeeId) REFERENCES "Employee"(id)
);

-- Audit Logs (Immutable)
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actorId TEXT,
  action TEXT NOT NULL,
  target TEXT,
  field TEXT,
  before TEXT,
  after TEXT,
  reason TEXT,
  ipAddress TEXT,
  userAgent TEXT,
  CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY (actorId) REFERENCES "User"(id)
);
CREATE INDEX IF NOT EXISTS "AuditLog_at_idx" ON "AuditLog"(at);
CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog"(actorId);
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"(action);

-- Integrations
CREATE TABLE IF NOT EXISTS "Integration" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  vendor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'TERHUBUNG',
  detail TEXT,
  tone TEXT NOT NULL DEFAULT 'lime',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow Configs
CREATE TABLE IF NOT EXISTS "WorkflowConfig" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  entityId TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  conditions TEXT,
  sla TEXT,
  escalation TEXT,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  approved BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "WorkflowConfig_entityId_fkey" FOREIGN KEY (entityId) REFERENCES "Entity"(id)
);
