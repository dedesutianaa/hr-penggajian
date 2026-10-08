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
