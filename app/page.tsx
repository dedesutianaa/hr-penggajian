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
            action={
              <Pill variant="lime" className="px-2 py-1 text-[10px]">
                3/5
              </Pill>
            }
          />
          <div className="mt-4">
            <SegmentedBar
              segments={[
                { value: 60, tone: 'lime' },
                { value: 25, tone: 'ink' },
                { value: 15, tone: 'muted' },
              ]}
            />
            <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
              <span>60% selesai</span>
              <span>10% berjalan</span>
              <span>30% belum</span>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5">
            {onboardingTasks.slice(0, 5).map((task, index) => (
              <li
                key={task.id}
                className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-ink/5 text-[10px] font-semibold text-ink-soft">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11.5px] font-medium text-ink">{task.label}</span>
                  <span className="block text-[10px] text-muted">{task.owner}</span>
                </span>
                <CheckCircle done={task.done} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="relative flex overflow-hidden p-0 lg:col-span-3">
          <div className="relative min-h-[300px] w-full flex-1">
            <Image
              src="/images/spotlight-employee.png"
              alt="Potret Nadia Prameswari, Head of People"
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
            <svg
              viewBox="0 0 200 200"
              className="absolute top-6 right-2 h-28 w-28 text-lime"
              fill="none"
              aria-hidden
            >
              <path
                d="M40 120c-18-30 6-70 44-72 34-2 58 22 52 48-6 26-40 34-58 18-14-13-6-34 12-36 20-2 30 18 22 34-10 20-38 26-58 18"
                stroke="currentColor"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-x-3 top-3 flex items-center justify-between">
              <Pill variant="light" className="bg-white/85 text-[10px]">
                Spotlight
              </Pill>
              <span className="grid size-7 place-items-center rounded-full bg-white/85 text-ink">
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="text-[17px] font-semibold tracking-[-0.02em]">{spotlight.name}</p>
              <p className="text-[11px] text-white/70">{spotlight.role} · {spotlight.location}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-full bg-lime px-2 py-0.5 text-[9.5px] font-semibold text-ink">
                  7 tahun
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9.5px] font-medium text-white backdrop-blur">
                  Top performer
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-6">
          <PanelHead
            title="Persetujuan terbaru"
            hint="Cuti, lembur, dan perubahan data tim"
            action={
              <Link
                href="/approval"
                aria-label="Buka inbox approval"
                className="focus-ring grid size-8 place-items-center rounded-full bg-lime text-ink transition-colors hover:bg-lime-deep"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-3">
            <Table head={['Karyawan', 'Tipe', 'Tanggal', 'Status']} minWidth="min-w-[520px]">
              {recentLeaveRequests.slice(0, 5).map((request) => {
                const person = employees.data.find((employee) => employee.name === request.employee)
                return (
                  <Row key={request.id}>
                    <Cell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={request.employee} tone={(person?.tone as any) ?? 'mint'} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-medium text-ink">{request.employee}</p>
                          <p className="truncate text-[10.5px] text-muted">{person?.role ?? 'Karyawan'}</p>
                        </div>
                      </div>
                    </Cell>
                    <Cell className="text-[12px] text-ink-soft">{request.type}</Cell>
                    <Cell className="text-[12px] text-ink-soft whitespace-nowrap">
                      {new Date(request.start).toISOString().slice(8, 10)}–{new Date(request.end).toISOString().slice(8, 10)} Nov
                    </Cell>
                    <Cell>
                      <StatusPill status={request.status} />
                    </Cell>
                  </Row>
                )
              })}
            </Table>
          </div>
        </Panel>

        <Panel className="lg:col-span-3">
          <PanelHead
            title="Perlu perhatian"
            hint="Anomali pra-payroll"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                3
              </Pill>
            }
          />
          <ul className="mt-3 space-y-2">
            {anomalies.slice(0, 3).map((anomaly) => (
              <li key={anomaly.id} className="rounded-[18px] border border-white/70 bg-white/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                    <AlertTriangle className="size-3.5 text-[#b4402f]" />
                    {anomaly.title}
                  </span>
                  <StatusPill status={anomaly.severity} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-[10.5px] leading-relaxed text-muted">{anomaly.detail ?? ''}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/payroll/PR-2026-11"
            className="mt-3 flex items-center justify-between rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium text-white"
          >
            Selesaikan sebelum cut-off
            <ChevronRight className="size-3.5" />
          </Link>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-5">
          <PanelHead
            title="Biaya tenaga kerja"
            hint="12 bulan terakhir · semua entitas"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                IDR
              </Pill>
            }
          />
          <div className="mt-4 flex items-end gap-2">
            <span className="text-[32px] leading-none font-semibold tracking-[-0.04em]">
              {formatIDR(14820000000, { compact: true })}
            </span>
            <Delta value="+1,8%" />
          </div>
          <p className="mt-1 text-[11px] text-muted">Gross payroll November · naik Rp 210 jt dari Oktober</p>
          <div className="mt-4 h-20">
            <Sparkline values={cycles.data.map((c) => Number(c.gross) / 1e6).reverse()} className="h-full w-full" />
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              { label: 'Indonesia', value: 82, amount: 'Rp 12,15 M', tone: 'bg-ink' },
              { label: 'Singapura', value: 12, amount: 'Rp 1,78 M', tone: 'bg-[#8fbfa6]' },
              { label: 'Malaysia', value: 6, amount: 'Rp 0,89 M', tone: 'bg-lime' },
            ].map((entity) => (
              <div key={entity.label} className="flex items-center gap-3">
                <span className="w-20 text-[11px] text-ink-soft">{entity.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
                  <div className={`h-full rounded-full ${entity.tone}`} style={{ width: `${entity.value}%` }} />
                </div>
                <span className="w-20 text-right text-[11px] font-medium text-ink">{entity.amount}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHead
            title="Menunggu persetujuan Anda"
            hint="SLA approval 2 hari kerja"
            action={
              <Link
                href="/approval"
                className="focus-ring inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-[10.5px] font-medium text-ink-soft"
              >
                Semua <ChevronRight className="size-3" />
              </Link>
            }
          />
          <ul className="mt-3 space-y-2">
            {recentLeaveRequests.slice(0, 3).map((approval) => (
              <li
                key={approval.id}
                className="flex items-center gap-2.5 rounded-[18px] border border-white/70 bg-white/50 p-2.5"
              >
                <Avatar name={approval.employee} tone="mint" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-ink">{approval.employee}</p>
                  <p className="truncate text-[10.5px] text-muted">
                    {approval.type} · {new Date(approval.start).toISOString().slice(8, 10)}–{new Date(approval.end).toISOString().slice(8, 10)} Nov
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Setujui ${approval.type} ${approval.employee}`}
                    className="focus-ring grid size-7 place-items-center rounded-full bg-ink text-lime transition-colors hover:bg-ink/85"
                  >
                    <Check className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Tolak ${approval.type} ${approval.employee}`}
                    className="focus-ring grid size-7 place-items-center rounded-full border border-white/80 bg-white/70 text-ink-soft transition-colors hover:bg-white"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2 rounded-[18px] bg-lime/50 px-3 py-2 text-[10.5px] text-ink-soft">
            <Wallet className="size-3.5" />
            1 approval melewati SLA — eskalasi ke HRBP.
          </div>
        </Panel>

        <Panel className="lg:col-span-3">
          <PanelHead title="Cuti & absen tim" hint="Hari ini" />
          <ul className="mt-3 space-y-2">
            {teamLeave.map((person) => (
              <li key={person.name} className="flex items-center gap-2.5">
                <Avatar name={person.name} tone={person.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-ink">{person.name}</p>
                  <p className="truncate text-[10.5px] text-muted">{person.role}</p>
                </div>
                <span className="text-[10px] whitespace-nowrap text-muted">{person.until}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-[18px] border border-white/70 bg-white/50 p-3">
            <div className="flex items-center justify-between text-[10.5px] text-muted">
              <span>Kehadiran 30 hari</span>
              <span className="font-semibold text-ink">96%</span>
            </div>
            <Progress value={96} tone="mint" className="mt-2" />
          <div className="mt-3 h-10">
            <Sparkline values={[96, 94, 95, 93, 96, 94]} className="h-full w-full" fill="rgba(143,191,166,0.35)" />
          </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
