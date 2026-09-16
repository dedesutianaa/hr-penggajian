import { z } from 'zod'

export const employeeSchema = z.object({
  nik: z.string().nullable().optional(),
  npwp: z.string().nullable().optional(),
  bpjs: z.string().nullable().optional(),
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().nullable().optional(),
  role: z.string().min(1, 'Role wajib diisi'),
  department: z.string().min(1, 'Departemen wajib diisi'),
  entity: z.string().min(1, 'Entitas wajib diisi'),
  country: z.string().min(1, 'Negara wajib diisi'),
  location: z.string().min(1, 'Lokasi wajib diisi'),
  type: z.enum(['TETAP', 'KONTRAK', 'MAGANG', 'KONTRAKTOR']),
  status: z.enum(['AKTIF', 'CUTI', 'ONBOARDING', 'OFFBOARDING']),
  joinDate: z.string().datetime({ message: 'Tanggal bergabung tidak valid' }).optional(),
  lastDay: z.string().datetime().nullable().optional(),
  manager: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  salary: z.number().nonnegative().nullable().optional(),
  currency: z.string().min(3).max(3).optional(),
  bank: z.string().nullable().optional(),
  account: z.string().nullable().optional(),
  accountVerified: z.boolean().optional(),
  taxStatus: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  tone: z.string().nullable().optional(),
})

export const payrollCycleSchema = z.object({
  period: z.string().min(1, 'Periode wajib diisi'),
  entityId: z.string().min(1, 'Entitas wajib diisi'),
  country: z.string().min(1, 'Negara wajib diisi'),
  employees: z.number().nonnegative().optional(),
  gross: z.number().nonnegative().optional(),
  net: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  social: z.number().nonnegative().optional(),
  currency: z.string().min(3).max(3).optional(),
  status: z.enum(['DRAFT', 'REVIEW_VARIANSI', 'MENUNJU_PERSETUJUAN', 'TERKUNCI', 'DIBAYAR']).optional(),
  progress: z.number().nonnegative().max(100).optional(),
  anomalies: z.number().nonnegative().optional(),
  variance: z.number().optional(),
  cutoff: z.string().datetime().nullable().optional(),
  payDate: z.string().datetime().nullable().optional(),
})

export const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, 'Karyawan wajib dipilih'),
  typeId: z.string().min(1, 'Jenis cuti wajib dipilih'),
  startDate: z.string().datetime({ message: 'Tanggal mulai tidak valid' }),
  endDate: z.string().datetime({ message: 'Tanggal selesai tidak valid' }),
  days: z.number().nonnegative().optional(),
  status: z.enum(['MENUNJU', 'DISETUJUI', 'DITOLAK']).optional(),
  approverId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
})

export const entitySchema = z.object({
  name: z.string().min(2, 'Nama entitas minimal 2 karakter'),
  country: z.string().min(2, 'Negara minimal 2 karakter'),
  currency: z.string().min(3).max(3).optional(),
  headcount: z.number().nonnegative().optional(),
  payrollMode: z.string().optional(),
  status: z.string().optional(),
})

export const departmentSchema = z.object({
  name: z.string().min(2, 'Nama departemen minimal 2 karakter'),
  entityId: z.string().min(1, 'Entitas wajib dipilih'),
  headcount: z.number().nonnegative().optional(),
})

export const positionSchema = z.object({
  title: z.string().min(2, 'Judul posisi minimal 2 karakter'),
  grade: z.string().min(1, 'Grade wajib diisi'),
  departmentId: z.string().min(1, 'Departemen wajib dipilih'),
  entityId: z.string().min(1, 'Entitas wajib dipilih'),
  isActive: z.boolean().optional(),
  headcount: z.number().nonnegative().optional(),
  vacant: z.number().nonnegative().optional(),
})
