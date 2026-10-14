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
                {payslips[0]?.period ?? '—'} · dibayar 28 Okt
              </p>
            </div>
            <span className="grid size-8 place-items-center rounded-full bg-white/10 text-lime">
              <FileText className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-[30px] leading-none font-semibold tracking-[-0.04em]">
            {formatIDR(payslips[0]?.net ?? 35820000)}
          </p>
          <p className="mt-1 text-[10.5px] text-white/50">
            Take home pay · gross {formatIDR(payslips[0]?.gross ?? 42000000)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {payslips[0] ? (
              <Link
                href={`/slip-gaji/${payslips[0].id}`}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-lime px-3 py-2 text-[11px] font-semibold text-ink"
              >
                Lihat slip <ArrowUpRight className="size-3" />
              </Link>
            ) : (
              <button disabled className="focus-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-lime px-3 py-2 text-[11px] font-semibold text-ink opacity-50 cursor-not-allowed">
                Slip tidak tersedia <ArrowUpRight className="size-3" />
              </button>
            )}
            <button
              type="button"
              aria-label="Unduh slip terakhir"
              className="focus-ring grid size-9 place-items-center rounded-full bg-white/10 text-white"
            >
              <Download className="size-3.5" />
            </button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[9.5px] text-white/40">
            <Lock className="size-3" /> Hanya Anda yang dapat mengakses slip ini
          </p>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHead title="Saldo cuti" hint="Tahun 2026 · reset 1 Januari" action={<Pill variant="lime" className="px-2 py-1 text-[10px]">12 hari</Pill>} />
          <div className="mt-4 flex items-center gap-4">
            <Donut value={75} size={88} strokeWidth={9} label={<span className="text-[14px]">75%</span>} />
            <div className="flex-1 space-y-2">
              {leaveBalances.slice(0, 3).map((balance) => (
                <div key={balance.id}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-ink-soft">{balance.typeName}</span>
                    <span className="text-muted">
                      {balance.total - balance.used}/{balance.total}
                    </span>
                  </div>
                  <Progress
                    value={((balance.total - balance.used) / balance.total) * 100}
                    tone={balance.typeName?.toLowerCase().includes('tahunan') ? 'lime' : 'mint'}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="focus-ring mt-4 w-full rounded-full bg-ink px-3 py-2 text-[11px] font-medium text-white"
          >
            Ajukan cuti
          </button>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHead title="Permintaan aktif" hint="2 menunggu, 1 selesai" />
          <ul className="mt-3 space-y-2">
            {myRequests.slice(0, 3).map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-medium text-ink">{request.type}</p>
                  <p className="truncate text-[10px] text-muted">
                    {request.period} · {request.id}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10px] leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
            Perubahan rekening bank memerlukan verifikasi tambahan dan approval HR Ops.
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead title="Permintaan saya" hint="6 bulan terakhir" />
          <div className="mt-3">
            <Table head={['ID', 'Jenis', 'Periode', 'Status']} minWidth="min-w-[480px]">
              {myRequests.map((request) => (
                <Row key={request.id}>
                  <Cell className="text-[11px] font-medium text-ink">{request.id}</Cell>
                  <Cell className="text-[11.5px] text-ink-soft">{request.type}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{request.period}</Cell>
                  <Cell>
                    <StatusPill status={request.status} />
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Dokumen saya" hint="Akses pribadi · terenkripsi" />
          <ul className="mt-3 space-y-2">
            {myDocuments.map((document) => (
              <li
                key={document.name}
                className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/80 text-ink-soft">
                  <FileText className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">{document.name}</p>
                  <p className="text-[10px] text-muted">{document.type}</p>
                </div>
                <StatusPill status={document.status} />
              </li>
            ))}
          </ul>
          <SubPanel className="mt-3">
            <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Data pribadi</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-soft">
              Anda dapat meminta akses, koreksi, atau penghapusan data sesuai UU PDP. Permintaan diproses DPO dengan jejak
              lengkap.
            </p>
            <p className="mt-1 text-[10px] text-muted">Terakhir diperbarui {formatDate('2026-11-18')}</p>
          </SubPanel>
        </Panel>
      </div>
    </div>
  )
}
