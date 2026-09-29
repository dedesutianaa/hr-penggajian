import { ArrowUpRight, Clock, GitBranch, ShieldCheck, UserCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ApprovalInbox } from '@/components/approval-inbox'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Pill, Progress, StatCard } from '@/components/ui/bits'

export default function ApprovalPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Self-service manajer · Inbox approval
          </>
        }
        title="Inbox persetujuan"
        description="Cuti, lembur, perubahan gaji, reimbursement, dan requisition dalam satu inbox — dengan SLA, delegasi, dan eskalasi otomatis."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
          >
            <Users className="size-3.5" /> Atur delegasi
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Menunggu" value="5" hint="1 melewati SLA" icon={<Clock className="size-4" />} />
        <StatCard label="Disetujui minggu ini" value="24" delta="+6" hint="Rata-rata respons 6 jam" icon={<UserCheck className="size-4" />} />
        <StatCard label="Ditolak" value="2" hint="Alasan wajib diisi" icon={<ShieldCheck className="size-4" />} />
        <StatCard label="Delegasi aktif" value="1" hint="Berlaku sampai 30 Nov" icon={<GitBranch className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ApprovalInbox />
        </div>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Beban approval" hint="7 hari terakhir" />
            <div className="mt-3 space-y-2.5">
              {[
                { label: 'Cuti', value: 42, tone: 'lime' as const },
                { label: 'Lembur', value: 28, tone: 'mint' as const },
                { label: 'Perubahan gaji', value: 12, tone: 'sky' as const },
                { label: 'Reimbursement', value: 18, tone: 'lilac' as const },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-soft">{item.label}</span>
                    <span className="font-medium text-ink">{item.value}</span>
                  </div>
                  <Progress
                    value={(item.value / 42) * 100}
                    tone={item.tone === 'lime' ? 'lime' : item.tone === 'sky' ? 'sky' : 'mint'}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Delegasi" hint="Saat Anda cuti atau di luar jam kerja" />
            <div className="mt-3 rounded-[18px] border border-white/70 bg-white/50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-ink">Clara Wijaya</p>
                  <p className="text-[10px] text-muted">HR Business Partner · Singapura</p>
                </div>
                <Pill variant="lime" className="px-2 py-0.5 text-[9.5px]">
                  Aktif
                </Pill>
              </div>
              <p className="mt-2 text-[10px] text-muted">Berlaku 22–30 Nov 2026 · cuti, lembur, reimbursement</p>
            </div>
            <button
              type="button"
              className="focus-ring mt-2 w-full rounded-full border border-white/80 bg-white/70 px-3 py-2 text-[10.5px] font-medium text-ink-soft"
            >
              Ubah delegasi
            </button>
          </Panel>

          <Panel>
            <PanelHead title="Aturan approval" hint="Workflow tanpa kode" />
            <ol className="mt-3 space-y-2">
              {[
                { step: '1', label: 'Manajer langsung', detail: 'SLA 2 hari kerja' },
                { step: '2', label: 'HRBP (jika lewat SLA)', detail: 'Eskalasi otomatis' },
                { step: '3', label: 'Payroll (cuti tanpa gaji)', detail: 'Dampak gaji dihitung' },
              ].map((rule) => (
                <li key={rule.step} className="flex items-start gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[9px] font-semibold text-lime">
                    {rule.step}
                  </span>
                  <div>
                    <p className="text-[11.5px] font-medium text-ink">{rule.label}</p>
                    <p className="text-[10px] text-muted">{rule.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href="/pengaturan"
              className="mt-3 flex items-center justify-between rounded-full bg-ink px-3 py-2 text-[10.5px] font-medium text-white"
            >
              Buka workflow builder
              <ArrowUpRight className="size-3" />
            </a>
          </Panel>

          <SubPanel>
            <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Prinsip</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-soft">
              Maker-checker: pengubah data gaji tidak dapat menyetujui payroll. Semua keputusan menyimpan alasan dan
              identitas penyetuju.
            </p>
          </SubPanel>
        </div>
      </div>
    </div>
  )
}
