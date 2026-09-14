export type Tone = 'mint' | 'lilac' | 'peach' | 'sky' | 'lime'

export type Employee = {
  id: string
  name: string
  role: string
  department: string
  entity: string
  country: string
  location: string
  type: 'Tetap' | 'Kontrak' | 'Magang' | 'Kontraktor'
  status: 'Aktif' | 'Cuti' | 'Onboarding' | 'Offboarding'
  joinDate: string
  manager: string
  email: string
  phone: string
  grade: string
  salary: number
  currency: string
  bank: string
  account: string
  npwp: string
  bpjs: string
  tone: Tone
}

export const employees: Employee[] = [
  {
    id: 'nad-001',
    name: 'Nadia Prameswari',
    role: 'Head of People',
    department: 'People & Culture',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Jakarta',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2019-03-04',
    manager: 'Fajar Ramadhan',
    email: 'nadia.prameswari@nexa.co.id',
    phone: '+62 811 2044 118',
    grade: 'G7',
    salary: 42000000,
    currency: 'IDR',
    bank: 'BCA',
    account: '•••• 4412',
    npwp: '09.254.771.3-407.000',
    bpjs: '0001 2345 6789 0',
    tone: 'lime',
  },
  {
    id: 'bag-002',
    name: 'Bagas Nugroho',
    role: 'Engineering Manager',
    department: 'Engineering',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Jakarta',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2020-07-13',
    manager: 'Nadia Prameswari',
    email: 'bagas.nugroho@nexa.co.id',
    phone: '+62 812 8890 221',
    grade: 'G6',
    salary: 38500000,
    currency: 'IDR',
    bank: 'Mandiri',
    account: '•••• 7781',
    npwp: '07.881.220.4-011.000',
    bpjs: '0001 9988 1122 3',
    tone: 'mint',
  },
  {
    id: 'sin-003',
    name: 'Sinta Maharani',
    role: 'Payroll Specialist',
    department: 'Finance Operations',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Jakarta',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2021-01-11',
    manager: 'Fajar Ramadhan',
    email: 'sinta.maharani@nexa.co.id',
    phone: '+62 813 5566 902',
    grade: 'G4',
    salary: 14200000,
    currency: 'IDR',
    bank: 'BNI',
    account: '•••• 2204',
    npwp: '12.004.556.1-014.000',
    bpjs: '0001 4455 6677 8',
    tone: 'peach',
  },
  {
    id: 'riz-004',
    name: 'Rizky Pratama',
    role: 'Product Designer',
    department: 'Product',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Bandung',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2022-05-02',
    manager: 'Nadia Prameswari',
    email: 'rizky.pratama@nexa.co.id',
    phone: '+62 857 2201 774',
    grade: 'G4',
    salary: 16800000,
    currency: 'IDR',
    bank: 'BCA',
    account: '•••• 9012',
    npwp: '31.220.887.2-405.000',
    bpjs: '0001 7788 9900 1',
    tone: 'lilac',
  },
  {
    id: 'ayu-005',
    name: 'Ayu Lestari',
    role: 'Talent Acquisition Lead',
    department: 'People & Culture',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Jakarta',
    type: 'Tetap',
    status: 'Cuti',
    joinDate: '2020-11-16',
    manager: 'Nadia Prameswari',
    email: 'ayu.lestari@nexa.co.id',
    phone: '+62 811 7788 330',
    grade: 'G5',
    salary: 24000000,
    currency: 'IDR',
    bank: 'Mandiri',
    account: '•••• 3345',
    npwp: '45.667.112.9-017.000',
    bpjs: '0001 2233 4455 6',
    tone: 'sky',
  },
  {
    id: 'dim-006',
    name: 'Dimas Saputra',
    role: 'Data Engineer',
    department: 'Engineering',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Yogyakarta',
    type: 'Kontrak',
    status: 'Aktif',
    joinDate: '2024-02-19',
    manager: 'Bagas Nugroho',
    email: 'dimas.saputra@nexa.co.id',
    phone: '+62 878 1122 445',
    grade: 'G4',
    salary: 19500000,
    currency: 'IDR',
    bank: 'BRI',
    account: '•••• 6678',
    npwp: '52.889.001.6-541.000',
    bpjs: '0001 5566 7788 9',
    tone: 'mint',
  },
  {
    id: 'cla-007',
    name: 'Clara Wijaya',
    role: 'HR Business Partner',
    department: 'People & Culture',
    entity: 'Nexa Singapore Pte Ltd',
    country: 'Singapura',
    location: 'Singapore',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2021-09-06',
    manager: 'Nadia Prameswari',
    email: 'clara.wijaya@nexa.sg',
    phone: '+65 8123 4455',
    grade: 'G5',
    salary: 7800,
    currency: 'SGD',
    bank: 'DBS',
    account: '•••• 1180',
    npwp: '—',
    bpjs: '—',
    tone: 'lilac',
  },
  {
    id: 'faj-008',
    name: 'Fajar Ramadhan',
    role: 'Finance Controller',
    department: 'Finance',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Jakarta',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2018-04-23',
    manager: 'Adrian Wibowo',
    email: 'fajar.ramadhan@nexa.co.id',
    phone: '+62 811 3344 556',
    grade: 'G7',
    salary: 45000000,
    currency: 'IDR',
    bank: 'BCA',
    account: '•••• 8890',
    npwp: '03.112.445.7-011.000',
    bpjs: '0001 1122 3344 5',
    tone: 'peach',
  },
  {
    id: 'mel-009',
    name: 'Melati Kusuma',
    role: 'Customer Success Associate',
    department: 'Operations',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Surabaya',
    type: 'Tetap',
    status: 'Onboarding',
    joinDate: '2026-11-18',
    manager: 'Yoga Hartono',
    email: 'melati.kusuma@nexa.co.id',
    phone: '+62 812 6677 889',
    grade: 'G3',
    salary: 11500000,
    currency: 'IDR',
    bank: 'BCA',
    account: '•••• 5521',
    npwp: '—',
    bpjs: '—',
    tone: 'lime',
  },
  {
    id: 'yog-010',
    name: 'Yoga Hartono',
    role: 'Operations Supervisor',
    department: 'Operations',
    entity: 'PT Nexa Logistik Nusantara',
    country: 'Indonesia',
    location: 'Bekasi',
    type: 'Kontrak',
    status: 'Aktif',
    joinDate: '2023-08-14',
    manager: 'Fajar Ramadhan',
    email: 'yoga.hartono@nexa.co.id',
    phone: '+62 813 9900 112',
    grade: 'G3',
    salary: 9800000,
    currency: 'IDR',
    bank: 'BRI',
    account: '•••• 7712',
    npwp: '61.223.889.4-432.000',
    bpjs: '0001 6677 8899 0',
    tone: 'sky',
  },
  {
    id: 'put-011',
    name: 'Putri Anindita',
    role: 'Legal Counsel',
    department: 'Legal & Compliance',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Jakarta',
    type: 'Tetap',
    status: 'Aktif',
    joinDate: '2022-03-21',
    manager: 'Fajar Ramadhan',
    email: 'putri.anindita@nexa.co.id',
    phone: '+62 811 2233 447',
    grade: 'G6',
    salary: 32000000,
    currency: 'IDR',
    bank: 'Mandiri',
    account: '•••• 9903',
    npwp: '77.001.223.8-013.000',
    bpjs: '0001 3344 5566 7',
    tone: 'mint',
  },
  {
    id: 'ari-012',
    name: 'Arif Setiawan',
    role: 'QA Engineer',
    department: 'Engineering',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    location: 'Bandung',
    type: 'Magang',
    status: 'Offboarding',
    joinDate: '2025-06-09',
    manager: 'Bagas Nugroho',
    email: 'arif.setiawan@nexa.co.id',
    phone: '+62 895 1122 334',
    grade: 'G2',
    salary: 6500000,
    currency: 'IDR',
    bank: 'BNI',
    account: '•••• 4408',
    npwp: '88.112.334.5-405.000',
    bpjs: '0001 8899 0011 2',
    tone: 'peach',
  },
]

