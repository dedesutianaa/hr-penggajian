import { Building2, Layers, Network, Plus, Target } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Pill, Progress, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { formatNumber } from '@/lib/format'
import { getCostCenters, getEntities, getEmployees } from '@/lib/server-data'

const tones: string[] = ['bg-lime', 'bg-mint', 'bg-peach', 'bg-lilac', 'bg-sky']

function OrgNode({ name, role, tone }: { name: string; role: string; tone: string }) {
  return (
    <div className="w-full rounded-[18px] border border-white/80 bg-white/70 p-3 text-center shadow-[0_1px_2px_rgba(20,30,20,0.05)]">
      <span className={`mx-auto grid size-8 place-items-center rounded-full text-[10px] font-semibold text-ink/70 ${tone}`}>
        {name
          .split(' ')
          .slice(0, 2)
          .map((part) => part[0])
          .join('')}
      </span>
      <p className="mt-2 text-[11.5px] font-semibold text-ink">{name}</p>
      <p className="text-[10px] text-muted">{role}</p>
    </div>
  )
}

export default async function OrganizationPage() {
  const [entities, departments, costCenters, employees] = await Promise.all([
    getEntities(),
    Promise.resolve([] as Array<{ id: string; name: string; entityId: string; headcount: number }>),
    getCostCenters(),
    getEmployees({ page: 1, limit: 100 }),
  ])

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Core HR · Struktur & entitas
          </>
        }
        title="Organisasi & entitas"
        description="Entitas hukum, departemen, cost center, posisi, dan garis pelaporan dalam satu struktur yang bisa diaudit."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Tambah unit
          </button>
        }
      />

      <ModuleTabs
        items={[
          { href: '/karyawan', label: 'Direktori' },
          { href: '/organisasi', label: 'Organisasi & entitas' },
          { href: '/onboarding', label: 'Onboarding' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Entitas hukum" value={entities.length} hint="10–30 negara pada fase 2" icon={<Building2 className="size-4" />} />
        <StatCard label="Departemen" value={departments.length} hint="Termasuk 6 unit regional" icon={<Layers className="size-4" />} />
        <StatCard label="Posisi aktif" value={employees.data.length} hint="Data dari direktori karyawan" icon={<Network className="size-4" />} />
        <StatCard label="Cost center" value={costCenters.length} hint="Tersinkron ke GL" icon={<Target className="size-4" />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Bagan organisasi"
            hint="Garis pelaporan solid · dotted line untuk matrix reporting"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                Per 22 Nov 2026
              </Pill>
            }
          />
          <div className="mt-5 overflow-x-auto pb-1">
            <div className="min-w-[680px]">
              <div className="flex justify-center">
                <div className="w-52">
                  <OrgNode name="Adrian Wibowo" role="Chief Executive Officer" tone="bg-lime" />
                </div>
              </div>
              <div className="mx-auto h-6 w-px bg-ink/15" />
              <div className="relative">
                <div className="absolute top-0 right-[12.5%] left-[12.5%] h-px bg-ink/15" />
                <div className="grid grid-cols-4 gap-3">
                  {entities.slice(0, 4).map((entity, index) => (
                    <div key={entity.id} className="flex flex-col items-center">
                      <div className="h-6 w-px bg-ink/15" />
                      <OrgNode
                        name={entity.name.split(' ').slice(0, 2).join(' ')}
                        role={entity.country}
                        tone={tones[index % tones.length]}
