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
          <div className="mt-4 flex items-end gap-2">
            <span className="text-[28px] leading-none font-semibold tracking-[-0.04em]">
              {formatIDR(monthlyGross, { compact: true })}
            </span>
            <Delta value="+1,8%" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Indonesia', value: 82, amount: 'Rp 15,1 M' },
              { label: 'Singapura', value: 12, amount: 'Rp 2,2 M' },
              { label: 'Malaysia', value: 6, amount: 'Rp 1,1 M' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-ink-soft">{item.label}</span>
                  <span className="font-medium text-ink">{item.amount}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/8">
                  <div
                    className={`h-full rounded-full ${item.value > 50 ? 'bg-ink' : item.value > 10 ? 'bg-[#8fbfa6]' : 'bg-lime'}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-14">
            <Sparkline values={cycles.map((c) => Number(c.gross) / 1e6).reverse()} className="h-full w-full" fill="rgba(217,244,91,0.4)" />
          </div>
        </Panel>

        <Panel className="lg:col-span-3">
          <PanelHead title="Turnover" hint="Per departemen · 12 bulan" />
          <ul className="mt-3 space-y-2.5">
            {turnover.map((item) => (
              <li key={item.dept}>
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-ink-soft">{item.dept}</span>
                  <span className="font-medium text-ink">{item.value}%</span>
                </div>
                <Progress value={item.value * 12} tone={item.value > 5 ? 'ink' : 'mint'} className="mt-1" />
                <p className="mt-0.5 text-[9px] text-muted">{item.people} karyawan keluar</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead title="Absensi & lembur" hint="Rata-rata 30 hari · per minggu" />
          <div className="mt-4 h-28">
            <Sparkline values={[attendanceRate, attendanceRate, attendanceRate, attendanceRate, attendanceRate, attendanceRate]} className="h-full w-full" fill="rgba(143,191,166,0.35)" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: 'Hadir', value: `${Math.round((hadir / Math.max(1, totalAttendance)) * 100)}%` },
              { label: 'Terlambat', value: `${Math.round((attendance.filter((a) => a.status === 'TERLAMBAT').length / Math.max(1, totalAttendance)) * 100)}%` },
              { label: 'Lembur', value: `${attendance.filter((a) => a.status === 'LEMBUR').length} orang` },
              { label: 'Absen', value: `${Math.round((attendance.filter((a) => a.status === 'ABSEN').length / Math.max(1, totalAttendance)) * 100)}%` },
            ].map((item) => (
              <SubPanel key={item.label}>
                <p className="text-[9.5px] tracking-[0.06em] text-muted uppercase">{item.label}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-ink">{item.value}</p>
              </SubPanel>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/50 px-3 py-2 text-[10px] leading-relaxed text-muted">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            Laporan mengikuti row-level security: manajer hanya melihat timnya, HRBP hanya cakupan entitasnya.
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Perpustakaan laporan" hint="Ekspor terjadwal & feed data warehouse" />
          <div className="mt-3">
            <Table head={['Laporan', 'Pemilik', 'Frekuensi', 'Format']} minWidth="min-w-[420px]">
              {reports.map((report) => (
                <Row key={report.name}>
                  <Cell>
                    <p className="text-[11.5px] font-medium text-ink">{report.name}</p>
                    <p className="text-[9.5px] text-muted">Diperbarui {report.updated.toLowerCase()}</p>
                  </Cell>
                  <Cell className="text-[10.5px] text-ink-soft">{report.owner}</Cell>
                  <Cell className="text-[10.5px] text-ink-soft">{report.updated}</Cell>
                  <Cell>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[9.5px] font-medium text-ink-soft">
                      <FileSpreadsheet className="size-3" /> {report.format}
                    </span>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
          <button
            type="button"
            className="focus-ring mt-3 flex w-full items-center justify-between rounded-full bg-ink px-3.5 py-2 text-[10.5px] font-medium text-white"
          >
            Buat laporan kustom
            <ArrowUpRight className="size-3" />
          </button>
        </Panel>
      </div>
    </div>
  )
}
