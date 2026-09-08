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
