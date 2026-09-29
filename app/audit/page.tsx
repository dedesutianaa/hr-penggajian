import { Download, Eye, FileLock2, Lock, ShieldCheck, UserCog } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Pill, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { getAuditLogs } from '@/lib/server-data'

export default async function AuditPage() {
  const auditLog = await getAuditLogs({ limit: 50 })

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Keamanan & kepatuhan · Read-only untuk auditor
          </>
        }
        title="Audit log"
        description="Siapa, apa, kapan, nilai sebelum dan sesudah — termasuk siapa yang melihat data gaji. Log immutable dan tidak dapat diubah admin."
        actions={
          <>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Download className="size-3.5" /> Ekspor log
            </button>
          </>
        }
      />

      <div className="flex flex-col gap-3 rounded-[22px] border border-white/70 bg-white/60 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-lime">
            <FileLock2 className="size-4" />
          </span>
          <div>
            <p className="text-[12.5px] font-semibold text-ink">Log immutable & append-only</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              Retensi 7 tahun. Admin aplikasi tidak dapat mengubah atau menghapus entri. Setiap akses ke data gaji tercatat.
            </p>
          </div>
        </div>
        <Pill variant="lime" className="shrink-0 px-2.5 py-1 text-[10px]">
          <ShieldCheck className="size-3" /> Integritas terverifikasi
        </Pill>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Entri hari ini" value="1.284" hint="Termasuk akses baca" icon={<Eye className="size-4" />} />
        <StatCard label="Akses data gaji" value="42" hint="Oleh 8 pengguna berizin" icon={<Lock className="size-4" />} />
        <StatCard label="Perubahan data" value="18" hint="Semua dengan alasan" icon={<UserCog className="size-4" />} />
        <StatCard label="Temuan anomali" value="0" hint="Pemeriksaan otomatis harian" icon={<ShieldCheck className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-9">
          <PanelHead
            title="Log aktivitas"
            hint="22 November 2026 · urut terbaru"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                {auditLog.length} entri
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Waktu', 'Aktor', 'Aksi', 'Objek', 'Field', 'Perubahan', 'Alasan']}
              minWidth="min-w-[900px]"
            >
              {auditLog.map((entry) => (
                <Row key={`${entry.at}-${entry.field}`}>
                  <Cell className="font-mono text-[10px] whitespace-nowrap text-muted">
                    {new Date(entry.at).toLocaleString('id-ID')}
                  </Cell>
                  <Cell className="text-[11.5px] font-medium whitespace-nowrap text-ink">
                    {entry.actorName ?? '-'}
                  </Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{entry.action}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{entry.target}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{entry.field}</Cell>
                  <Cell className="text-[10.5px] whitespace-nowrap">
                    <span className="text-muted">{entry.before ?? '—'}</span>
                    <span className="mx-1 text-muted">→</span>
                    <span className="font-medium text-ink">{entry.after ?? '—'}</span>
                  </Cell>
                  <Cell className="text-[10.5px] text-muted">{entry.reason ?? '-'}</Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-3">
          <Panel>
            <PanelHead title="Akses data gaji" hint="30 hari terakhir" />
            <ul className="mt-3 space-y-2">
              {[
                { name: 'Fajar Ramadhan', role: 'Finance Controller', count: 18 },
                { name: 'Sinta Maharani', role: 'Payroll Specialist', count: 14 },
                { name: 'Nadia Prameswari', role: 'Head of People', count: 7 },
                { name: 'Putri Anindita', role: 'Legal Counsel', count: 3 },
              ].map((user) => (
                <li
                  key={user.name}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-ink">{user.name}</p>
                    <p className="truncate text-[9.5px] text-muted">{user.role}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-ink">{user.count}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHead title="Kontrol akses" hint="Break-glass & MFA" />
            <div className="mt-3 space-y-2">
              <SubPanel>
                <p className="text-[10px] tracking-[0.08em] text-muted uppercase">MFA wajib</p>
                <p className="mt-0.5 text-[11.5px] font-medium text-ink">HR · Payroll · Admin</p>
              </SubPanel>
              <SubPanel>
                <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Break-glass</p>
                <p className="mt-0.5 text-[11.5px] font-medium text-ink">0 permintaan aktif</p>
              </SubPanel>
              <SubPanel>
                <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Retensi log</p>
                <p className="mt-0.5 text-[11.5px] font-medium text-ink">7 tahun</p>
              </SubPanel>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10px] text-ink-soft">
              <StatusPill status="Terverifikasi" />
              Uji kontrol terakhir 1 Nov 2026
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
