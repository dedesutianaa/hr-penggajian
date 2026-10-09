import Link from 'next/link'
import { ArrowUpRight, CalendarClock, CheckCircle2, Play, Plus, ShieldCheck, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import {
  Cell,
  CheckCircle,
  Pill,
  Progress,
  Row,
  StatCard,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import { getPayrollCycles } from '@/lib/server-data'
import { formatIDR, formatMoney, formatNumber } from '@/lib/format'

export default async function PayrollPage() {
  const { data: cycles } = await getPayrollCycles({ page: 1, limit: 20 })
  const active = cycles[0]

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Payroll · Indonesia in-house · negara lain hybrid
          </>
        }
        title="Siklus payroll"
        description="Kalkulasi gross-to-net, review variansi, approval berjenjang, dan kunci periode dengan jejak audit penuh."
        actions={
          <>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <Play className="size-3.5" /> Jalankan simulasi
            </button>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Plus className="size-3.5" /> Siklus baru
            </button>
          </>
        }
      />

      <ModuleTabs
        items={[
          { href: '/payroll', label: 'Siklus payroll' },
          { href: '/slip-gaji', label: 'Slip gaji' },
          { href: '/kompensasi', label: 'Kompensasi' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross November" value={formatIDR(active?.gross ?? 0, { compact: true })} delta="+1,8%" hint="842 karyawan · 2 entitas" icon={<Wallet className="size-4" />} />
        <StatCard label="Net dibayarkan" value={formatIDR(active?.net ?? 0, { compact: true })} hint="Jatuh tempo 28 Nov 2026" icon={<CheckCircle2 className="size-4" />} />
        <StatCard label="PPh 21" value={formatIDR(active?.tax ?? 0, { compact: true })} hint="Termasuk 3 data NPWP belum lengkap" icon={<ShieldCheck className="size-4" />} />
        <StatCard label="BPJS" value={formatIDR(active?.social ?? 0, { compact: true })} hint="Kesehatan + Ketenagakerjaan" icon={<CalendarClock className="size-4" />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Daftar siklus"
            hint="Semua entitas · {total} siklus terakhir"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                IDR · SGD · MYR
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Periode', 'Entitas', 'Karyawan', 'Gross', 'Status', 'Progres', '']}
              minWidth="min-w-[820px]"
            >
              {cycles.map((cycle) => (
                <Row key={cycle.id}>
                  <Cell>
                    <Link href={`/payroll/${cycle.id}`} className="block text-[12.5px] font-medium text-ink hover:underline">
                      {cycle.period}
                    </Link>
                    <p className="text-[10px] text-muted">{cycle.id}</p>
                  </Cell>
                  <Cell>
                    <p className="text-[11.5px] text-ink-soft">{cycle.country}</p>
                  </Cell>
                  <Cell className="text-[11.5px] text-ink-soft">{formatNumber(cycle.employees)}</Cell>
                  <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                    {cycle.gross === 0 ? '—' : formatMoney(cycle.gross, cycle.currency)}
                  </Cell>
                  <Cell>
                    <StatusPill status={cycle.status} />
                  </Cell>
                  <Cell className="w-28">
                    <div className="flex items-center gap-2">
                      <Progress value={cycle.progress} tone={cycle.progress === 100 ? 'mint' : 'ink'} className="w-16" />
                      <span className="text-[10.5px] text-muted">{cycle.progress}%</span>
                    </div>
                  </Cell>
                  <Cell className="w-10">
                    <Link
                      href={`/payroll/${cycle.id}`}
                      aria-label={`Buka siklus ${cycle.period}`}
                      className="focus-ring grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-ink hover:text-white"
                    >
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
            <ShieldCheck className="size-3.5" />
            Maker-checker aktif: pengubah data gaji tidak dapat menyetujui payroll periode yang sama.
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead
              title="Kesiapan payroll"
              hint="Cut-off 25 Nov 2026 · 09.00 WIB"
              action={
                <Pill variant="lime" className="px-2 py-1 text-[10px]">
                  2/5
                </Pill>
              }
            />
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2">
                <CheckCircle done />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">Data pajak & NPWP lengkap</p>
                  <p className="truncate text-[10px] text-muted">3 karyawan belum lengkap</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2">
                <CheckCircle done />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">Rekening bank tervalidasi</p>
                  <p className="truncate text-[10px] text-muted">2 rekening ganda terdeteksi</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2">
                <CheckCircle done={true} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">Input variabel (lembur, bonus)</p>
                  <p className="truncate text-[10px] text-muted">128 baris diimpor 20 Nov</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2">
                <CheckCircle done={true} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">Kalkulasi gross-to-net</p>
                  <p className="truncate text-[10px] text-muted">Selesai 21 Nov · 14.02</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2">
                <CheckCircle done={false} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">Approval maker-checker</p>
                  <p className="truncate text-[10px] text-muted">Menunggu Payroll Lead</p>
                </div>
              </li>
            </ul>
          </Panel>

          <Panel>
            <PanelHead title="Pra-payroll checks" hint="Dijalankan otomatis 21 Nov · 14.05" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SubPanel>
                <p className="text-[10px] tracking-[0.06em] text-muted uppercase">Net negatif</p>
                <p className="mt-1 text-xl font-semibold text-[#9b3b2e]">1</p>
              </SubPanel>
              <SubPanel>
                <p className="text-[10px] tracking-[0.06em] text-muted uppercase">Kenaikan &gt; 30%</p>
                <p className="mt-1 text-xl font-semibold text-[#8a5a12]">2</p>
              </SubPanel>
              <SubPanel>
                <p className="text-[10px] tracking-[0.06em] text-muted uppercase">Rekening kosong</p>
                <p className="mt-1 text-xl font-semibold text-[#3f6b1e]">0</p>
              </SubPanel>
              <SubPanel>
                <p className="text-[10px] tracking-[0.06em] text-muted uppercase">Data pajak hilang</p>
                <p className="mt-1 text-xl font-semibold text-[#8a5a12]">3</p>
              </SubPanel>
            </div>
            <Link
              href="/payroll/PR-2026-11"
              className="mt-3 flex items-center justify-between rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium text-white"
            >
              Review anomali
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Panel>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead title="Kalender cut-off" hint="November 2026 · zona waktu Asia/Jakarta" />
          <ol className="mt-4 grid gap-2 sm:grid-cols-5">
            {[
              { date: '18 Nov', label: 'Input variabel', done: true },
              { date: '21 Nov', label: 'Kalkulasi', done: true },
              { date: '24 Nov', label: 'Review variansi', done: false },
              { date: '25 Nov', label: 'Kunci periode', done: false },
              { date: '28 Nov', label: 'Pembayaran', done: false },
            ].map((step, index) => (
              <li
                key={step.label}
                className={`rounded-[18px] border p-3 ${
                  step.done ? 'border-lime-deep/30 bg-lime/50' : 'border-white/70 bg-white/50'
                }`}
              >
                <p className="text-[10px] font-medium tracking-[0.08em] text-muted uppercase">Langkah {index + 1}</p>
                <p className="mt-1 text-[12px] font-semibold text-ink">{step.date}</p>
                <p className="text-[10.5px] text-muted">{step.label}</p>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Rekonsiliasi payroll → GL" hint="Oktober 2026 · sudah ditutup" />
          <div className="mt-3 space-y-2">
            {[
              { label: 'Beban gaji & tunjangan', value: 'Rp 14,61 M', status: 'Cocok' },
              { label: 'Utang PPh 21', value: 'Rp 1,33 M', status: 'Cocok' },
              { label: 'Utang BPJS', value: 'Rp 415 jt', status: 'Cocok' },
              { label: 'Bank payroll', value: 'Rp 11,98 M', status: 'Selisih Rp 0' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
              >
                <span className="text-[11.5px] text-ink-soft">{row.label}</span>
                <span className="flex items-center gap-2 text-[11.5px] font-medium text-ink">
                  {row.value}
                  <StatusPill status="Selesai" />
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] text-muted">
            Jurnal dikirim otomatis per cost center. Rekonsiliasi terakhir 02 Nov 2026.
          </p>
        </Panel>
      </div>
    </div>
  )
}
