import { HeartPulse, Plus, Receipt, ScanLine, ShieldCheck, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Pill, Progress, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { getBenefits, getExpenses } from '@/lib/server-data'
import { formatDate, formatIDR, formatNumber } from '@/lib/format'

export default async function BenefitPage() {
  const [benefits, expensesResult] = await Promise.all([getBenefits(), getExpenses({ limit: 50 })])
  const expenses = expensesResult.data
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Benefit & expense · Terhubung payroll
          </>
        }
        title="Benefit & reimbursement"
        description="Enrolment benefit, kelayakan per grade, dependen, dan klaim biaya dengan OCR struk — kontribusi otomatis masuk payroll."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Kelola enrolment
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Peserta asuransi" value="1.180" delta="+12" hint="92% dari headcount" icon={<HeartPulse className="size-4" />} />
        <StatCard label="Klaim bulan ini" value="Rp 486 jt" hint="312 klaim diproses" icon={<Receipt className="size-4" />} />
        <StatCard label="Expense menunggu" value="2" hint="SLA 3 hari kerja" icon={<Wallet className="size-4" />} />
        <StatCard label="Biaya benefit" value="Rp 1,9 M" hint="Termasuk BPJS & pensiun" icon={<ShieldCheck className="size-4" />} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit) => (
          <Panel key={benefit.name}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[12.5px] font-semibold text-ink">{benefit.name}</p>
                <p className="text-[10px] text-muted">{benefit.provider}</p>
              </div>
              <Pill variant="outline" className="px-2 py-0.5 text-[9.5px]">
                {benefit.coverage}
              </Pill>
            </div>
            <p className="mt-3 text-[22px] leading-none font-semibold tracking-[-0.03em] text-ink">
              {formatNumber(benefit.enrolled)}
            </p>
            <p className="text-[10px] text-muted">dari {formatNumber(benefit.eligible)} eligible</p>
            <Progress
              value={(benefit.enrolled / benefit.eligible) * 100}
              tone={benefit.tone === 'lime' ? 'lime' : benefit.tone === 'sky' ? 'sky' : 'mint'}
              className="mt-2"
            />
          </Panel>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Klaim & reimbursement"
            hint="OCR struk otomatis · kebijakan per grade"
            action={
              <Pill variant="lime" className="px-2 py-1 text-[10px]">
                <ScanLine className="size-3" /> OCR aktif
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['ID', 'Karyawan', 'Kategori', 'Tanggal', 'Nominal', 'Status', '']}
              minWidth="min-w-[720px]"
            >