export type PayrollCycle = {
  id: string
  period: string
  entity: string
  country: string
  employees: number
  gross: number
  net: number
  tax: number
  social: number
  currency: string
  status: 'Draft' | 'Review variansi' | 'Menunggu persetujuan' | 'Terkunci' | 'Dibayar'
  progress: number
  anomalies: number
  variance: number
  cutoff: string
  payDate: string
}

export const payrollCycles: PayrollCycle[] = [
  {
    id: 'PR-2026-11',
    period: 'November 2026',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    employees: 842,
    gross: 14820000000,
    net: 12140000000,
    tax: 1360000000,
    social: 420000000,
    currency: 'IDR',
    status: 'Review variansi',
    progress: 76,
    anomalies: 3,
    variance: 1.8,
    cutoff: '2026-11-25',
    payDate: '2026-11-28',
  },
  {
    id: 'PR-2026-11-SG',
    period: 'November 2026',
    entity: 'Nexa Singapore Pte Ltd',
    country: 'Singapura',
    employees: 96,
    gross: 1240000,
    net: 1080000,
    tax: 96000,
    social: 70000,
    currency: 'SGD',
    status: 'Menunggu persetujuan',
    progress: 92,
    anomalies: 0,
    variance: 0.4,
    cutoff: '2026-11-24',
    payDate: '2026-11-29',
  },
  {
    id: 'PR-2026-10',
    period: 'Oktober 2026',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    employees: 838,
    gross: 14610000000,
    net: 11980000000,
    tax: 1330000000,
    social: 415000000,
    currency: 'IDR',
    status: 'Dibayar',
    progress: 100,
    anomalies: 0,
    variance: 0.9,
    cutoff: '2026-10-25',
    payDate: '2026-10-28',
  },
  {
    id: 'PR-2026-10-MY',
    period: 'Oktober 2026',
    entity: 'Nexa Malaysia Sdn Bhd',
    country: 'Malaysia',
    employees: 64,
    gross: 412000,
    net: 361000,
    tax: 31000,
    social: 20000,
    currency: 'MYR',
    status: 'Terkunci',
    progress: 100,
    anomalies: 0,
    variance: 1.1,
    cutoff: '2026-10-24',
    payDate: '2026-10-28',
  },
  {
    id: 'PR-2026-12',
    period: 'Desember 2026',
    entity: 'PT Nexa Digital Indonesia',
    country: 'Indonesia',
    employees: 0,
    gross: 0,
    net: 0,
    tax: 0,
    social: 0,
    currency: 'IDR',
    status: 'Draft',
    progress: 12,
    anomalies: 0,
    variance: 0,
    cutoff: '2026-12-18',
    payDate: '2026-12-23',
  },
]

