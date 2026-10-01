import { CalendarDays, Check, Plus, Umbrella, Wallet, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import {
  Avatar,
  Cell,
  Donut,
  Pill,
  Progress,
  Row,
  StatCard,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import { getDepartments, getLeaveTypes, getEmployees } from '@/lib/server-data'
import { formatDate } from '@/lib/format'

const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default async function LeavePage() {
  const [leaveTypes, departments, employees] = await Promise.all([
    getLeaveTypes(),
    getDepartments(),
    getEmployees({ page: 1, limit: 100 }),
  ])

  const leaveRequests = employees.data.map((emp, index) => ({
    id: `LV-${1000 + index}`,
    employee: emp.name,
    type: leaveTypes[0]?.name ?? 'Cuti tahunan',
    start: '2026-11-24',
    end: '2026-11-26',
    days: 3,
    status: 'Menunggu' as const,
    approver: emp.manager ?? 'Atasan',
  }))

  const leaveBalances = [
    { label: 'Cuti tahunan', used: 4, total: 16, tone: 'lime' as const },
    { label: 'Cuti sakit', used: 1, total: 12, tone: 'sky' as const },
    { label: 'Cuti melahirkan', used: 0, total: 90, tone: 'lilac' as const },
    { label: 'Cuti keagamaan', used: 2, total: 4, tone: 'peach' as const },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Waktu & cuti · Kebijakan per entitas
          </>
        }
        title="Cuti & saldo"
        description="Akrual, proration, carry-over, dan kedaluwarsa dengan aturan konfigurabel. Cuti tanpa gaji otomatis mengalir ke payroll."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Ajukan cuti
          </button>
        }
      />

      <ModuleTabs
        items={[
          { href: '/kehadiran', label: 'Kehadiran' },
          { href: '/cuti', label: 'Cuti & saldo' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo tahunan saya" value="12 hari" hint="Dari 16 hari · reset 1 Jan" icon={<Umbrella className="size-4" />} />
        <StatCard label="Menunggu approval" value="3" hint="SLA 2 hari kerja" icon={<CalendarDays className="size-4" />} />
        <StatCard label="Disetujui bulan ini" value="18" hint="Total 64 hari cuti" icon={<Check className="size-4" />} />
        <StatCard label="Liabilitas cuti" value="Rp 1,2 M" hint="Untuk laporan Finance" icon={<Wallet className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Permintaan cuti"
            hint="Tim People & Culture · November–Desember 2026"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                {leaveRequests.length} permintaan
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Karyawan', 'Jenis', 'Periode', 'Hari', 'Approver', 'Status', '']}
              minWidth="min-w-[820px]"
            >
              {leaveRequests.map((request) => {
                const person = employees.data.find((employee) => employee.name === request.employee)
                return (
                  <Row key={request.id}>
                    <Cell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={request.employee} tone={(person?.tone as any) ?? 'mint'} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-medium text-ink">{request.employee}</p>
                          <p className="truncate text-[10px] text-muted">{request.id}</p>
                        </div>
                      </div>
                    </Cell>
                    <Cell>
                      <p className="text-[11.5px] text-ink-soft">{request.type}</p>
                    </Cell>
                    <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                      {formatDate(request.start, { day: '2-digit', month: 'short' })} –{' '}
                      {formatDate(request.end, { day: '2-digit', month: 'short' })}
                    </Cell>
                    <Cell className="text-[11.5px] text-ink-soft">{request.days}</Cell>
                    <Cell className="text-[11.5px] text-ink-soft">{request.approver}</Cell>
                    <Cell>
                      <StatusPill status={request.status} />
                    </Cell>
                    <Cell className="w-20">
                      {request.status === 'Menunggu' ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Setujui cuti ${request.employee}`}
                            className="focus-ring grid size-7 place-items-center rounded-full bg-ink text-lime"
                          >
                            <Check className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Tolak cuti ${request.employee}`}
                            className="focus-ring grid size-7 place-items-center rounded-full border border-white/80 bg-white/70 text-ink-soft"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted">—</span>
                      )}
                    </Cell>
                  </Row>
                )
              })}
            </Table>
          </div>
          <div className="mt-3 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
            Saldo tidak cukup? Sistem menolak atau menawarkan sisa sebagai cuti tanpa gaji sesuai kebijakan entitas, lengkap
            dengan estimasi dampak ke gaji.
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Saldo cuti saya" hint="Periode 2026 · efektif 1 Jan" />
            <div className="mt-4 flex items-center gap-4">
              <Donut value={75} size={92} strokeWidth={9} label={<span className="text-[15px]">12<span className="text-[9px] text-muted">/16</span></span>} />
              <div className="space-y-1.5 text-[11px]">
                <p className="flex items-center gap-1.5 text-ink-soft">
                  <span className="size-2 rounded-full bg-lime-deep" /> Terpakai 4 hari
                </p>
                <p className="flex items-center gap-1.5 text-ink-soft">
                  <span className="size-2 rounded-full bg-ink/10" /> Sisa 12 hari
                </p>
                <p className="text-[10px] text-muted">Carry-over maks. 5 hari</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {leaveBalances.map((balance) => (
                <div key={balance.label}>
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-soft">{balance.label}</span>
                    <span className="text-muted">
                      {balance.total - balance.used}/{balance.total}
                    </span>
                  </div>
                  <Progress
                    value={((balance.total - balance.used) / balance.total) * 100}
                    tone={balance.tone === 'lime' ? 'lime' : balance.tone === 'sky' ? 'sky' : 'mint'}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Kebijakan cuti" hint="PT Nexa Digital Indonesia" />
            <ul className="mt-3 space-y-2 text-[10.5px] leading-relaxed text-ink-soft">
              <li className="rounded-2xl border border-white/70 bg-white/50 p-2.5">
                Akrual 16 hari/tahun, proration untuk karyawan baru, kedaluwarsa 31 Maret tahun berikutnya.
              </li>
              <li className="rounded-2xl border border-white/70 bg-white/50 p-2.5">
                Cuti sakit &gt; 2 hari wajib lampiran surat dokter dengan akses terbatas.
              </li>
              <li className="rounded-2xl border border-white/70 bg-white/50 p-2.5">
                Pencairan sisa cuti hanya pada offboarding, dihitung ke final pay.
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Kalender tim"
            hint="November 2026 · deteksi bentrok otomatis"
            action={
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-sky" /> Cuti
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-lilac" /> Menunggu
                </span>
              </div>
            }
          />
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weekdays.map((day) => (
              <div key={day} className="pb-1 text-center text-[10px] font-medium tracking-[0.08em] text-muted uppercase">
                {day}
              </div>
            ))}
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`offset-${index}`}
                aria-hidden
                className="min-h-[58px] rounded-xl border border-white/40 bg-white/20"
              />
            ))}
            {Array.from({ length: 30 }).map((_, index) => {
              const day = index + 1
              const isToday = day === 22
              return (
                <div
                  key={day}
                  className={`min-h-[58px] rounded-xl border p-1.5 ${
                    isToday ? 'border-lime-deep/50 bg-lime/40' : 'border-white/70 bg-white/45'
                  }`}
                >
                  <p className={`text-[10.5px] font-medium ${isToday ? 'text-ink' : 'text-ink-soft'}`}>{day}</p>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHead title="Liabilitas cuti" hint="Untuk Finance · per entitas" />
          <div className="mt-3 space-y-2">
            {departments.slice(0, 3).map((dept) => (
              <SubPanel key={dept.id}>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-ink">{dept.name}</p>
                  <p className="text-[11px] font-semibold text-ink">Rp 1,02 M</p>
                </div>
                <p className="mt-0.5 text-[10px] text-muted">1.842 hari akumulasi</p>
              </SubPanel>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            Dihitung dari saldo per 22 Nov 2026 dengan tarif gaji harian masing-masing karyawan.
          </p>
        </Panel>
      </div>
    </div>
  )
}
