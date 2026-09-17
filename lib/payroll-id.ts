export type PayrollCalculationInput = {
  grossSalary: number
  payFrequency?: 'monthly' | 'annual'
  maritalStatus?: 'KAWIN' | 'BELUM_KAWIN'
  dependents?: number
  hasNPWP?: boolean
  yearsOfService?: number
  lastMonthSalary?: number
  isTHR?: boolean
  isPesangon?: boolean
}

export type PayrollCalculationResult = {
  gross: number
  pph21: number
  bpjsKesehatan: number
  bpjsKetenagakerjaan: {
    jkk: number
    jkm: number
    jp: number
    jht: number
    employeeShare: number
    employerShare: number
  }
  thr: number
  pesangon: number
  totalDeductions: number
  net: number
  breakdown: Array<{ label: string; amount: number; type: 'earning' | 'deduction' }>
}

const PTKP_TABLE: Record<string, number> = {
  'TK/0': 54000000,
  'K/0': 58500000,
  'TK/1': 63000000,
  'K/1': 67500000,
  'TK/2': 67500000,
  'K/2': 72000000,
  'TK/3': 72000000,
  'K/3': 76500000,
}

// PPh 21 annual brackets (PP 64/2024) - PKP annual brackets
const PPH21_BRACKETS: Array<{ min: number; max: number; rate: number; baseTax: number }> = [
  { min: 0, max: 60000000, rate: 0.05, baseTax: 0 },
  { min: 60000000, max: 250000000, rate: 0.15, baseTax: 3000000 },
  { min: 250000000, max: 500000000, rate: 0.25, baseTax: 33000000 },
  { min: 500000000, max: 5000000000, rate: 0.30, baseTax: 98000000 },
  { min: 5000000000, max: Infinity, rate: 0.35, baseTax: 1498000000 },
]

// BPJS Kesehatan: 5% of salary, max IUP Rp 12,000,000
const BPJS_KESEHATAN_RATE = 0.05
const BPJS_KESEHATAN_MAX_IUP = 12000000
const BPJS_KESEHATAN_EMPLOYEE_SHARE = 0.01 // 1%

// BPJS Ketenagakerjaan rates (employer share unless noted)
const BPJS_JKK_RATE = 0.0024 // 0.24% (low risk)
const BPJS_JKM_RATE = 0.003 // 0.3%
const BPJS_JP_RATE = 0.03 // 3% total: 2% employer + 1% employee
const BPJS_JHT_RATE = 0.03 // 3% total: 2% employer + 1% employee
const BPJS_JP_MAX_IUP = 12000000
const BPJS_JHT_MAX_IUP = 8000000