export const payrollComponents = [
  { label: 'Gaji pokok', amount: 9840000000, type: 'Penghasilan' },
  { label: 'Tunjangan tetap', amount: 2140000000, type: 'Penghasilan' },
  { label: 'Lembur & shift', amount: 486000000, type: 'Penghasilan' },
  { label: 'Bonus & komisi', amount: 1180000000, type: 'Penghasilan' },
  { label: 'Retro pay (Okt–Nov)', amount: 124000000, type: 'Penghasilan' },
  { label: 'PPh 21', amount: 1360000000, type: 'Potongan' },
  { label: 'BPJS Kesehatan', amount: 168000000, type: 'Potongan' },
  { label: 'BPJS Ketenagakerjaan', amount: 252000000, type: 'Potongan' },
  { label: 'Pinjaman karyawan', amount: 96000000, type: 'Potongan' },
]

export const payrollVariance = [
  { name: 'Bagas Nugroho', component: 'Bonus & komisi', prev: 38500000, next: 51200000, delta: 33.0, reason: 'Bonus proyek Q4' },
  { name: 'Dimas Saputra', component: 'Retro pay', prev: 0, next: 4200000, delta: 100, reason: 'Kenaikan efektif 1 Okt' },
  { name: 'Yoga Hartono', component: 'Lembur & shift', prev: 1850000, next: 3120000, delta: 68.6, reason: 'Roster shift tambahan' },
  { name: 'Sinta Maharani', component: 'Gaji pokok', prev: 12800000, next: 14200000, delta: 10.9, reason: 'Promosi G3 → G4' },
  { name: 'Arif Setiawan', component: 'Final pay', prev: 6500000, next: 9100000, delta: 40.0, reason: 'Pencairan sisa cuti' },
]

