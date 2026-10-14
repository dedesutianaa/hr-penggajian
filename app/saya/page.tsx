import Link from 'next/link'
import {
  ArrowUpRight,
  Banknote,
  CalendarPlus,
  Download,
  FileText,
  HelpCircle,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import {
  Avatar,
  Cell,
  Donut,
  Pill,
  Progress,
  Row,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import { getEmployees, getLeaveBalancesByEmployee, getPayslipsByEmployee } from '@/lib/server-data'
import { formatDate, formatIDR, tenure } from '@/lib/format'

const quickActions = [
  { label: 'Ajukan cuti', detail: 'Saldo 12 hari', icon: CalendarPlus },
  { label: 'Unduh slip gaji', detail: 'November 2026', icon: Download },
  { label: 'Ubah data bank', detail: 'Butuh verifikasi', icon: Banknote },
  { label: 'Minta surat', detail: 'Paklaring / keterangan', icon: FileText },
  { label: 'Perbarui profil', detail: '2 field belum lengkap', icon: UserRound },
  { label: 'Buka helpdesk', detail: 'SLA 4 jam', icon: HelpCircle },
]

export default async function SelfServicePage() {
  const { data: employees } = await getEmployees({ page: 1, limit: 1 })
  const me = employees[0]

  if (!me) {
    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow={<span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />}
          title="Self-service karyawan"
          description="Data Anda belum tersedia."
        />
      </div>
    )
  }

  const leaveBalances = await getLeaveBalancesByEmployee(me.id)
  const payslips = await getPayslipsByEmployee(me.id)

  const myRequests = [
    { id: 'LV-1042', type: 'Cuti tahunan', period: '24–26 Nov 2026', status: 'Menunggu' },
    { id: 'EXP-8841', type: 'Reimbursement', period: '19 Nov 2026', status: 'Menunggu' },
    { id: 'LV-1031', type: 'Cuti tahunan', period: '2–3 Sep 2026', status: 'Disetujui' },
  ]

  const myDocuments = [
    { name: 'Kontrak kerja PKWTT', type: 'Kontrak', status: 'Berlaku' },
    { name: 'Slip gaji Oktober 2026', type: 'Payroll', status: 'Dibayar' },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Self-service karyawan · Data Anda
          </>
        }
        title={`Halo, ${me.name}`}
        description="Slip gaji, cuti, data pribadi, dan surat — selesai tanpa mengirim email ke HR."
        actions={
          <Link
            href="/helpdesk"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
          >
            <HelpCircle className="size-3.5" /> Butuh bantuan?
          </Link>
        }
      />

      <Panel className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={me.name} tone={(me.tone as any) || 'mint'} size="xl" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[20px] font-semibold tracking-[-0.03em] text-ink">{me.name}</p>
                <StatusPill status={me.status} />
              </div>
              <p className="text-[12px] text-ink-soft">
                {me.role} · {me.department}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-muted">
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3" /> {me.email}
                </span>
                <span>ID {me.id.toUpperCase()}</span>
                <span>{me.joinDate ? tenure(String(me.joinDate)) : '—'} bersama NEXA</span>
              </div>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="text-muted">Kelengkapan profil</span>
              <span className="font-semibold text-ink">92%</span>
            </div>
            <Progress value={92} tone="lime" className="mt-1.5" />
            <p className="mt-1 text-[10px] text-muted">Lengkapi kontak darurat & NPWP untuk slip pajak.</p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="focus-ring group flex items-start gap-2.5 rounded-[20px] border border-white/80 bg-white/60 p-3 text-left transition-colors hover:bg-white"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-lime">
              <action.icon className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11.5px] font-semibold text-ink">{action.label}</span>
              <span className="block text-[10px] text-muted">{action.detail}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="glass-dark text-white lg:col-span-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.12em] text-white/50 uppercase">Slip terakhir</p>
              <p className="mt-1 text-[12px] text-white/70">
