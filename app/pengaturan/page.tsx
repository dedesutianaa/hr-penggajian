import { Check, Globe2, KeyRound, Plug, Plus, ShieldCheck, Workflow } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, SubPanel } from '@/components/ui/panel'
import { Tabs } from '@/components/ui/tabs'
import { Cell, Pill, Row, StatusPill, Table } from '@/components/ui/bits'
import { getIntegrations, getWorkflows } from '@/lib/server-data'

const rules = [
  { name: 'PPh 21 · tarif efektif bulanan', version: 'v2026.4', effective: '1 Jan 2026', owner: 'Payroll Ops', status: 'Aktif' },
  { name: 'BPJS Kesehatan · batas upah', version: 'v2026.1', effective: '1 Mar 2026', owner: 'Payroll Ops', status: 'Aktif' },
  { name: 'BPJS Ketenagakerjaan · JHT/JP', version: 'v2026.2', effective: '1 Apr 2026', owner: 'Payroll Ops', status: 'Aktif' },
  { name: 'THR · proration & kelayakan', version: 'v2025.3', effective: '1 Jan 2026', owner: 'HR Ops', status: 'Aktif' },
  { name: 'Pesangon · kalkulator', version: 'v2026.1', effective: '1 Jul 2026', owner: 'Legal', status: 'Uji coba' },
]

const roles = ['Karyawan', 'Manajer', 'HRBP', 'Payroll', 'Admin']
const permissions = [
  { label: 'Lihat profil sendiri', allow: [true, true, true, true, true] },
  { label: 'Lihat gaji bawahan', allow: [false, false, true, true, false] },
  { label: 'Ubah komponen gaji', allow: [false, false, false, true, false] },
  { label: 'Setujui payroll', allow: [false, false, false, false, false] },
  { label: 'Lihat audit log', allow: [false, false, true, true, true] },
  { label: 'Kelola integrasi', allow: [false, false, false, false, true] },
]

export default async function SettingsPage() {
  const [integrations, workflowSteps] = await Promise.all([getIntegrations(), getWorkflows()])
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Platform · Konfigurasi tanpa ubah kode
          </>
        }
        title="Pengaturan & integrasi"
        description="Workflow, aturan payroll berversi, RBAC plus atribut, integrasi SSO/GL/bank, dan lokalisasi — semua perubahan lewat lingkungan uji dan approval."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Tambah konfigurasi
          </button>
        }
      />

      <Panel>
        <Tabs
          items={[
            {
              id: 'workflow',
              label: 'Workflow',
              content: (
                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
                      <Workflow className="size-3.5" />
                      Workflow cuti · berlaku untuk PT Nexa Digital Indonesia · versi 12
                    </div>
                    <ol className="mt-3 space-y-2">
                      {workflowSteps.map((step) => (
                        <li
                          key={step.step}
                          className="flex items-start gap-3 rounded-[18px] border border-white/70 bg-white/50 p-3"
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-semibold text-lime">
                            {step.step}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-semibold text-ink">{step.name}</p>
                            <p className="text-[10.5px] text-muted">{step.detail}</p>
                          </div>
                          <Pill variant="outline" className="px-2 py-0.5 text-[9.5px]">
                            {step.owner}
                          </Pill>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <SubPanel>
                      <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Kondisi</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                        Jika cuti &gt; 3 hari → approval HRBP. Jika saldo tidak cukup → tawarkan cuti tanpa gaji.
                      </p>
                    </SubPanel>
                    <SubPanel>
                      <p className="text-[10px] tracking-[0.08em] text-muted uppercase">SLA & eskalasi</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                        2 hari kerja. Lewat SLA → eskalasi ke HRBP dan notifikasi Teams.
                      </p>
                    </SubPanel>
                    <SubPanel>
                      <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Lingkungan uji</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                        Perubahan workflow diuji di sandbox dan butuh approval sebelum produksi.
                      </p>
                    </SubPanel>
                  </div>
                </div>
              ),
            },
            {
              id: 'payroll',
              label: 'Aturan payroll',
              content: (
                <div>
                  <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 text-[10.5px] text-muted">
                    <ShieldCheck className="size-3.5" />
                    Aturan berversi dan effective-dated. Tidak ada tarif yang di-hardcode di aplikasi.
                  </div>
                  <Table head={['Aturan', 'Versi', 'Efektif', 'Pemilik', 'Status', '']} minWidth="min-w-[680px]">
                    {rules.map((rule) => (
                      <Row key={rule.name}>