export const payrollAnomalies = [
  {
    id: 'AN-01',
    severity: 'Tinggi',
    title: 'Net negatif terdeteksi',
    detail: 'Potongan pinjaman melebihi penghasilan bersih untuk 1 karyawan (NIK 0001 8899 0011 2).',
    owner: 'Sinta Maharani',
  },
  {
    id: 'AN-02',
    severity: 'Sedang',
    title: 'Rekening bank ganda',
    detail: '2 karyawan memakai nomor rekening yang sama dengan karyawan lain di entitas berbeda.',
    owner: 'Sinta Maharani',
  },
  {
    id: 'AN-03',
    severity: 'Rendah',
    title: 'Data pajak belum lengkap',
    detail: '3 karyawan baru belum memiliki NPWP. PPh 21 dihitung dengan tarif 20% lebih tinggi.',
    owner: 'Payroll Ops',
  },
]

export const glJournal = [
  { account: '6101 · Beban gaji', costCenter: 'CC-ENG', debit: 9840000000, credit: 0 },
  { account: '6102 · Beban tunjangan', costCenter: 'CC-OPS', debit: 2140000000, credit: 0 },
  { account: '2101 · Utang PPh 21', costCenter: 'CC-FIN', debit: 0, credit: 1360000000 },
  { account: '2102 · Utang BPJS', costCenter: 'CC-FIN', debit: 0, credit: 420000000 },
  { account: '1102 · Bank payroll', costCenter: 'CC-FIN', debit: 0, credit: 12140000000 },
]

export const approvalSteps = [
  { role: 'Payroll Specialist', name: 'Sinta Maharani', status: 'Selesai', at: '20 Nov 2026 · 14:02' },
  { role: 'Payroll Lead (maker-checker)', name: 'Fajar Ramadhan', status: 'Menunggu', at: 'Batas 24 Nov 2026' },
  { role: 'Finance Controller', name: 'Putri Anindita', status: 'Belum', at: 'Setelah payroll lead' },
  { role: 'Kunci periode & bayar', name: 'Sistem', status: 'Belum', at: '28 Nov 2026' },
]

export type LeaveRequest = {
  id: string
  employee: string
  type: string
  start: string
  end: string
  days: number
  status: 'Menunggu' | 'Disetujui' | 'Ditolak'
  approver: string
  note?: string
}

export const leaveRequests: LeaveRequest[] = [
  { id: 'LV-1042', employee: 'Rizky Pratama', type: 'Cuti tahunan', start: '2026-11-24', end: '2026-11-26', days: 3, status: 'Menunggu', approver: 'Bagas Nugroho' },
  { id: 'LV-1041', employee: 'Yoga Hartono', type: 'Cuti ayah', start: '2026-12-02', end: '2026-12-06', days: 5, status: 'Menunggu', approver: 'Fajar Ramadhan' },
  { id: 'LV-1040', employee: 'Melati Kusuma', type: 'Cuti tanpa gaji', start: '2026-12-01', end: '2026-12-03', days: 3, status: 'Menunggu', approver: 'Yoga Hartono', note: 'Saldo tahunan habis' },
  { id: 'LV-1039', employee: 'Ayu Lestari', type: 'Cuti tahunan', start: '2026-11-18', end: '2026-11-22', days: 5, status: 'Disetujui', approver: 'Nadia Prameswari' },
  { id: 'LV-1038', employee: 'Dimas Saputra', type: 'Sakit', start: '2026-11-20', end: '2026-11-20', days: 1, status: 'Disetujui', approver: 'Bagas Nugroho', note: 'Surat dokter terlampir' },
  { id: 'LV-1037', employee: 'Sinta Maharani', type: 'Cuti tahunan', start: '2026-12-08', end: '2026-12-09', days: 2, status: 'Disetujui', approver: 'Fajar Ramadhan' },
]

export const leaveBalances = [
  { label: 'Cuti tahunan', used: 4, total: 16, tone: 'lime' as const },
  { label: 'Cuti sakit', used: 1, total: 12, tone: 'sky' as const },
  { label: 'Cuti melahirkan', used: 0, total: 90, tone: 'lilac' as const },
  { label: 'Cuti keagamaan', used: 2, total: 4, tone: 'peach' as const },
]

