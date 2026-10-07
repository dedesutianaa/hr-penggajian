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
                </Row>
              ))}
            </Table>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
            <Scale className="size-3.5" />
            Analisis kesetaraan upah (P2) akan membandingkan kompensasi berdasarkan gender dan masa kerja.
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Siklus merit 2026" hint="Anggaran Rp 4,2 M · 62% terpakai" />
            <div className="mt-3">
              <Progress value={62} tone="lime" />
              <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted">
                <span>Rp 2,6 M dialokasikan</span>
                <span>Rp 1,6 M tersisa</span>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {[
                { label: 'Rekomendasi manajer', value: '186 / 214', status: 'Dalam proses' },
                { label: 'Review HRBP', value: '142 / 186', status: 'Dalam proses' },
                { label: 'Approval Finance', value: '0 / 1', status: 'Menunggu' },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
                >
                  <div>
                    <p className="text-[11px] font-medium text-ink">{item.label}</p>
                    <p className="text-[10px] text-muted">{item.value}</p>
                  </div>
                  <StatusPill status={item.status} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="glass-dark text-white">
            <p className="text-[10px] tracking-[0.12em] text-white/50 uppercase">Total reward statement</p>
            <p className="mt-2 text-[15px] font-semibold">Nadia Prameswari · G7</p>
            <div className="mt-3 space-y-1.5 text-[11px]">
              {[
                { label: 'Gaji pokok', value: 'Rp 32,0 jt' },
                { label: 'Tunjangan', value: 'Rp 8,6 jt' },
                { label: 'Bonus tahunan', value: 'Rp 42,0 jt' },
                { label: 'Benefit & asuransi', value: 'Rp 18,4 jt' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-white/70">
                  <span>{item.label}</span>
                  <span className="font-medium text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
              <span className="text-[10.5px] text-white/50">Total reward tahunan</span>
              <span className="text-[15px] font-semibold text-lime">Rp 604 jt</span>
            </div>
            <button
              type="button"
              className="focus-ring mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-white/10 px-3 py-2 text-[10.5px] font-medium text-white"
            >
              Lihat statement <ArrowUpRight className="size-3" />
            </button>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHead title="Rekomendasi merit per departemen" hint="Diajukan manajer · menunggu kalibrasi" />
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          {[
            { dept: 'Engineering', people: 92, avg: '5,4%', budget: 78 },
            { dept: 'People & Culture', people: 39, avg: '4,8%', budget: 54 },
            { dept: 'Finance', people: 30, avg: '4,2%', budget: 46 },
            { dept: 'Operations', people: 53, avg: '5,1%', budget: 62 },
          ].map((item) => (
            <SubPanel key={item.dept}>
              <p className="text-[11.5px] font-semibold text-ink">{item.dept}</p>
              <p className="text-[10px] text-muted">
                {item.people} karyawan · rata-rata {item.avg}
              </p>
              <Progress value={item.budget} tone="lime" className="mt-2" />
              <p className="mt-1 text-[9.5px] text-muted">{item.budget}% anggaran</p>
            </SubPanel>
          ))}
        </div>
      </Panel>
    </div>
  )
}
