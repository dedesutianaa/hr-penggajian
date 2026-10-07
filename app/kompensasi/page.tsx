import { ArrowUpRight, Coins, Scale, TrendingUp, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Pill, Progress, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { getSalaryBands } from '@/lib/server-data'
import { formatIDR, formatNumber } from '@/lib/format'

export default async function CompensationPage() {
  const salaryBands = await getSalaryBands()

  const avgCompa =
    salaryBands.length > 0
      ? salaryBands.reduce((sum, b) => sum + (b.compa || 0), 0) / salaryBands.length
      : 0
  const totalHeadcount = salaryBands.reduce((sum, b) => sum + (b.headcount || 0), 0)
  const belowBand = salaryBands.filter((b) => (b.compa || 0) < 0.9).length

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Kompensasi · Grade, band, dan siklus merit
          </>
        }
        title="Kompensasi & grade"
        description="Salary band per grade, compa-ratio, anggaran merit per manajer, dan total reward statement — hasilnya langsung masuk payroll."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Coins className="size-3.5" /> Jalankan siklus merit
          </button>
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
        <StatCard label="Total kompensasi" value={formatIDR(totalHeadcount * 15000000, { compact: true })} delta="+1,8%" hint={`Gross bulanan ${totalHeadcount} karyawan`} icon={<Wallet className="size-4" />} />
        <StatCard label="Compa-ratio" value={avgCompa.toFixed(2)} hint="Rata-rata terhadap midpoint" icon={<Scale className="size-4" />} />
        <StatCard label="Budget merit terpakai" value="62%" hint="Siklus 2026 · Rp 4,2 M" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Di bawah band" value={belowBand} hint="Perlu penyesuaian Q1 2027" icon={<Coins className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Salary band"
            hint="Rentang per grade · data dari database"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                IDR / bulan
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Grade', 'Jabatan', 'Min', 'Mid', 'Max', 'Posisi', 'Headcount']}
              minWidth="min-w-[760px]"
            >
              {salaryBands.map((band) => (
                <Row key={band.id}>
                  <Cell>
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-lime">
                      {band.grade}
                    </span>
                  </Cell>
                  <Cell className="text-[12px] font-medium text-ink">{band.title}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{formatIDR(band.min, { compact: true })}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{formatIDR(band.mid, { compact: true })}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{formatIDR(band.max, { compact: true })}</Cell>
                  <Cell className="w-32">
                    <div className="relative h-2 w-24 rounded-full bg-ink/8">
                      <div className="absolute inset-y-0 right-0 left-0 rounded-full bg-gradient-to-r from-lime/50 via-lime to-lime/50" />
                      <span
                        className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink"
                        style={{ left: `${Math.min(96, Math.max(4, (band.compa || 0) * 100))}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[9.5px] text-muted">Compa {(band.compa || 0).toFixed(2)}</p>
                  </Cell>
                  <Cell className="text-[11.5px] text-ink-soft">{formatNumber(band.headcount)}</Cell>
