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