export const attendanceToday = [
  { employee: 'Nadia Prameswari', clockIn: '08:02', clockOut: '—', location: 'Jakarta HQ', status: 'Hadir', hours: '6j 12m' },
  { employee: 'Bagas Nugroho', clockIn: '08:41', clockOut: '—', location: 'Remote', status: 'WFH', hours: '5j 33m' },
  { employee: 'Sinta Maharani', clockIn: '07:55', clockOut: '—', location: 'Jakarta HQ', status: 'Hadir', hours: '6j 19m' },
  { employee: 'Rizky Pratama', clockIn: '09:22', clockOut: '—', location: 'Bandung Hub', status: 'Terlambat', hours: '4j 52m' },
  { employee: 'Yoga Hartono', clockIn: '06:00', clockOut: '14:00', location: 'Bekasi DC', status: 'Hadir', hours: '8j 00m' },
  { employee: 'Dimas Saputra', clockIn: '—', clockOut: '—', location: '—', status: 'Absen', hours: '0j' },
]

export const shifts = [
  { name: 'Shift Pagi', time: '06:00 – 14:00', people: 128, tone: 'lime' as const },
  { name: 'Shift Siang', time: '14:00 – 22:00', people: 96, tone: 'sky' as const },
  { name: 'Shift Malam', time: '22:00 – 06:00', people: 42, tone: 'lilac' as const },
  { name: 'Office Hours', time: '08:00 – 17:00', people: 612, tone: 'mint' as const },
]

export const overtimeRequests = [
  { employee: 'Yoga Hartono', date: '2026-11-21', hours: 3, reason: 'Stock opname gudang', status: 'Menunggu' },
  { employee: 'Dimas Saputra', date: '2026-11-20', hours: 2.5, reason: 'Rilis pipeline data', status: 'Disetujui' },
  { employee: 'Rizky Pratama', date: '2026-11-19', hours: 1.5, reason: 'Uji usability', status: 'Disetujui' },
]

export const attendanceCorrections = [
  { employee: 'Rizky Pratama', date: '2026-11-18', issue: 'Lupa clock-out', fix: 'Clock-out 18:10', status: 'Menunggu' },
  { employee: 'Melati Kusuma', date: '2026-11-19', issue: 'Perangkat absensi offline', fix: 'Absen manual + lampiran', status: 'Menunggu' },
]

export const onboardingTasks = [
  { label: 'Profil & data pribadi', owner: 'Karyawan', done: true },
  { label: 'Dokumen kontrak & e-sign', owner: 'HR Ops', done: true },
  { label: 'Data bank & pajak', owner: 'Karyawan', done: true },
  { label: 'Akses IT & perangkat', owner: 'IT', done: false },
  { label: 'Sesi orientasi tim', owner: 'Manager', done: false },
]

export const onboardingPeople = [
  { name: 'Melati Kusuma', role: 'Customer Success Associate', start: '2026-11-18', progress: 60, entity: 'PT Nexa Digital Indonesia' },
  { name: 'Rangga Aditya', role: 'Backend Engineer', start: '2026-11-25', progress: 35, entity: 'PT Nexa Digital Indonesia' },
  { name: 'Vina Oktaviani', role: 'Finance Analyst', start: '2026-12-01', progress: 20, entity: 'PT Nexa Digital Indonesia' },
]

export const offboardingPeople = [
  { name: 'Arif Setiawan', role: 'QA Engineer', lastDay: '2026-11-30', progress: 45, clearance: '2/5', finalPay: 'Terpicu 30 Nov' },
  { name: 'Hendra Gunawan', role: 'Sales Executive', lastDay: '2026-12-05', progress: 20, clearance: '1/5', finalPay: 'Menunggu' },
]

export const requisitions = [
  { id: 'REQ-221', role: 'Senior Backend Engineer', dept: 'Engineering', entity: 'Indonesia', headcount: 3, stage: 'Interview', days: 18, budget: 'Rp 28–36 jt' },
  { id: 'REQ-219', role: 'Payroll Analyst', dept: 'Finance Ops', entity: 'Indonesia', headcount: 1, stage: 'Offer', days: 24, budget: 'Rp 14–18 jt' },
  { id: 'REQ-217', role: 'HR Business Partner', dept: 'People', entity: 'Singapura', headcount: 1, stage: 'Sourcing', days: 9, budget: 'SGD 7–9 rb' },
  { id: 'REQ-214', role: 'Warehouse Supervisor', dept: 'Operations', entity: 'Indonesia', headcount: 2, stage: 'Interview', days: 31, budget: 'Rp 9–12 jt' },
]

