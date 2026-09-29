import Image from 'next/image'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { Panel, PanelHead } from '@/components/ui/panel'
import {
  Avatar,
  CheckCircle,
  Delta,
  DotBars,
  Pill,
  Progress,
  SegmentedBar,
  Sparkline,
  StatusPill,
  Table,
  Row,
  Cell,
} from '@/components/ui/bits'
import { getEmployees, getLeaveRequestsByEmployee, getOnboardingTasks, getPayrollAnomalies, getPayrollCycles } from '@/lib/server-data'
import { formatIDR } from '@/lib/format'

const kpis = [
  { label: 'Headcount aktif', value: '1.284', delta: '+2%', hint: '12 negara · 15 entitas' },
  { label: 'Payroll November', value: '14,82 M', delta: '+1%', hint: 'Gross · 842 karyawan' },
  { label: 'Rekrutmen aktif', value: '24', delta: '+3%', hint: '186 kandidat di pipeline' },
]

const progressValues = [
  14, 20, 16, 26, 22, 30, 24, 34, 28, 38, 32, 42, 36, 46, 40, 50, 44, 54, 48, 58, 52, 62, 56, 66, 60,
  70, 64, 74, 68, 78, 72, 82, 76, 86, 80, 90,
]

export default async function DashboardPage() {
  const [employees, cycles, onboardingTasks, anomalies] = await Promise.all([
    getEmployees({ page: 1, limit: 1000 }),
    getPayrollCycles({ page: 1, limit: 12 }),
    getOnboardingTasks(),
    getPayrollAnomalies(),
  ])

  const spotlight = employees.data[0]
  const latestCycle = cycles.data[0]
  const grossPayroll = latestCycle?.gross ?? 0
  const netPayroll = latestCycle?.net ?? 0
  const taxPayroll = latestCycle?.tax ?? 0
  const payrollProgress = latestCycle?.progress ?? 0

  const teamLeave = employees.data
    .filter((e) => e.status === 'CUTI')
    .slice(0, 3)
    .map((e) => ({
      name: e.name,
      role: e.role,
      until: 'Cuti aktif',
      tone: (e.tone as any) ?? 'mint',
    }))

  const leaveRequestPromises = employees.data.slice(0, 5).map((emp) =>
    getLeaveRequestsByEmployee(emp.id).then((reqs) =>
      reqs.map((r) => ({
        id: r.id,
        employee: emp.name,
        type: r.typeName,
        start: r.startDate,
        end: r.endDate,
        status: r.status,
      }))
    )
  )
  const leaveRequestResults = await Promise.all(leaveRequestPromises)
  const recentLeaveRequests = leaveRequestResults.flat()

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Kamis, 22 November 2026 · Jakarta
          </div>
          <h1 className="mt-2 text-[30px] leading-[1.05] font-semibold tracking-[-0.04em] text-ink md:text-[40px]">
            Selamat pagi, Alex
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Payroll November berjalan 76%. Tiga anomali perlu diselesaikan sebelum cut-off 25 November.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(20,30,20,0.05)] transition-colors hover:bg-white"
            >
              <Plus className="size-3.5" /> Tambah widget
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft">
              <Calendar className="size-3.5" /> 01–30 Nov 2026
            </span>
            <Link
              href="/laporan"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              Buat laporan <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <dl className="flex flex-wrap items-end gap-x-8 gap-y-4 md:gap-x-12">
          {kpis.map((kpi) => (
            <div key={kpi.label}>
              <dd className="flex items-start gap-1.5">
                <span className="text-[34px] leading-none font-semibold tracking-[-0.045em] text-ink md:text-[42px]">
                  {kpi.value}
                </span>
                <Delta value={kpi.delta} className="mt-1" />
              </dd>
              <dt className="mt-1.5 text-[11px] font-medium text-ink-soft">{kpi.label}</dt>
              <p className="text-[10.5px] text-muted">{kpi.hint}</p>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="flex flex-col lg:col-span-4">
          <PanelHead
            title="Progres payroll"
            hint="Siklus PR-2026-11 · Indonesia"
            action={
              <Link
                href="/payroll/PR-2026-11"
                aria-label="Buka detail payroll"
                className="focus-ring grid size-8 place-items-center rounded-full border border-white/80 bg-white/70 text-ink-soft transition-colors hover:bg-white"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-4 flex items-end gap-2">
            <span className="text-[44px] leading-none font-semibold tracking-[-0.05em] text-ink">{payrollProgress}%</span>
            <Pill variant="lime" className="mb-1.5">
              On track
            </Pill>
          </div>
          <p className="mt-1 text-[11px] text-muted">{employees.data.length} karyawan dalam siklus terbaru</p>
          <div className="mt-5 h-24">
            <DotBars values={progressValues} className="h-full" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10.5px] text-muted">
            <span>01 Nov 2026</span>
            <span>30 Nov 2026</span>
          </div>
          <dl className="mt-auto grid grid-cols-3 gap-2 pt-4">
            {[
              { label: 'Gross', value: formatIDR(grossPayroll, { compact: true }) },
              { label: 'Net', value: formatIDR(netPayroll, { compact: true }) },
              { label: 'Pajak', value: formatIDR(taxPayroll, { compact: true }) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2">
                <dt className="text-[9.5px] tracking-[0.08em] text-muted uppercase">{item.label}</dt>
                <dd className="mt-0.5 text-[12px] font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel className="flex flex-col lg:col-span-3">
          <PanelHead
            title="Kehadiran hari ini"
            hint="1.102 dari 1.284 karyawan"
            action={
              <Link
                href="/kehadiran"
                aria-label="Buka kehadiran"
                className="focus-ring grid size-8 place-items-center rounded-full border border-white/80 bg-white/70 text-ink-soft transition-colors hover:bg-white"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-4 space-y-2">
            <div className="rounded-[20px] bg-lime p-4">
              <div className="flex items-center justify-between">
                <span className="grid size-7 place-items-center rounded-full bg-white/60 text-ink">
                  <Users className="size-3.5" />
                </span>
                <Delta value="+1%" />
              </div>
              <p className="mt-3 text-[30px] leading-none font-semibold tracking-[-0.04em]">86%</p>
              <p className="mt-1 text-[11px] font-medium text-ink/70">Onsite</p>
            </div>
            <div className="rounded-[20px] border border-white/80 bg-white/60 p-4">
              <div className="flex items-center justify-between">
                <span className="grid size-7 place-items-center rounded-full bg-ink text-lime">
                  <Clock className="size-3.5" />
                </span>
                <Delta value="+2%" />
              </div>
              <p className="mt-3 text-[30px] leading-none font-semibold tracking-[-0.04em]">14%</p>
              <p className="mt-1 text-[11px] font-medium text-muted">Remote / hybrid</p>
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between pt-3 text-[10px] text-muted">
            <span>23 terlambat</span>
            <span className="size-1 rounded-full bg-muted/40" />
            <span>12 absen</span>
            <span className="size-1 rounded-full bg-muted/40" />
            <span>84 WFH</span>
          </div>
        </Panel>

        <Panel className="flex flex-col lg:col-span-2">
          <PanelHead title="Sisa cut-off" hint="Tutup 25 Nov · 09.00" />
          <div className="mt-4 flex flex-1 flex-col items-center justify-center">
            <div className="relative grid size-[124px] place-items-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(15,18,14,0.08)" strokeWidth="6" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#0f120e"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="204 327"
                />
              </svg>
              <div className="text-center">
                <p className="text-[26px] leading-none font-semibold tracking-[-0.04em]">05.45</p>
                <p className="mt-1 text-[9px] tracking-[0.12em] text-muted uppercase">jam.menit</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                aria-label="Jeda hitung mundur"
                className="focus-ring grid size-8 place-items-center rounded-full border border-white/80 bg-white/70 text-ink-soft"
              >
                <Pause className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Mulai hitung mundur"
                className="focus-ring grid size-10 place-items-center rounded-full bg-ink text-white"
              >
                <Play className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Reset hitung mundur"
                className="focus-ring grid size-8 place-items-center rounded-full border border-white/80 bg-white/70 text-ink-soft"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>
          <Link
            href="/payroll/PR-2026-11"
            className="mt-auto flex items-center justify-between rounded-2xl border border-white/70 bg-white/50 px-3 py-2 text-[10px] text-muted transition-colors hover:bg-white/80"
          >
            <span>3 anomali terbuka</span>
            <ChevronRight className="size-3" />
          </Link>
        </Panel>

        <Panel className="lg:col-span-3">
          <PanelHead
            title="Onboarding"
            hint="3 dari 5 langkah selesai"
