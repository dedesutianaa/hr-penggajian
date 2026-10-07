import { ArrowUpRight, Download, FileSpreadsheet, Lock, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Delta, Pill, Progress, Row, Sparkline, StatCard, Table } from '@/components/ui/bits'
import { getAttendanceRecords, getEmployees, getPayrollCycles } from '@/lib/server-data'
import { formatIDR, formatNumber } from '@/lib/format'

const reports = [
  { name: 'Headcount & biaya tenaga kerja', owner: 'People Analytics', updated: 'Harian', format: 'Dashboard' },
  { name: 'Rekonsiliasi payroll vs GL', owner: 'Finance', updated: 'Bulanan', format: 'XLSX' },
  { name: 'Laporan statutory PPh 21', owner: 'Payroll Ops', updated: 'Bulanan', format: 'CSV' },
  { name: 'Liabilitas cuti', owner: 'Finance', updated: 'Bulanan', format: 'XLSX' },
  { name: 'Turnover & attrition', owner: 'HRBP', updated: 'Kuartalan', format: 'Dashboard' },
  { name: 'Audit akses data gaji', owner: 'Compliance', updated: 'Mingguan', format: 'PDF' },
]

const turnover = [
  { dept: 'Operations', value: 6.4, people: 12 },
  { dept: 'Engineering', value: 3.8, people: 9 },
  { dept: 'People & Culture', value: 2.9, people: 3 },
  { dept: 'Finance', value: 2.1, people: 2 },
  { dept: 'Product', value: 1.8, people: 1 },
]

export default async function ReportsPage() {
  const [{ data: employees }, { data: cycles }, attendance] = await Promise.all([
    getEmployees({ page: 1, limit: 1000 }),
    getPayrollCycles({ page: 1, limit: 12 }),
    getAttendanceRecords(),
  ])

  const headcount = employees.length
  const latestCycle = cycles[0]
  const monthlyGross = latestCycle?.gross ?? 0
  const hadir = attendance.filter((a) => a.status === 'HADIR').length
  const totalAttendance = attendance.length
  const attendanceRate = totalAttendance > 0 ? Math.round((hadir / totalAttendance) * 100) : 0
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Analitik · Row-level security aktif
          </>
        }
        title="Analitik & laporan"
        description="Headcount, biaya tenaga kerja, turnover, absensi, dan lembur. Manajer hanya melihat timnya, HRBP hanya cakupannya."
        actions={
          <>
            <label className="relative">
              <span className="sr-only">Periode laporan</span>
              <select className="focus-ring appearance-none rounded-full border border-white/80 bg-white/70 py-2 pr-8 pl-3.5 text-xs font-medium text-ink-soft">
                <option>12 bulan terakhir</option>
                <option>Kuartal ini</option>
                <option>Bulan ini</option>
              </select>
            </label>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Download className="size-3.5" /> Ekspor
            </button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Headcount" value={formatNumber(headcount)} delta="+2%" hint="Semua entitas · data real-time" icon={<Users className="size-4" />} />
        <StatCard label="Biaya tenaga kerja" value={formatIDR(monthlyGross, { compact: true })} delta="+1,8%" hint="Gross bulanan siklus terbaru" icon={<Wallet className="size-4" />} />
        <StatCard label="Turnover 12 bulan" value="4,2%" delta="-0,3%" hint="Target di bawah 6%" icon={<TrendingDown className="size-4" />} />
        <StatCard label="Kehadiran" value={`${attendanceRate}%`} delta="+1%" hint="Rata-rata 30 hari" icon={<TrendingUp className="size-4" />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-5">
          <PanelHead title="Tren headcount" hint="12 bulan · termasuk kontrak" action={<Pill variant="outline" className="px-2 py-1 text-[10px]">+242</Pill>} />
          <div className="mt-4 flex items-end gap-2">
            <span className="text-[32px] leading-none font-semibold tracking-[-0.04em]">{formatNumber(headcount)}</span>
            <Delta value="+2%" />
          </div>
          <div className="mt-4 h-24">
            <Sparkline values={[headcount, headcount, headcount, headcount, headcount, headcount]} className="h-full w-full" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted">
            <span>Des 2025</span>
            <span>Nov 2026</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Tetap', count: employees.filter((e) => e.type === 'TETAP').length },
              { label: 'Kontrak', count: employees.filter((e) => e.type === 'KONTRAK').length },
              { label: 'Magang', count: employees.filter((e) => e.type === 'MAGANG').length },
            ].map((item) => (
              <SubPanel key={item.label}>
                <p className="text-[9.5px] tracking-[0.06em] text-muted uppercase">{item.label}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-ink">{formatNumber(item.count)}</p>
              </SubPanel>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Biaya tenaga kerja" hint="Per entitas · November 2026" />
