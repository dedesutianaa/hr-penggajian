import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Memulai seeding database...')

  // Entitas
  const entityId = 'ent-001'
  await prisma.entity.upsert({
    where: { id: entityId },
    update: {},
    create: {
      id: entityId,
      name: 'PT Nexa Digital Indonesia',
      country: 'Indonesia',
      currency: 'IDR',
      headcount: 1284,
      payrollMode: 'IN_HOUSE',
      status: 'AKTIF',
    },
  })

  const entitySg = await prisma.entity.upsert({
    where: { id: 'ent-002' },
    update: {},
    create: {
      id: 'ent-002',
      name: 'Nexa Singapore Pte Ltd',
      country: 'Singapura',
      currency: 'SGD',
      headcount: 96,
      payrollMode: 'HYBRID',
      status: 'AKTIF',
    },
  })

  // Departemen
  const deptHR = await prisma.department.create({
    data: { id: 'dept-001', name: 'People & Culture', entityId, headcount: 42 },
  })
  const deptEng = await prisma.department.create({
    data: { id: 'dept-002', name: 'Engineering', entityId, headcount: 324 },
  })
  const deptFin = await prisma.department.create({
    data: { id: 'dept-003', name: 'Finance', entityId, headcount: 18 },
  })
  const deptOps = await prisma.department.create({
    data: { id: 'dept-004', name: 'Operations', entityId, headcount: 208 },
  })
  const deptProd = await prisma.department.create({
    data: { id: 'dept-005', name: 'Product', entityId, headcount: 186 },
  })
  const deptLegal = await prisma.department.create({
    data: { id: 'dept-006', name: 'Legal & Compliance', entityId, headcount: 6 },
  })

  // Cost center
  await prisma.costCenter.createMany({
    data: [
      { id: 'cc-001', code: 'CC-HR', name: 'Cost Center HR', entityId, departmentId: deptHR.id, budgetPct: 10 },
      { id: 'cc-002', code: 'CC-ENG', name: 'Cost Center Engineering', entityId, departmentId: deptEng.id, budgetPct: 35 },
      { id: 'cc-003', code: 'CC-FIN', name: 'Cost Center Finance', entityId, departmentId: deptFin.id, budgetPct: 8 },
      { id: 'cc-004', code: 'CC-OPS', name: 'Cost Center Operations', entityId, departmentId: deptOps.id, budgetPct: 25 },
      { id: 'cc-005', code: 'CC-PROD', name: 'Cost Center Product', entityId, departmentId: deptProd.id, budgetPct: 15 },
      { id: 'cc-006', code: 'CC-LEGAL', name: 'Cost Center Legal', entityId, departmentId: deptLegal.id, budgetPct: 2 },
    ],
  })

  // Posisi
  await prisma.position.createMany({
    data: [
      { id: 'pos-001', title: 'Head of People', grade: 'G7', departmentId: deptHR.id, entityId, isActive: true, headcount: 1, vacant: 0 },
      { id: 'pos-002', title: 'Engineering Manager', grade: 'G6', departmentId: deptEng.id, entityId, isActive: true, headcount: 5, vacant: 1 },
      { id: 'pos-003', title: 'Payroll Specialist', grade: 'G4', departmentId: deptFin.id, entityId, isActive: true, headcount: 3, vacant: 0 },
      { id: 'pos-004', title: 'Product Designer', grade: 'G4', departmentId: deptProd.id, entityId, isActive: true, headcount: 4, vacant: 0 },
      { id: 'pos-005', title: 'Talent Acquisition Lead', grade: 'G5', departmentId: deptHR.id, entityId, isActive: true, headcount: 1, vacant: 0 },
      { id: 'pos-006', title: 'Data Engineer', grade: 'G4', departmentId: deptEng.id, entityId, isActive: true, headcount: 10, vacant: 2 },
      { id: 'pos-007', title: 'HR Business Partner', grade: 'G5', departmentId: deptHR.id, entityId, isActive: true, headcount: 3, vacant: 0 },
      { id: 'pos-008', title: 'Finance Controller', grade: 'G7', departmentId: deptFin.id, entityId, isActive: true, headcount: 1, vacant: 0 },
      { id: 'pos-009', title: 'Customer Success Associate', grade: 'G3', departmentId: deptOps.id, entityId, isActive: true, headcount: 12, vacant: 1 },
      { id: 'pos-010', title: 'Operations Supervisor', grade: 'G3', departmentId: deptOps.id, entityId, isActive: true, headcount: 6, vacant: 0 },
      { id: 'pos-011', title: 'Legal Counsel', grade: 'G6', departmentId: deptLegal.id, entityId, isActive: true, headcount: 1, vacant: 0 },
      { id: 'pos-012', title: 'QA Engineer', grade: 'G2', departmentId: deptEng.id, entityId, isActive: true, headcount: 8, vacant: 1 },
    ],
  })

  // Users (NextAuth)
  const users = [
    {
      id: 'usr-001',
      name: 'Alex Pradana',
      email: 'alex.pradana@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'HR_BP',
      entity: entityId,
      country: 'Indonesia',
      department: 'People & Culture',
      mfaEnabled: true,
    },
    {
      id: 'usr-002',
      name: 'Sinta Maharani',
      email: 'sinta.maharani@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'PAYROLL_SPECIALIST',
      entity: entityId,
      country: 'Indonesia',
      department: 'Finance Operations',
      mfaEnabled: true,
    },
    {
      id: 'usr-003',
      name: 'Fajar Ramadhan',
      email: 'fajar.ramadhan@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'FINANCE_CONTROLLER',
      entity: entityId,
      country: 'Indonesia',
      department: 'Finance',
      mfaEnabled: true,
    },
    {
      id: 'usr-004',
      name: 'Nadia Prameswari',
      email: 'nadia.prameswari@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'HR_BP',
      entity: entityId,
      country: 'Indonesia',
      department: 'People & Culture',
      mfaEnabled: true,
    },
    {
      id: 'usr-005',
      name: 'Putri Anindita',
      email: 'putri.anindita@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'LEGAL_COUNSEL',
      entity: entityId,
      country: 'Indonesia',
      department: 'Legal & Compliance',
      mfaEnabled: false,
    },
    {
      id: 'usr-006',
      name: 'IT Admin',
      email: 'it.admin@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'IT_ADMIN',
      entity: entityId,
      country: 'Indonesia',
      department: 'IT',
      mfaEnabled: true,
    },
    {
      id: 'usr-007',
      name: 'Auditor',
      email: 'auditor@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'AUDITOR',
      entity: entityId,
      country: 'Indonesia',
      department: 'Compliance',
      mfaEnabled: true,
    },
    {
      id: 'usr-008',
      name: 'Bagas Nugroho',
      email: 'bagas.nugroho@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'MANAJER',
      entity: entityId,
      country: 'Indonesia',
      department: 'Engineering',
      mfaEnabled: false,
    },
    {
      id: 'usr-009',
      name: 'Rizky Pratama',
      email: 'rizky.pratama@nexa.co.id',
      password: '$2b$10$hashplaceholder',
      role: 'KARYAWAN',
      entity: entityId,
      country: 'Indonesia',
      department: 'Product',
      mfaEnabled: false,
    },
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        entity: u.entity,
        country: u.country,
        department: u.department,
        mfaEnabled: u.mfaEnabled,
      },
    })
  }

  // Karyawan (sinkron dengan lib/data.ts)
  const employees = [
    {
      id: 'nad-001', nik: '00012345678901', npwp: '09.254.771.3-407.000', bpjs: '0001 2345 6789 0',
      name: 'Nadia Prameswari', email: 'nadia.prameswari@nexa.co.id', phone: '+62 811 2044 118',
      role: 'Head of People', department: 'People & Culture', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Jakarta', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2019-03-04'), manager: 'Fajar Ramadhan', grade: 'G7', salary: 42000000,
      currency: 'IDR', bank: 'BCA', account: '•••• 4412', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'lime',
    },
    {
      id: 'bag-002', nik: '00019988112233', npwp: '07.881.220.4-011.000', bpjs: '0001 9988 1122 3',
      name: 'Bagas Nugroho', email: 'bagas.nugroho@nexa.co.id', phone: '+62 812 8890 221',
      role: 'Engineering Manager', department: 'Engineering', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Jakarta', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2020-07-13'), manager: 'Nadia Prameswari', grade: 'G6', salary: 38500000,
      currency: 'IDR', bank: 'Mandiri', account: '•••• 7781', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'mint',
    },
    {
      id: 'sin-003', nik: '00014455667788', npwp: '12.004.556.1-014.000', bpjs: '0001 4455 6677 8',
      name: 'Sinta Maharani', email: 'sinta.maharani@nexa.co.id', phone: '+62 813 5566 902',
      role: 'Payroll Specialist', department: 'Finance Operations', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Jakarta', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2021-01-11'), manager: 'Fajar Ramadhan', grade: 'G4', salary: 14200000,
      currency: 'IDR', bank: 'BNI', account: '•••• 2204', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'peach',
    },
    {
      id: 'riz-004', nik: '00017788990011', npwp: '31.220.887.2-405.000', bpjs: '0001 7788 9900 1',
      name: 'Rizky Pratama', email: 'rizky.pratama@nexa.co.id', phone: '+62 857 2201 774',
      role: 'Product Designer', department: 'Product', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Bandung', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2022-05-02'), manager: 'Nadia Prameswari', grade: 'G4', salary: 16800000,
      currency: 'IDR', bank: 'BCA', account: '•••• 9012', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'lilac',