export const pipeline = [
  {
    stage: 'Sourcing',
    tone: 'sky' as const,
    candidates: [
      { name: 'Aditya Rahman', role: 'Senior Backend Engineer', score: 72, source: 'LinkedIn' },
      { name: 'Nabila Zahra', role: 'HR Business Partner', score: 68, source: 'Referral' },
    ],
  },
  {
    stage: 'Screening',
    tone: 'lilac' as const,
    candidates: [
      { name: 'Bimo Prasetyo', role: 'Senior Backend Engineer', score: 81, source: 'Job board' },
      { name: 'Kirana Dewi', role: 'Payroll Analyst', score: 77, source: 'LinkedIn' },
    ],
  },
  {
    stage: 'Interview',
    tone: 'peach' as const,
    candidates: [
      { name: 'Rangga Aditya', role: 'Senior Backend Engineer', score: 88, source: 'Referral' },
      { name: 'Salsa Aulia', role: 'Warehouse Supervisor', score: 84, source: 'Job board' },
    ],
  },
  {
    stage: 'Offer',
    tone: 'lime' as const,
    candidates: [{ name: 'Vina Oktaviani', role: 'Payroll Analyst', score: 91, source: 'LinkedIn' }],
  },
]

export const interviews = [
  { time: '09:00', name: 'Rangga Aditya', role: 'Senior Backend Engineer', panel: 'Bagas + Dimas', mode: 'Google Meet' },
  { time: '11:30', name: 'Salsa Aulia', role: 'Warehouse Supervisor', panel: 'Yoga Hartono', mode: 'Onsite Bekasi' },
  { time: '14:00', name: 'Kirana Dewi', role: 'Payroll Analyst', panel: 'Sinta + Fajar', mode: 'Google Meet' },
  { time: '16:30', name: 'Bimo Prasetyo', role: 'Senior Backend Engineer', panel: 'Bagas Nugroho', mode: 'Google Meet' },
]

export const okrs = [
  { title: 'Turunkan waktu payroll close 50%', owner: 'Finance Ops', progress: 68, keyResults: '3 dari 4 KR on track', tone: 'lime' as const },
  { title: 'Adopsi self-service 85% karyawan', owner: 'People & Culture', progress: 74, keyResults: 'MAU 1.092 / 1.284', tone: 'mint' as const },
  { title: 'Zero temuan audit mayor', owner: 'Legal & Compliance', progress: 52, keyResults: '2 kontrol belum diuji', tone: 'peach' as const },
  { title: 'Time-to-hire di bawah 30 hari', owner: 'Talent', progress: 61, keyResults: 'Rata-rata 34 hari', tone: 'sky' as const },
]

export const nineBox = [
  { row: 'Potensi tinggi', cells: ['Bintang', 'Bintang', 'Potensi'] },
  { row: 'Potensi sedang', cells: ['Konsisten', 'Inti', 'Perlu coaching'] },
  { row: 'Potensi rendah', cells: ['Perlu perbaikan', 'Perlu perbaikan', 'Risiko'] },
]

export const salaryBands = [
  { grade: 'G7', title: 'Head / Director', min: 38000000, mid: 45000000, max: 56000000, headcount: 6, compa: 1.02 },
  { grade: 'G6', title: 'Senior Manager', min: 28000000, mid: 34000000, max: 42000000, headcount: 18, compa: 0.98 },
  { grade: 'G5', title: 'Manager', min: 20000000, mid: 25000000, max: 31000000, headcount: 42, compa: 0.96 },
  { grade: 'G4', title: 'Senior Specialist', min: 13000000, mid: 17000000, max: 21000000, headcount: 186, compa: 0.94 },
  { grade: 'G3', title: 'Specialist', min: 9000000, mid: 11500000, max: 14000000, headcount: 324, compa: 0.91 },
  { grade: 'G2', title: 'Associate', min: 6000000, mid: 7500000, max: 9000000, headcount: 208, compa: 0.89 },
]

export const benefits = [
  { name: 'Asuransi kesehatan', provider: 'Prudential', coverage: 'Karyawan + 2 dependen', enrolled: 1180, eligible: 1284, tone: 'mint' as const },
  { name: 'BPJS Kesehatan & TK', provider: 'BPJS', coverage: 'Wajib statutory', enrolled: 1284, eligible: 1284, tone: 'lime' as const },
  { name: 'Dana pensiun', provider: 'Manulife', coverage: 'Kontribusi 5% + 5%', enrolled: 742, eligible: 1102, tone: 'sky' as const },
  { name: 'Tunjangan kesehatan fleksibel', provider: 'Nexa Flex', coverage: 'Rp 6 jt / tahun', enrolled: 486, eligible: 1284, tone: 'lilac' as const },
]

