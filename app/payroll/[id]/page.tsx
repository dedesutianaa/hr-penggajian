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
                        { name: 'Yoga Hartono', component: 'Lembur & shift', prev: 1850000, next: 3120000, delta: 68.6, reason: 'Roster shift tambahan' },
                      ].map((row) => (
                        <Row key={`${row.name}-${row.component}`}>
                          <Cell className="text-[12px] font-medium text-ink">{row.name}</Cell>
                          <Cell className="text-[11.5px] text-ink-soft">{row.component}</Cell>
                          <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">{formatIDR(row.prev)}</Cell>
                          <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">{formatIDR(row.next)}</Cell>
                          <Cell>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                                row.delta > 30 ? 'bg-[#fbe3e0] text-[#9b3b2e]' : 'bg-lime/70 text-ink'
                              }`}
                            >
                              +{row.delta}%
                            </span>
                          </Cell>
                          <Cell className="text-[11px] text-muted">{row.reason}</Cell>
                        </Row>
                      ))}
                    </Table>
                  </div>
                ),
              },
              {
                id: 'anomali',
                label: 'Anomali',
                badge: String(cycle.anomalies ?? 0),
                content: (
                  <ul className="space-y-2">
                    {[
                      {
                        id: 'AN-01',
                        severity: 'Tinggi',
                        title: 'Net negatif terdeteksi',
                        detail: 'Potongan pinjaman melebihi penghasilan bersih untuk 1 karyawan.',
                        owner: 'Payroll Ops',
                      },
                    ].map((anomaly) => (
                      <li key={anomaly.id} className="rounded-[20px] border border-white/70 bg-white/50 p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                            <AlertTriangle className="size-4 text-[#b4402f]" />
                            {anomaly.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <StatusPill status={anomaly.severity} />
                            <span className="text-[10px] text-muted">{anomaly.id}</span>
                          </div>
                        </div>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{anomaly.detail}</p>
                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10.5px] text-muted">Pemilik: {anomaly.owner}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              className="focus-ring rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-[10.5px] font-medium text-ink-soft"
                            >
                              Lihat detail
                            </button>
                            <button
                              type="button"
                              className="focus-ring rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-medium text-white"
                            >
                              Tandai selesai
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                id: 'approval',
                label: 'Approval',
                content: (
                  <ol className="space-y-2">
                    {[
                      { role: 'Payroll Specialist', name: 'Sinta Maharani', status: 'Selesai', at: '20 Nov 2026 · 14:02' },
                      { role: 'Payroll Lead (maker-checker)', name: 'Fajar Ramadhan', status: 'Menunggu', at: 'Batas 24 Nov 2026' },
                      { role: 'Finance Controller', name: 'Putri Anindita', status: 'Belum', at: 'Setelah payroll lead' },
                      { role: 'Kunci periode & bayar', name: 'Sistem', status: 'Belum', at: '28 Nov 2026' },
                    ].map((step, index) => (
                      <li
                        key={step.role}
                        className="flex items-center gap-3 rounded-[18px] border border-white/70 bg-white/50 p-3"
                      >
                        <span
                          className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                            step.status === 'Selesai'
                              ? 'bg-ink text-lime'
                              : step.status === 'Menunggu'
                                ? 'bg-lime text-ink'
                                : 'bg-white/70 text-muted'
                          }`}
                        >
                          {step.status === 'Selesai' ? <Check className="size-3.5" /> : index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-ink">{step.role}</p>
                          <p className="text-[10.5px] text-muted">
                            {step.name} · {step.at}
                          </p>
                        </div>
                        <StatusPill status={step.status === 'Belum' ? 'Draft' : step.status} />
                      </li>
                    ))}
                  </ol>
                ),
              },
              {
                id: 'gl',
                label: 'Jurnal GL',
                content: (
                  <div>
                    <Table head={['Akun', 'Cost center', 'Debit', 'Kredit']} minWidth="min-w-[560px]">
                      {[
                        { account: '6101 · Beban gaji', costCenter: 'CC-ENG', debit: 9840000000, credit: 0 },
                        { account: '6102 · Beban tunjangan', costCenter: 'CC-OPS', debit: 2140000000, credit: 0 },
                        { account: '2101 · Utang PPh 21', costCenter: 'CC-FIN', debit: 0, credit: 1360000000 },
                        { account: '2102 · Utang BPJS', costCenter: 'CC-FIN', debit: 0, credit: 420000000 },
                        { account: '1102 · Bank payroll', costCenter: 'CC-FIN', debit: 0, credit: 12140000000 },
                      ].map((row) => (
                        <Row key={row.account}>
                          <Cell className="text-[12px] font-medium text-ink">{row.account}</Cell>
                          <Cell className="text-[11.5px] text-ink-soft">{row.costCenter}</Cell>
                          <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                            {row.debit ? formatIDR(row.debit) : '—'}
                          </Cell>
                          <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                            {row.credit ? formatIDR(row.credit) : '—'}
                          </Cell>
                        </Row>
                      ))}
                    </Table>
                    <div className="mt-3 flex items-center justify-between rounded-2xl bg-lime/40 px-3 py-2 text-[11px]">
                      <span className="text-ink-soft">Total debit = kredit</span>
                      <span className="font-semibold text-ink">{formatIDR(11980000000)}</span>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Timeline siklus" hint="Cut-off 25 Nov · 09.00 WIB" />
            <ol className="mt-4 space-y-3">
              {timeline.map((step) => (
                <li key={step.label} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
                      step.state === 'done'
                        ? 'border-ink bg-ink text-lime'
                        : step.state === 'current'
                          ? 'border-lime-deep bg-lime text-ink'
                          : 'border-ink/15 bg-white/60 text-transparent'
                    }`}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-medium text-ink">{step.label}</p>
                    <p className="text-[10px] text-muted">{step.date}</p>
                  </div>
                  {step.state === 'current' ? (
                    <Pill variant="lime" className="px-2 py-0.5 text-[9.5px]">
                      Sekarang
                    </Pill>
                  ) : null}
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10.5px] text-muted">
                <span>Progres siklus</span>
                <span className="font-semibold text-ink">{cycle.progress ?? 0}%</span>
              </div>
              <Progress value={cycle.progress ?? 0} className="mt-1.5" />
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Kontrol & kepatuhan" hint="Berlaku untuk periode ini" />
            <ul className="mt-3 space-y-2">
              {[
                { icon: ShieldCheck, label: 'Maker-checker aktif', detail: 'Penyetuju ≠ pengubah data' },
                { icon: Lock, label: 'Kunci periode', detail: 'Perubahan setelah kunci → retro' },
                { icon: Users, label: 'Akses field-level', detail: 'Gaji hanya untuk peran berizin' },
                { icon: FileSpreadsheet, label: 'Audit log immutable', detail: 'Nilai sebelum & sesudah' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 rounded-2xl border border-white/70 bg-white/50 p-2.5">
                  <item.icon className="mt-0.5 size-3.5 shrink-0 text-ink-soft" />
                  <div>
                    <p className="text-[11.5px] font-medium text-ink">{item.label}</p>
                    <p className="text-[10px] text-muted">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/audit"
              className="mt-3 flex items-center justify-between rounded-full border border-white/80 bg-white/70 px-3 py-2 text-[10.5px] font-medium text-ink-soft"
            >
              Buka audit log
              <ArrowUpRight className="size-3" />
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  )
}
