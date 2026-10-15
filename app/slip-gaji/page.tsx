import Link from 'next/link'
import { ArrowUpRight, Download, Eye, FileText, Languages, Lock, Send } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Avatar, Cell, Pill, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { getPayslips } from '@/lib/server-data'
import { formatIDR, formatNumber } from '@/lib/format'

export default async function PayslipListPage() {
  const { data: slips, total } = await getPayslips({ page: 1, limit: 100 })

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Payroll · Slip gaji digital
          </>
        }
        title="Slip gaji"
        description="Slip multi-bahasa hanya dapat diakses lewat self-service, dengan histori dan jejak unduhan yang tercatat."
        actions={
          <>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Download className="size-3.5" /> Unduh semua
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
        <StatCard label="Slip terbit" value={formatNumber(total)} hint="Semua periode" icon={<FileText className="size-4" />} />
        <StatCard label="Sudah dilihat" value="96%" delta="+4%" hint="Histori unduhan di audit log" icon={<Eye className="size-4" />} />
        <StatCard label="Unduhan" value="312" hint="30 hari terakhir" icon={<Download className="size-4" />} />
        <StatCard label="Gagal kirim" value="2" hint="Email bounce · perlu tindak lanjut" icon={<Send className="size-4" />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Daftar slip"
            hint={`${total} slip dari database`}
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                IDR
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Karyawan', 'NIK', 'Periode', 'Gross', 'Potongan', 'Net', 'Status', '']}
              minWidth="min-w-[820px]"
            >
              {slips.map((slip) => (
                <Row key={slip.id}>
                  <Cell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={slip.employeeName} tone="mint" size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-ink">{slip.employeeName}</p>
                        <p className="truncate text-[10px] text-muted">{slip.id}</p>
                      </div>
                    </div>
                  </Cell>
                  <Cell className="text-[11px] font-mono text-ink-soft whitespace-nowrap">{slip.employeeNik ?? '—'}</Cell>
                  <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">{slip.period}</Cell>
                  <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">{formatIDR(slip.gross)}</Cell>
                  <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">{formatIDR(slip.deduction)}</Cell>
                  <Cell className="text-[12px] font-semibold whitespace-nowrap text-ink">{formatIDR(slip.net)}</Cell>
                  <Cell>
                    <StatusPill status={slip.status} />
                  </Cell>
                  <Cell className="w-16">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/slip-gaji/${slip.id}`}
                        aria-label={`Lihat slip ${slip.employeeName}`}
                        className="focus-ring grid size-7 place-items-center rounded-full text-muted hover:bg-ink hover:text-white"
                      >
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Unduh slip ${slip.employeeName}`}
                        className="focus-ring grid size-7 place-items-center rounded-full text-muted hover:bg-ink hover:text-white"
                      >
                        <Download className="size-3.5" />
                      </button>
                    </div>
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Distribusi slip" hint="Periode terbaru" />
            <div className="mt-3 space-y-2">
              {[
                { label: 'Terkirim ke self-service', value: total, total },
                { label: 'Dibuka karyawan', value: Math.round(total * 0.96), total },
                { label: 'Diunduh', value: 312, total },
              ].map((item) => (
                <SubPanel key={item.label}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-soft">{item.label}</span>
                    <span className="font-semibold text-ink">{formatNumber(item.value)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${(item.value / item.total) * 100}%` }} />
                  </div>
                </SubPanel>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Keamanan & bahasa" hint="Kebijakan akses slip" />
            <ul className="mt-3 space-y-2 text-[11px] text-ink-soft">
              <li className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/50 p-2.5">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                Slip hanya bisa diakses pemilik akun lewat self-service. HR tidak dapat mengirim lampiran slip lewat email.
              </li>
              <li className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/50 p-2.5">
                <Languages className="mt-0.5 size-3.5 shrink-0" />
                Tersedia dalam Bahasa Indonesia dan Inggris, mengikuti preferensi karyawan.
              </li>
              <li className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/50 p-2.5">
                <Eye className="mt-0.5 size-3.5 shrink-0" />
                Setiap unduhan tercatat di audit log: siapa, kapan, dan dari perangkat mana.
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
