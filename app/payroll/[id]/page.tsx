import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileSpreadsheet,
  Lock,
  Play,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Tabs } from '@/components/ui/tabs'
import {
  Cell,
  Pill,
  Progress,
  Row,
  StatCard,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import { getPayrollCycleById } from '@/lib/server-data'
import { formatDate, formatIDR, formatMoney, formatNumber } from '@/lib/format'

const timeline = [
  { label: 'Input variabel', date: '18 Nov 2026', state: 'done' },
  { label: 'Kalkulasi gross-to-net', date: '21 Nov 2026', state: 'done' },
  { label: 'Review variansi & anomali', date: '22–24 Nov 2026', state: 'current' },
  { label: 'Approval maker-checker', date: '24 Nov 2026', state: 'next' },
  { label: 'Kunci periode & bayar', date: '28 Nov 2026', state: 'next' },
]

export default async function PayrollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cycle = await getPayrollCycleById(id)
  if (!cycle) notFound()

  const earnings = [
    { label: 'Gaji pokok', amount: Math.round((cycle.gross ?? 0) * 0.66), type: 'Penghasilan' },
    { label: 'Tunjangan tetap', amount: Math.round((cycle.gross ?? 0) * 0.14), type: 'Penghasilan' },
    { label: 'Lembur & shift', amount: Math.round((cycle.gross ?? 0) * 0.03), type: 'Penghasilan' },
    { label: 'Bonus & komisi', amount: Math.round((cycle.gross ?? 0) * 0.08), type: 'Penghasilan' },
    { label: 'Retro pay', amount: Math.round((cycle.gross ?? 0) * 0.01), type: 'Penghasilan' },
  ]
  const deductions = [
    { label: 'PPh 21', amount: cycle.tax ?? 0, type: 'Potongan' },
    { label: 'BPJS Kesehatan', amount: Math.round((cycle.social ?? 0) * 0.4), type: 'Potongan' },
    { label: 'BPJS Ketenagakerjaan', amount: Math.round((cycle.social ?? 0) * 0.6), type: 'Potongan' },
    { label: 'Pinjaman karyawan', amount: Math.round((cycle.gross ?? 0) * 0.006), type: 'Potongan' },
  ]
  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0)
  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-4">
      <Link
        href="/payroll"
        className="focus-ring inline-flex items-center gap-1.5 rounded-full text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> Siklus payroll
      </Link>

      <Panel className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.03em] text-ink md:text-[28px]">
                Payroll {cycle.period}
              </h1>
              <StatusPill status={cycle.status} />
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {cycle.country} · {formatNumber(cycle.employees)} karyawan
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
              <span>ID {cycle.id}</span>
              <span>Cut-off {formatDate(cycle.cutoff)}</span>
              <span>Pembayaran {formatDate(cycle.payDate)}</span>
              <span>Mata uang {cycle.currency}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <Play className="size-3.5" /> Simulasi
            </button>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <FileSpreadsheet className="size-3.5" /> Ekspor bank
            </button>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Check className="size-3.5" /> Setujui payroll
            </button>
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-3 rounded-[22px] border border-[#e8c9a0]/60 bg-[#fdf1d6]/80 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/70 text-[#8a5a12]">
            <ShieldAlert className="size-4" />
          </span>
          <div>
            <p className="text-[12.5px] font-semibold text-[#6d4708]">Maker-checker: persetujuan Anda diblokir</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#8a5a12]">
              Anda mengubah komponen gaji 3 karyawan pada periode ini. Sesuai kontrol, payroll harus disetujui pengguna lain.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="focus-ring shrink-0 rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium text-white"
        >
          Minta persetujuan Fajar
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross" value={formatMoney(cycle.gross ?? 0, cycle.currency)} hint={`${formatNumber(cycle.employees)} karyawan`} />
        <StatCard label="Net" value={formatMoney(cycle.net ?? 0, cycle.currency)} hint="Setelah pajak & potongan" />
        <StatCard label="PPh 21" value={formatMoney(cycle.tax ?? 0, cycle.currency)} hint="Tarif efektif bulanan" />
        <StatCard label="BPJS" value={formatMoney(cycle.social ?? 0, cycle.currency)} hint="Kesehatan + Ketenagakerjaan" />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <Tabs
            items={[
              {
                id: 'ringkasan',
                label: 'Ringkasan',
                content: (
                  <div className="grid gap-3 md:grid-cols-2">
                    <SubPanel>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">Penghasilan</p>
                        <Pill variant="lime" className="px-2 py-0.5 text-[10px]">
                          {formatIDR(totalEarnings, { compact: true })}
                        </Pill>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {earnings.map((item) => (
                          <li key={item.label} className="flex items-center justify-between gap-2 text-[11.5px]">
                            <span className="text-ink-soft">{item.label}</span>
                            <span className="font-medium text-ink">{formatIDR(item.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </SubPanel>
                    <SubPanel>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">Potongan</p>
                        <Pill variant="outline" className="px-2 py-0.5 text-[10px]">
                          {formatIDR(totalDeductions, { compact: true })}
                        </Pill>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {deductions.map((item) => (
                          <li key={item.label} className="flex items-center justify-between gap-2 text-[11.5px]">
                            <span className="text-ink-soft">{item.label}</span>
                            <span className="font-medium text-ink">{formatIDR(item.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </SubPanel>
                    <div className="rounded-[20px] bg-ink p-4 text-white md:col-span-2">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] tracking-[0.12em] text-white/50 uppercase">Net payroll</p>
                          <p className="mt-1 text-[26px] leading-none font-semibold tracking-[-0.03em]">
                            {formatMoney(cycle.net ?? 0, cycle.currency)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10.5px] text-white/60">
                          <ShieldCheck className="size-3.5 text-lime" />
                          Dihitung ulang · versi aturan v2026.4
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'variansi',
                label: 'Variansi',
                badge: String(cycle.anomalies ?? 0),
                content: (
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Pill variant="lime" className="px-2.5 py-1 text-[10px]">
                        Variansi total +{cycle.variance ?? 0}%
                      </Pill>
                      <Pill variant="outline" className="px-2.5 py-1 text-[10px]">
                        Ambang review 10%
                      </Pill>
                    </div>
                    <Table
                      head={['Karyawan', 'Komponen', 'Sebelum', 'Sesudah', 'Delta', 'Alasan']}
                      minWidth="min-w-[720px]"
                    >
                      {[
                        { name: 'Bagas Nugroho', component: 'Bonus & komisi', prev: 38500000, next: 51200000, delta: 33.0, reason: 'Bonus proyek Q4' },
                        { name: 'Dimas Saputra', component: 'Retro pay', prev: 0, next: 4200000, delta: 100, reason: 'Kenaikan efektif 1 Okt' },
