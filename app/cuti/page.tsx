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
