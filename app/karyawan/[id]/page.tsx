import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Download,
  FileText,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserCog,
} from 'lucide-react'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Tabs } from '@/components/ui/tabs'
import {
  Avatar,
  Cell,
  Field,
  Pill,
  Progress,
  Row,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import {
  getEmployeeById,
  getEmploymentHistory,
  getLeaveBalancesByEmployee,
  getLeaveRequestsByEmployee,
  getPayslipsByEmployee,
  getAuditLogByTarget,
} from '@/lib/server-data'
import { formatDate, formatIDR, tenure } from '@/lib/format'

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const employee = await getEmployeeById(id)
  if (!employee) notFound()

  const history = await getEmploymentHistory(id)
  const leaveRequests = await getLeaveRequestsByEmployee(id)
  const leaveBalances = await getLeaveBalancesByEmployee(id)
  const payslips = await getPayslipsByEmployee(id)
  const auditLog = await getAuditLogByTarget(employee.name)

  const manager = employee.manager ? await getEmployeeById(employee.manager) : null

  return (
    <div className="space-y-4">
      <Link
        href="/karyawan"
        className="focus-ring inline-flex items-center gap-1.5 rounded-full text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> Direktori karyawan
      </Link>

      <Panel className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={employee.name} tone={(employee.tone as any) || 'mint'} size="xl" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.03em] text-ink md:text-[28px]">
                  {employee.name}
                </h1>
                <StatusPill status={employee.status} />
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {employee.role} · {employee.department}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="size-3.5" /> {employee.entity}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> {employee.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3.5" /> {employee.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3.5" /> {employee.phone}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <UserCog className="size-3.5" /> Ajukan perubahan
            </button>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Pencil className="size-3.5" /> Edit data
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <Tabs
            items={[
              {
                id: 'profil',
                label: 'Profil',
                content: (
                  <div className="grid gap-3 md:grid-cols-2">
                    <SubPanel>
                      <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                        Data pribadi
                      </p>
                      <dl className="mt-3 grid grid-cols-2 gap-3">
                        <Field label="Nama lengkap" value={employee.name} />
                        <Field label="ID karyawan" value={employee.id.toUpperCase()} />
                        <Field label="NPWP" value={employee.npwp ?? '—'} />
                        <Field label="BPJS" value={employee.bpjs ?? '—'} />
                        <Field label="Kewarganegaraan" value={employee.country} />
                        <Field label="Status pajak" value={employee.taxStatus ?? 'TK/0'} />
                      </dl>
                    </SubPanel>
                    <SubPanel>
                      <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                        Kontak darurat
                      </p>
                      <dl className="mt-3 grid grid-cols-2 gap-3">
                        <Field label="Nama" value="Rangga Prameswari" />
                        <Field label="Hubungan" value="Suami" />
                        <Field label="Telepon" value="+62 811 9001 220" />
                        <Field label="Alamat" value="Kebayoran Baru, Jakarta" />
                      </dl>
                      <div className="mt-3 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
                        Data pribadi hanya terlihat oleh HRBP, HR Ops, dan atasan langsung.
                      </div>
                    </SubPanel>
                    <SubPanel>
                      <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                        Rekening bank
                      </p>
                      <dl className="mt-3 grid grid-cols-2 gap-3">
                        <Field label="Bank" value={employee.bank ?? '—'} />
                        <Field label="Nomor" value={employee.account ?? '—'} />
                        <Field label="Pemilik" value={employee.name} />
                        <Field
                          label="Verifikasi"
                          value={<StatusPill status={employee.accountVerified ? 'Terverifikasi' : 'Belum diverifikasi'} />}
                        />
                      </dl>
                    </SubPanel>
                    <SubPanel>
                      <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                        Dependen
                      </p>
                      <ul className="mt-3 space-y-2">
                        {[
                          { name: 'Raka Prameswari', relation: 'Anak · 6 tahun', coverage: 'Asuransi kesehatan' },
                          { name: 'Rangga Prameswari', relation: 'Suami', coverage: 'Asuransi kesehatan' },
                        ].map((dependent) => (
                          <li key={dependent.name} className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[12px] font-medium text-ink">{dependent.name}</p>
                              <p className="text-[10.5px] text-muted">{dependent.relation}</p>
                            </div>
                            <Pill variant="outline" className="px-2 py-1 text-[10px]">
                              {dependent.coverage}
                            </Pill>
                          </li>
                        ))}
                      </ul>
                    </SubPanel>
                  </div>
                ),
              },
              {
                id: 'riwayat',
                label: 'Riwayat',
                badge: String(history.length),
                content: (
                  <div>
                    <div className="mb-3 flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
                      <ShieldCheck className="size-3.5" />
                      Semua perubahan effective-dated. Perubahan backdated dihitung sebagai retro pay.
                    </div>
                    <ol className="relative space-y-3 border-l border-ink/10 pl-4">
                      {history.map((item) => (
                        <li key={`${item.effective}-${item.title}`} className="relative">
                          <span className="absolute top-2 -left-[21px] size-2.5 rounded-full border-2 border-white bg-ink" />
                          <div className="rounded-[18px] border border-white/70 bg-white/50 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[12.5px] font-semibold text-ink">{item.title}</p>
                              <span className="text-[10.5px] text-muted">
                                Efektif {formatDate(String(item.effective))}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11.5px] text-ink-soft">{item.detail ?? '-'}</p>
                            <p className="mt-1 text-[10.5px] text-muted">
                              {item.reason ?? '-'} · diinput {formatDate(String(item.inputDate))} oleh {item.actor ?? '-'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ),
              },
              {
                id: 'dokumen',
                label: 'Dokumen',
                badge: '4',
                content: (
                  <Table head={['Dokumen', 'Jenis', 'Diperbarui', 'Kedaluwarsa', 'Status', '']} minWidth="min-w-[620px]">
                    {[
                      { name: 'Kontrak kerja PKWTT', type: 'Kontrak', updated: '2025-04-01', expiry: '2027-03-31', status: 'Berlaku' },
                      { name: 'KTP & NPWP', type: 'Identitas', updated: '2024-08-12', expiry: '—', status: 'Terverifikasi' },
                      { name: 'Kartu BPJS Kesehatan', type: 'Jaminan sosial', updated: '2026-01-04', expiry: '2026-12-31', status: 'Segera kedaluwarsa' },
                      { name: 'Sertifikasi CHRP', type: 'Sertifikasi', updated: '2023-06-19', expiry: '2026-06-19', status: 'Kedaluwarsa' },
                    ].map((document) => (
                      <Row key={document.name}>
                        <Cell>
                          <span className="flex items-center gap-2 text-[12px] font-medium text-ink">
                            <FileText className="size-3.5 text-muted" /> {document.name}
                          </span>
                        </Cell>
                        <Cell className="text-[11.5px] text-ink-soft">{document.type}</Cell>
                        <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                          {formatDate(document.updated)}
                        </Cell>
                        <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                          {document.expiry === '—' ? '—' : formatDate(document.expiry)}
                        </Cell>
                        <Cell>
                          <StatusPill status={document.status} />
                        </Cell>
                        <Cell className="w-10">
                          <button
                            type="button"
                            aria-label={`Unduh ${document.name}`}
                            className="focus-ring grid size-7 place-items-center rounded-full text-muted hover:bg-ink hover:text-white"
                          >
                            <Download className="size-3.5" />
                          </button>
                        </Cell>
                      </Row>
                    ))}
                  </Table>
                ),
              },
              {
                id: 'cuti',
                label: 'Cuti',
                content: (
                  <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {leaveBalances.map((balance) => (
                        <SubPanel key={balance.id}>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-ink">{balance.typeName}</span>
                            <span className="text-muted">
                              {balance.total - balance.used} / {balance.total} hari
                            </span>
                          </div>
                          <Progress
                            value={((balance.total - balance.used) / balance.total) * 100}
                            tone="mint"
                            className="mt-2"
                          />
                        </SubPanel>
                      ))}
                    </div>
                    <Table head={['Jenis', 'Periode', 'Hari', 'Status']} minWidth="min-w-[420px]">
                      {leaveRequests.map((leave) => (
                        <Row key={leave.id}>
                          <Cell className="text-[12px] font-medium text-ink">{leave.typeName}</Cell>
                          <Cell className="text-[11.5px] text-ink-soft">
                            {formatDate(String(leave.startDate))} – {formatDate(String(leave.endDate))}
                          </Cell>
                          <Cell className="text-[11.5px] text-ink-soft">{leave.days} hari</Cell>
                          <Cell>
                            <StatusPill status={leave.status} />
                          </Cell>
                        </Row>
                      ))}
                    </Table>
                  </div>
                ),
              },
              {
                id: 'payroll',
                label: 'Payroll',
                content: (
                  <Table head={['Periode', 'Gross', 'Potongan', 'Net', 'Status', '']} minWidth="min-w-[560px]">
                    {payslips.map((slip) => (
                      <Row key={slip.id}>
                        <Cell className="text-[12px] font-medium text-ink">{slip.period}</Cell>
                        <Cell className="text-[11.5px] text-ink-soft">{formatIDR(slip.gross)}</Cell>
                        <Cell className="text-[11.5px] text-ink-soft">{formatIDR(slip.deduction)}</Cell>
                        <Cell className="text-[12px] font-semibold text-ink">{formatIDR(slip.net)}</Cell>
                        <Cell>
                          <StatusPill status={slip.status} />
                        </Cell>
                        <Cell className="w-10">
                          <Link
                            href={`/slip-gaji/${slip.id}`}
                            aria-label={`Lihat slip ${slip.period}`}
                            className="focus-ring grid size-7 place-items-center rounded-full text-muted hover:bg-ink hover:text-white"
                          >
                            <ArrowUpRight className="size-3.5" />
                          </Link>
                        </Cell>
                      </Row>
                    ))}
                  </Table>
                ),
              },
              {
                id: 'audit',
                label: 'Audit',
                content: (
                  <div>
                    <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-[10.5px] text-muted">
                      <Lock className="size-3.5" /> Log immutable — tidak dapat diubah atau dihapus, termasuk oleh admin.
                    </div>
                    <Table head={['Waktu', 'Aktor', 'Aksi', 'Field', 'Alasan']} minWidth="min-w-[620px]">
                      {auditLog.map((entry) => (
                        <Row key={`${entry.at}-${entry.field}`}>
                          <Cell className="text-[11px] whitespace-nowrap text-ink-soft">
                            {new Date(entry.at).toLocaleString('id-ID')}
                          </Cell>
                          <Cell className="text-[11.5px] font-medium text-ink">{entry.actorName ?? '-'}</Cell>
                          <Cell className="text-[11.5px] text-ink-soft">{entry.action}</Cell>
                          <Cell className="text-[11.5px] text-ink-soft">{entry.field}</Cell>
                          <Cell className="text-[11px] text-muted">{entry.reason ?? '-'}</Cell>
                        </Row>
                      ))}
                    </Table>
                  </div>
                ),
              },
            ]}
          />
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Ringkasan" hint="Data per 22 November 2026" />
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Masa kerja" value={tenure(employee.joinDate ? String(employee.joinDate) : new Date().toISOString())} />
              <Field label="Grade" value={employee.grade ?? '—'} />
              <Field label="Tipe pekerja" value={employee.type} />
              <Field label="Bergabung" value={formatDate(String(employee.joinDate))} />
              <Field label="Manajer" value={manager?.name ?? '—'} />
              <Field label="Negara" value={employee.country} />
            </dl>
          </Panel>

          <Panel className="glass-dark text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.12em] text-white/50 uppercase">
                  Kompensasi
                </p>
                <p className="mt-2 text-[26px] leading-none font-semibold tracking-[-0.03em]">
                  {employee.currency === 'IDR' ? 'Rp ••••••••' : 'SGD •••••'}
                </p>
                <p className="mt-1 text-[11px] text-white/50">Gross bulanan · {employee.grade}</p>
              </div>
              <span className="grid size-8 place-items-center rounded-full bg-white/10 text-lime">
                <Lock className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-[10.5px] leading-relaxed text-white/60">
              Field-level security aktif. Gaji hanya terlihat oleh HR Payroll dan atasan langsung dengan hak eksplisit.
            </p>
            <button
              type="button"
              className="focus-ring mt-3 w-full rounded-full bg-lime px-3 py-2 text-[11px] font-semibold text-ink transition-colors hover:bg-lime-deep"
            >
              Minta akses sementara
            </button>
          </Panel>

          <Panel>
            <PanelHead title="Garis pelaporan" hint="Atasan dan bawahan" />
            <div className="mt-3 space-y-2">
              {manager ? (
                <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 p-2.5">
                  <Avatar name={manager.name} tone={(manager.tone as any) || 'mint'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-ink">{manager.name}</p>
                    <p className="truncate text-[10.5px] text-muted">Atasan · {manager.role}</p>
                  </div>
                  <BadgeCheck className="size-4 text-[#3f6b1e]" />
                </div>
              ) : null}
              <p className="rounded-2xl bg-white/50 px-3 py-3 text-[11px] text-muted">
                Tidak ada bawahan langsung tercatat.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
