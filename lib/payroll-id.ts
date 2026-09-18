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

export function calculatePayroll(input: PayrollCalculationInput): PayrollCalculationResult {
  const {
    grossSalary,
    maritalStatus = 'BELUM_KAWIN',
    dependents = 0,
    hasNPWP = true,
    yearsOfService = 0,
    lastMonthSalary = grossSalary,
    isTHR = false,
    isPesangon = false,
  } = input

  // --- PPh 21 ---
  const taxKey = maritalStatus === 'KAWIN' ? 'K' : 'TK'
  const ptkpKey = `${taxKey}/${Math.min(dependents, 3)}` as keyof typeof PTKP_TABLE
  const ptkp = PTKP_TABLE[ptkpKey] ?? PTKP_TABLE['TK/0']

  // Non-TKP: if no NPWP, tax rate is increased by 20% (PP 64/2024 pasal 14)
  const npwpMultiplier = hasNPWP ? 1 : 1.2

  // Monthly PKP = (gross - PTKP/12) * 12, then calculate annual tax
  const monthlyPKP = Math.max(0, grossSalary - ptkp / 12)
  const annualPKP = monthlyPKP * 12

  let annualTax = 0
  for (const bracket of PPH21_BRACKETS) {
    if (annualPKP > bracket.min) {
      const taxableInBracket = Math.min(annualPKP, bracket.max) - bracket.min
      annualTax += taxableInBracket * bracket.rate + bracket.baseTax
    }
  }
  annualTax = Math.max(0, annualTax * npwpMultiplier)
  const monthlyPPh21 = Math.round(annualTax / 12)

  // --- BPJS Kesehatan ---
  const iupKesehatan = Math.min(grossSalary, BPJS_KESEHATAN_MAX_IUP)
  const bpjsKesehatanTotal = Math.round(iupKesehatan * BPJS_KESEHATAN_RATE)
  const bpjsKesehatanEmployee = Math.round(iupKesehatan * BPJS_KESEHATAN_EMPLOYEE_SHARE)

  // --- BPJS Ketenagakerjaan ---
  const iupJP = Math.min(grossSalary, BPJS_JP_MAX_IUP)
  const iupJHT = Math.min(grossSalary, BPJS_JHT_MAX_IUP)

  const jkk = Math.round(grossSalary * BPJS_JKK_RATE) // employer only
  const jkm = Math.round(grossSalary * BPJS_JKM_RATE) // employer only
  const jpTotal = Math.round(iupJP * BPJS_JP_RATE) // 2% employer + 1% employee
  const jpEmployee = Math.round(iupJP * 0.01)
  const jpEmployer = Math.round(iupJP * 0.02)
  const jhtTotal = Math.round(iupJHT * BPJS_JHT_RATE) // 2% employer + 1% employee
  const jhtEmployee = Math.round(iupJHT * 0.01)
  const jhtEmployer = Math.round(iupJHT * 0.02)

  const bpjsKetenagakerjaan = {
    jkk,
    jkm,
    jp: jpTotal,
    jht: jhtTotal,
    employeeShare: jpEmployee + jhtEmployee,
    employerShare: jkk + jkm + jpEmployer + jhtEmployer,
  }

  // --- THR ---
  const thr = isTHR && yearsOfService >= 1 ? Math.round(lastMonthSalary) : 0

  // --- Pesangon (PP 35/2021) ---
  let pesangon = 0
  if (isPesangon) {
    if (yearsOfService < 1) pesangon = Math.round(lastMonthSalary * 1)
    else if (yearsOfService < 2) pesangon = Math.round(lastMonthSalary * 2)
    else if (yearsOfService < 3) pesangon = Math.round(lastMonthSalary * 3)
    else if (yearsOfService < 4) pesangon = Math.round(lastMonthSalary * 4)
    else pesangon = Math.round(lastMonthSalary * 5)
  }

  // --- Total deductions ---
  const employeeDeductions = monthlyPPh21 + bpjsKesehatanEmployee + bpjsKetenagakerjaan.employeeShare
  const totalDeductions = employeeDeductions

  const net = grossSalary - totalDeductions

  const breakdown: Array<{ label: string; amount: number; type: 'earning' | 'deduction' }> = [
    { label: 'Gaji pokok', amount: grossSalary, type: 'earning' as const },
    ...(thr > 0 ? [{ label: 'THR', amount: thr, type: 'earning' as const }] : []),
    ...(pesangon > 0 ? [{ label: 'Pesangon', amount: pesangon, type: 'earning' as const }] : []),
    { label: 'PPh 21', amount: monthlyPPh21, type: 'deduction' as const },
    { label: 'BPJS Kesehatan', amount: bpjsKesehatanEmployee, type: 'deduction' as const },
    { label: 'BPJS JHT', amount: jhtEmployee, type: 'deduction' as const },
    { label: 'BPJS JP', amount: jpEmployee, type: 'deduction' as const },
  ]

  return {
    gross: grossSalary + thr + pesangon,
    pph21: monthlyPPh21,
    bpjsKesehatan: bpjsKesehatanTotal,
    bpjsKetenagakerjaan,
    thr,
    pesangon,
    totalDeductions,
    net,
    breakdown,
  }
}

export function calculatePTKP(maritalStatus: 'KAWIN' | 'BELUM_KAWIN', dependents: number): number {
  const taxKey = maritalStatus === 'KAWIN' ? 'K' : 'TK'
  const key = `${taxKey}/${Math.min(dependents, 3)}` as keyof typeof PTKP_TABLE
  return PTKP_TABLE[key] ?? PTKP_TABLE['TK/0']
}

export function calculatePPh21Annual(annualPKP: number, hasNPWP: boolean): number {
  let annualTax = 0
  for (const bracket of PPH21_BRACKETS) {
    if (annualPKP > bracket.min) {
      const taxableInBracket = Math.min(annualPKP, bracket.max) - bracket.min
      annualTax += taxableInBracket * bracket.rate + bracket.baseTax
    }
  }
  const npwpMultiplier = hasNPWP ? 1 : 1.2
  return Math.round(Math.max(0, annualTax) * npwpMultiplier)
}

export function formatCurrency(value: number, currency = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}