export const expenses = [
  { id: 'EXP-8841', employee: 'Rizky Pratama', category: 'Perjalanan dinas', amount: 2450000, date: '2026-11-19', status: 'Menunggu', ocr: true },
  { id: 'EXP-8839', employee: 'Yoga Hartono', category: 'Transport shift', amount: 640000, date: '2026-11-18', status: 'Disetujui', ocr: true },
  { id: 'EXP-8836', employee: 'Clara Wijaya', category: 'Representasi klien', amount: 1850000, date: '2026-11-17', status: 'Menunggu', ocr: false },
  { id: 'EXP-8830', employee: 'Dimas Saputra', category: 'Peralatan kerja', amount: 3200000, date: '2026-11-14', status: 'Dibayar', ocr: true },
]

export const tickets = [
  { id: 'HD-5521', subject: 'Slip gaji Oktober tidak muncul di self-service', category: 'Payroll', priority: 'Tinggi', status: 'Terbuka', assignee: 'Sinta Maharani', sla: '2j 14m' },
  { id: 'HD-5518', subject: 'Perubahan rekening bank butuh verifikasi', category: 'Data pribadi', priority: 'Tinggi', status: 'Dalam proses', assignee: 'HR Ops', sla: '5j 02m' },
  { id: 'HD-5512', subject: 'Saldo cuti tidak sesuai setelah promosi', category: 'Cuti', priority: 'Sedang', status: 'Dalam proses', assignee: 'Clara Wijaya', sla: '1h 20m' },
  { id: 'HD-5508', subject: 'Permintaan surat keterangan kerja', category: 'Dokumen', priority: 'Rendah', status: 'Selesai', assignee: 'HR Ops', sla: 'Selesai' },
  { id: 'HD-5501', subject: 'Akses SSO gagal setelah ganti perangkat', category: 'IT & akses', priority: 'Sedang', status: 'Selesai', assignee: 'IT Admin', sla: 'Selesai' },
]

export const approvals = [
  { id: 'AP-901', type: 'Cuti tahunan', requester: 'Rizky Pratama', detail: '24–26 Nov 2026 · 3 hari', amount: null, submitted: '2 jam lalu', sla: '6 jam', tone: 'lime' as const },
  { id: 'AP-900', type: 'Perubahan gaji', requester: 'Sinta Maharani', detail: 'Promosi G3 → G4 · efektif 1 Des', amount: 14200000, submitted: '4 jam lalu', sla: '1 hari', tone: 'peach' as const },
  { id: 'AP-898', type: 'Lembur', requester: 'Yoga Hartono', detail: '21 Nov · 3 jam · stock opname', amount: null, submitted: '6 jam lalu', sla: '1 hari', tone: 'sky' as const },
  { id: 'AP-897', type: 'Reimbursement', requester: 'Rizky Pratama', detail: 'Perjalanan dinas Bandung–Jakarta', amount: 2450000, submitted: '1 hari lalu', sla: '2 hari', tone: 'lilac' as const },
  { id: 'AP-895', type: 'Requisition', requester: 'Bagas Nugroho', detail: 'Senior Backend Engineer · 3 headcount', amount: null, submitted: '2 hari lalu', sla: 'Lewat SLA', tone: 'mint' as const },
]

