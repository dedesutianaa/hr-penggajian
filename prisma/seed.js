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
    },
    {
      id: 'ayu-005', nik: '00012233445566', npwp: '45.667.112.9-017.000', bpjs: '0001 2233 4455 6',
      name: 'Ayu Lestari', email: 'ayu.lestari@nexa.co.id', phone: '+62 811 7788 330',
      role: 'Talent Acquisition Lead', department: 'People & Culture', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Jakarta', type: 'TETAP', status: 'CUTI',
      joinDate: new Date('2020-11-16'), manager: 'Nadia Prameswari', grade: 'G5', salary: 24000000,
      currency: 'IDR', bank: 'Mandiri', account: '•••• 3345', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'sky',
    },
    {
      id: 'dim-006', nik: '00015566778899', npwp: '52.889.001.6-541.000', bpjs: '0001 5566 7788 9',
      name: 'Dimas Saputra', email: 'dimas.saputra@nexa.co.id', phone: '+62 878 1122 445',
      role: 'Data Engineer', department: 'Engineering', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Yogyakarta', type: 'KONTRAK', status: 'AKTIF',
      joinDate: new Date('2024-02-19'), manager: 'Bagas Nugroho', grade: 'G4', salary: 19500000,
      currency: 'IDR', bank: 'BRI', account: '•••• 6678', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'mint',
    },
    {
      id: 'cla-007', nik: null, npwp: null, bpjs: null,
      name: 'Clara Wijaya', email: 'clara.wijaya@nexa.sg', phone: '+65 8123 4455',
      role: 'HR Business Partner', department: 'People & Culture', entity: 'Nexa Singapore Pte Ltd',
      country: 'Singapura', location: 'Singapore', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2021-09-06'), manager: 'Nadia Prameswari', grade: 'G5', salary: 7800,
      currency: 'SGD', bank: 'DBS', account: '•••• 1180', accountVerified: true, taxStatus: '—',
      photoUrl: null, tone: 'lilac',
    },
    {
      id: 'faj-008', nik: '00011122334455', npwp: '03.112.445.7-011.000', bpjs: '0001 1122 3344 5',
      name: 'Fajar Ramadhan', email: 'fajar.ramadhan@nexa.co.id', phone: '+62 811 3344 556',
      role: 'Finance Controller', department: 'Finance', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Jakarta', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2018-04-23'), manager: 'Adrian Wibowo', grade: 'G7', salary: 45000000,
      currency: 'IDR', bank: 'BCA', account: '•••• 8890', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'peach',
    },
    {
      id: 'mel-009', nik: null, npwp: null, bpjs: null,
      name: 'Melati Kusuma', email: 'melati.kusuma@nexa.co.id', phone: '+62 812 6677 889',
      role: 'Customer Success Associate', department: 'Operations', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Surabaya', type: 'TETAP', status: 'ONBOARDING',
      joinDate: new Date('2026-11-18'), manager: 'Yoga Hartono', grade: 'G3', salary: 11500000,
      currency: 'IDR', bank: 'BCA', account: '•••• 5521', accountVerified: false, taxStatus: 'TK/0',
      photoUrl: null, tone: 'lime',
    },
    {
      id: 'yog-010', nik: '00016677889900', npwp: '61.223.889.4-432.000', bpjs: '0001 6677 8899 0',
      name: 'Yoga Hartono', email: 'yoga.hartono@nexa.co.id', phone: '+62 813 9900 112',
      role: 'Operations Supervisor', department: 'Operations', entity: 'PT Nexa Logistik Nusantara',
      country: 'Indonesia', location: 'Bekasi', type: 'KONTRAK', status: 'AKTIF',
      joinDate: new Date('2023-08-14'), manager: 'Fajar Ramadhan', grade: 'G3', salary: 9800000,
      currency: 'IDR', bank: 'BRI', account: '•••• 7712', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'sky',
    },
    {
      id: 'put-011', nik: '00013344556677', npwp: '77.001.223.8-013.000', bpjs: '0001 3344 5566 7',
      name: 'Putri Anindita', email: 'putri.anindita@nexa.co.id', phone: '+62 811 2233 447',
      role: 'Legal Counsel', department: 'Legal & Compliance', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Jakarta', type: 'TETAP', status: 'AKTIF',
      joinDate: new Date('2022-03-21'), manager: 'Fajar Ramadhan', grade: 'G6', salary: 32000000,
      currency: 'IDR', bank: 'Mandiri', account: '•••• 9903', accountVerified: true, taxStatus: 'TK/0',
      photoUrl: null, tone: 'mint',
    },
    {
      id: 'ari-012', nik: '00018899001122', npwp: '88.112.334.5-405.000', bpjs: '0001 8899 0011 2',
      name: 'Arif Setiawan', email: 'arif.setiawan@nexa.co.id', phone: '+62 895 1122 334',
      role: 'QA Engineer', department: 'Engineering', entity: 'PT Nexa Digital Indonesia',
      country: 'Indonesia', location: 'Bandung', type: 'MAGANG', status: 'OFFBOARDING',
      joinDate: new Date('2025-06-09'), lastDay: new Date('2026-11-30'), manager: 'Bagas Nugroho',
      grade: 'G2', salary: 6500000, currency: 'IDR', bank: 'BNI', account: '•••• 4408',
      accountVerified: true, taxStatus: 'TK/0', photoUrl: null, tone: 'peach',
    },
  ]

  for (const e of employees) {
    await prisma.employee.upsert({
      where: { id: e.id },
      update: {},
      create: e,
    })
    // Riwayat kerja awal
    await prisma.employmentHistory.create({
      data: {
        employeeId: e.id,
        effective: e.joinDate,
        inputDate: e.joinDate,
        title: e.role,
        detail: 'Perekrutan awal',
        reason: 'HIRE',
        actor: 'Sistem Seeding',
        grade: e.grade,
        salary: e.salary,
        entity: e.entity,
        department: e.department,
        position: e.role,
        type: e.type,
        status: e.status,
      },
    })
  }

  // Siklus payroll
  await prisma.payrollCycle.create({
    data: {
      id: 'PR-2026-11',
      period: 'November 2026',
      entityId,
      country: 'Indonesia',
      employees: 842,
      gross: 14820000000,
      net: 12140000000,
      tax: 1360000000,
      social: 420000000,
      currency: 'IDR',
      status: 'REVIEW_VARIANSI',
      progress: 76,
      anomalies: 3,
      variance: 1.8,
      cutoff: new Date('2026-11-25'),
      payDate: new Date('2026-11-28'),
    },
  })

  // Slip gaji contoh
  await prisma.payslip.create({
    data: {
      id: 'PS-2026-11-001',
      cycleId: 'PR-2026-11',
      employeeId: 'nad-001',
      period: 'November 2026',
      gross: 42000000,
      deduction: 6180000,
      net: 35820000,
      status: 'DRAFT',
    },
  })

  // Audit log awal
  await prisma.auditLog.create({
    data: {
      id: 'aud-001',
      at: new Date('2026-11-22T09:14:00Z'),
      actorId: 'usr-002',
      action: 'UBAH_KOMPONEN_GAJI',
      target: 'Bagas Nugroho',
      field: 'Bonus & komisi',
      before: 'Rp 0',
      after: 'Rp 12.700.000',
      reason: 'Bonus proyek Q4',
      ipAddress: '10.0.0.1',
      userAgent: 'Mozilla/5.0 (compatible; NEXA HR)',
    },
  })

  // Integrasi
  await prisma.integration.createMany({
    data: [
      { id: 'int-001', name: 'SSO / SCIM', vendor: 'Okta', status: 'TERHUBUNG', detail: 'SAML + provisioning otomatis' },
      { id: 'int-002', name: 'ERP / GL', vendor: 'SAP S/4HANA', status: 'TERHUBUNG', detail: 'Jurnal payroll per cost center' },
      { id: 'int-003', name: 'Bank payroll', vendor: 'BCA · Mandiri', status: 'TERHUBUNG', detail: 'File pembayaran + rekonsiliasi' },
      { id: 'int-004', name: 'Provider payroll lokal', vendor: 'Singapore Payroll Co', status: 'UJI_COBA', detail: 'Hybrid payroll Fase 2' },
      { id: 'int-005', name: 'E-signature', vendor: 'Privy', status: 'TERHUBUNG', detail: 'Kontrak & paklaring' },
      { id: 'int-006', name: 'Data warehouse', vendor: 'BigQuery', status: 'TERHUBUNG', detail: 'Feed analitik harian' },
    ],
  })

  // Leave types
  await prisma.leaveType.createMany({
    data: [
      { id: 'lt-001', name: 'Cuti tahunan', entityId, annualDays: 16, rules: JSON.stringify({ accrual: '16/tahun', carryOver: 5, expiry: '31 Maret tahun berikutnya' }) },
      { id: 'lt-002', name: 'Cuti sakit', entityId, annualDays: 12, rules: JSON.stringify({ requiresDoctorNote: true, minDays: 2 }) },
      { id: 'lt-003', name: 'Cuti melahirkan', entityId, annualDays: 90, rules: JSON.stringify({}) },
      { id: 'lt-004', name: 'Cuti keagamaan', entityId, annualDays: 4, rules: JSON.stringify({}) },
      { id: 'lt-005', name: 'Cuti tanpa gaji', entityId, annualDays: 0, rules: JSON.stringify({ unpaid: true }) },
    ],
  })

  // Leave requests contoh
  await prisma.leaveRequest.createMany({
    data: [
      { id: 'LV-1042', employeeId: 'riz-004', typeId: 'lt-001', startDate: new Date('2026-11-24'), endDate: new Date('2026-11-26'), days: 3, status: 'MENUNJU', approverId: 'usr-008', note: null },
      { id: 'LV-1041', employeeId: 'yog-010', typeId: 'lt-004', startDate: new Date('2026-12-02'), endDate: new Date('2026-12-06'), days: 5, status: 'MENUNJU', approverId: 'usr-003', note: null },
      { id: 'LV-1040', employeeId: 'mel-009', typeId: 'lt-005', startDate: new Date('2026-12-01'), endDate: new Date('2026-12-03'), days: 3, status: 'MENUNJU', approverId: 'usr-008', note: 'Saldo tahunan habis' },
    ],
  })

  // Leave balances
  await prisma.leaveBalance.createMany({
    data: [
      { id: 'lb-001', employeeId: 'nad-001', typeId: 'lt-001', used: 4, total: 16 },
      { id: 'lb-002', employeeId: 'nad-001', typeId: 'lt-002', used: 1, total: 12 },
      { id: 'lb-003', employeeId: 'nad-001', typeId: 'lt-003', used: 0, total: 90 },
      { id: 'lb-004', employeeId: 'nad-001', typeId: 'lt-004', used: 2, total: 4 },
    ],
  })

  // Salary bands
  await prisma.salaryBand.createMany({
    data: [
      { id: 'sb-001', grade: 'G7', title: 'Head / Director', min: 38000000, mid: 45000000, max: 56000000, headcount: 6, compa: 1.02 },
      { id: 'sb-002', grade: 'G6', title: 'Senior Manager', min: 28000000, mid: 34000000, max: 42000000, headcount: 18, compa: 0.98 },
      { id: 'sb-003', grade: 'G5', title: 'Manager', min: 20000000, mid: 25000000, max: 31000000, headcount: 42, compa: 0.96 },
      { id: 'sb-004', grade: 'G4', title: 'Senior Specialist', min: 13000000, mid: 17000000, max: 21000000, headcount: 186, compa: 0.94 },
      { id: 'sb-005', grade: 'G3', title: 'Specialist', min: 9000000, mid: 11500000, max: 14000000, headcount: 324, compa: 0.91 },
      { id: 'sb-006', grade: 'G2', title: 'Associate', min: 6000000, mid: 7500000, max: 9000000, headcount: 208, compa: 0.89 },
    ],
  })

  // Benefits
  await prisma.benefit.createMany({
    data: [
      { id: 'bn-001', name: 'Asuransi kesehatan', provider: 'Prudential', coverage: 'Karyawan + 2 dependen', enrolled: 1180, eligible: 1284 },
      { id: 'bn-002', name: 'BPJS Kesehatan & TK', provider: 'BPJS', coverage: 'Wajib statutory', enrolled: 1284, eligible: 1284 },
      { id: 'bn-003', name: 'Dana pensiun', provider: 'Manulife', coverage: 'Kontribusi 5% + 5%', enrolled: 742, eligible: 1102 },
      { id: 'bn-004', name: 'Tunjangan kesehatan fleksibel', provider: 'Nexa Flex', coverage: 'Rp 6 jt / tahun', enrolled: 486, eligible: 1284 },
    ],
  })

  // Workflow config
  await prisma.workflowConfig.create({
    data: {
      id: 'wf-001',
      name: 'Approval cuti standar',
      entityId,
      version: 1,
      conditions: JSON.stringify({ slaDays: 2, autoEscalate: true }),
      sla: '2 hari kerja',
      escalation: 'HRBP',
      environment: 'production',
      approved: true,
    },
  })

  console.log('✅ Seeding selesai.')
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
