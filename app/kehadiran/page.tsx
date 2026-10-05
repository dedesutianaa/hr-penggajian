import { Clock, MapPin, Plus, Timer, UserCheck, UserX, Wifi } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead } from '@/components/ui/panel'
import {
  Avatar,
  Cell,
  Pill,
  Progress,
  Row,
  StatCard,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import { getAttendanceRecords, getEmployees, getOvertimeRequests, getShifts } from '@/lib/server-data'
import { formatDate, formatNumber } from '@/lib/format'

export default async function AttendancePage() {
  const [employees, attendance, overtime, shifts] = await Promise.all([
    getEmployees({ page: 1, limit: 100 }),
    getAttendanceRecords(undefined, new Date().toISOString().split('T')[0]),
    getOvertimeRequests(),
    getShifts(),
  ])

  const byStatus = employees.data.reduce(
    (acc, emp) => {
      const rec = attendance.find((a) => a.employeeId === emp.id)
      const status = rec?.status ?? 'ABSEN'
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const total = employees.data.length
  const hadir = byStatus['HADIR'] || 0
  const wfh = byStatus['WFH'] || 0
  const terlambat = byStatus['TERLAMBAT'] || 0
  const absen = byStatus['ABSEN'] || 0

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Waktu & kehadiran · {new Date().toLocaleDateString('id-ID')}
          </>
        }
        title="Kehadiran & shift"
        description="Pencatatan kehadiran web, mobile, dan perangkat absensi — dengan koreksi ber-approval dan alur lembur ke payroll."
        actions={
          <>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <Plus className="size-3.5" /> Koreksi absen
            </button>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Clock className="size-3.5" /> Clock in sekarang
            </button>
          </>
        }
      />

      <ModuleTabs
        items={[
          { href: '/kehadiran', label: 'Kehadiran' },
          { href: '/cuti', label: 'Cuti & saldo' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Hadir" value={formatNumber(hadir)} delta="+1%" hint={`${Math.round((hadir / total) * 100)}% dari headcount`} icon={<UserCheck className="size-4" />} />
        <StatCard label="Remote / WFH" value={formatNumber(wfh)} hint="Hybrid policy · 3 hari kantor" icon={<Wifi className="size-4" />} />
        <StatCard label="Terlambat" value={formatNumber(terlambat)} hint="Ambang 15 menit dari jadwal" icon={<Timer className="size-4" />} />
        <StatCard label="Absen" value={formatNumber(absen)} hint="Belum mengajukan cuti" icon={<UserX className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Absensi hari ini"
            hint="Zona waktu Asia/Jakarta · sinkron perangkat absensi"
            action={
              <Pill variant="lime" className="px-2 py-1 text-[10px]">
                Live
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Karyawan', 'Clock in', 'Clock out', 'Lokasi', 'Jam kerja', 'Status']}
              minWidth="min-w-[720px]"
            >
              {employees.data.slice(0, 10).map((emp) => {
                const rec = attendance.find((a) => a.employeeId === emp.id)
                return (
                  <Row key={emp.id}>
                    <Cell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={emp.name} tone={(emp.tone as any) ?? 'mint'} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-medium text-ink">{emp.name}</p>
                          <p className="truncate text-[10px] text-muted">{emp.role}</p>
                        </div>
                      </div>
                    </Cell>
                    <Cell className="font-mono text-[11.5px] text-ink-soft">{rec?.clockIn ?? '—'}</Cell>
                    <Cell className="font-mono text-[11.5px] text-ink-soft">{rec?.clockOut ?? '—'}</Cell>
                    <Cell>
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-soft">
                        <MapPin className="size-3 text-muted" /> {rec?.location ?? '—'}
                      </span>
                    </Cell>
                    <Cell className="text-[11.5px] text-ink-soft">{rec?.hours ?? '—'}</Cell>
                    <Cell>
                      <StatusPill status={rec?.status ?? 'Absen'} />
                    </Cell>
                  </Row>
                )
              })}
            </Table>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/50 px-3 py-2 text-[10.5px] leading-relaxed text-muted">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            Geofence opsional per lokasi. Data lokasi adalah data pribadi — hanya aktif dengan dasar hukum dan pemberitahuan
            yang jelas.
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Shift & roster" hint="Hari ini · data aktif dari database" />
            <ul className="mt-3 space-y-2">
              {shifts.slice(0, 4).map((shift) => (
                <li key={shift.id} className="rounded-[18px] border border-white/70 bg-white/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-ink">{shift.name}</p>
                      <p className="text-[10.5px] text-muted">{shift.startTime} – {shift.endTime}</p>
                    </div>
                    <Pill variant="outline" className="px-2 py-1 text-[10px]">
                      {shift.headcount} orang
                    </Pill>
                  </div>
                  <Progress
                    value={(shift.headcount / Math.max(1, total)) * 100}
                    tone="mint"
                    className="mt-2"
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHead
              title="Lembur menunggu"
              hint="Mengalir ke payroll periode berjalan"
              action={
                <Pill variant="outline" className="px-2 py-1 text-[10px]">
                  {overtime.length}
                </Pill>
              }
            />
            <ul className="mt-3 space-y-2">
              {overtime.slice(0, 5).map((request) => {
                const person = employees.data.find((e) => e.id === request.employeeId)
                return (
                  <li
                    key={request.id}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium text-ink">{person?.name ?? '—'}</p>
                      <p className="truncate text-[10px] text-muted">
                        {formatDate(request.date)} · {request.hours} jam · {request.reason ?? '—'}
                      </p>
                    </div>
                    <StatusPill status={request.status} />
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