export const auditLog = [
  { at: '2026-11-22 09:14', actor: 'Sinta Maharani', action: 'Ubah komponen gaji', target: 'Bagas Nugroho', field: 'Bonus & komisi', before: 'Rp 0', after: 'Rp 12.700.000', reason: 'Bonus proyek Q4' },
  { at: '2026-11-22 08:52', actor: 'Fajar Ramadhan', action: 'Lihat data gaji', target: 'Payroll PR-2026-11', field: 'Gross total', before: '—', after: 'Rp 14,82 M', reason: 'Review variansi' },
  { at: '2026-11-21 17:40', actor: 'Nadia Prameswari', action: 'Setujui cuti', target: 'Ayu Lestari', field: 'Status', before: 'Menunggu', after: 'Disetujui', reason: 'Approval manajer' },
  { at: '2026-11-21 15:02', actor: 'IT Admin', action: 'Nonaktifkan akses', target: 'Arif Setiawan', field: 'SSO status', before: 'Aktif', after: 'Nonaktif', reason: 'Offboarding 30 Nov' },
  { at: '2026-11-21 11:26', actor: 'Clara Wijaya', action: 'Ubah data pribadi', target: 'Dimas Saputra', field: 'Nomor telepon', before: '+62 878 1122 400', after: '+62 878 1122 445', reason: 'Permintaan karyawan' },
  { at: '2026-11-20 16:11', actor: 'Sinta Maharani', action: 'Impor variabel payroll', target: 'PR-2026-11', field: 'Lembur', before: '0 baris', after: '128 baris', reason: 'Cut-off lembur Okt' },
  { at: '2026-11-20 10:03', actor: 'Fajar Ramadhan', action: 'Ubah aturan payroll', target: 'PPh 21 · v2026.4', field: 'Batas lapisan', before: 'Rp 500 jt', after: 'Rp 500 jt (tanpa perubahan)', reason: 'Sinkronisasi PMK' },
  { at: '2026-11-19 14:48', actor: 'Putri Anindita', action: 'Ekspor laporan', target: 'Laporan statutory PPh 21', field: 'Periode', before: '—', after: 'Okt 2026', reason: 'Pelaporan pajak' },
]

export const integrations = [
  { name: 'SSO / SCIM', vendor: 'Okta', status: 'Terhubung', detail: 'SAML + provisioning otomatis', tone: 'lime' as const },
  { name: 'ERP / GL', vendor: 'SAP S/4HANA', status: 'Terhubung', detail: 'Jurnal payroll per cost center', tone: 'lime' as const },
  { name: 'Bank payroll', vendor: 'BCA · Mandiri', status: 'Terhubung', detail: 'File pembayaran + rekonsiliasi', tone: 'lime' as const },
  { name: 'Provider payroll lokal', vendor: 'Singapore Payroll Co', status: 'Uji coba', detail: 'Hybrid payroll Fase 2', tone: 'peach' as const },
  { name: 'E-signature', vendor: 'Privy', status: 'Terhubung', detail: 'Kontrak & paklaring', tone: 'lime' as const },
  { name: 'Data warehouse', vendor: 'BigQuery', status: 'Terhubung', detail: 'Feed analitik harian', tone: 'lime' as const },
]

export const workflowSteps = [
  { step: '1', name: 'Pengajuan', detail: 'Karyawan mengajukan lewat self-service', owner: 'Karyawan' },
  { step: '2', name: 'Validasi aturan', detail: 'Saldo cuti, kebijakan entitas, deteksi bentrok', owner: 'Sistem' },
  { step: '3', name: 'Persetujuan manajer', detail: 'SLA 2 hari kerja, eskalasi ke HRBP', owner: 'Manajer' },
  { step: '4', name: 'Sinkron payroll', detail: 'Cuti tanpa gaji & pencairan sisa cuti', owner: 'Payroll' },
]

export const reports = [
  { name: 'Headcount & biaya tenaga kerja', owner: 'People Analytics', updated: 'Harian', format: 'Dashboard' },
  { name: 'Rekonsiliasi payroll vs GL', owner: 'Finance', updated: 'Bulanan', format: 'XLSX' },
  { name: 'Laporan statutory PPh 21', owner: 'Payroll Ops', updated: 'Bulanan', format: 'CSV' },
  { name: 'Liabilitas cuti', owner: 'Finance', updated: 'Bulanan', format: 'XLSX' },
  { name: 'Turnover & attrition', owner: 'HRBP', updated: 'Kuartalan', format: 'Dashboard' },
  { name: 'Audit akses data gaji', owner: 'Compliance', updated: 'Mingguan', format: 'PDF' },
]

export const headcountTrend = [1042, 1068, 1094, 1102, 1128, 1156, 1174, 1198, 1216, 1240, 1262, 1284]
export const payrollTrend = [12.4, 12.8, 13.1, 13.4, 13.6, 13.9, 14.1, 14.3, 14.4, 14.6, 14.7, 14.82]
export const attendanceTrend = [92, 94, 91, 95, 93, 96, 94, 92, 95, 97, 94, 96]
