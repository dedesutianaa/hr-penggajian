import { ArrowUpRight, ClipboardCheck, Clock, LogOut, Plus, UserPlus, Users } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import {
  Avatar,
  Cell,
  CheckCircle,
  Pill,
  Progress,
  Row,
  StatCard,
  StatusPill,
  Table,
} from '@/components/ui/bits'
import { getEmployees, getOffboardingTasks, getOnboardingTasks } from '@/lib/server-data'
import { formatDate } from '@/lib/format'

const templates = [
  { name: 'Karyawan tetap · Indonesia', tasks: 18, owner: 'HR Ops', countries: 'ID' },
  { name: 'Kontrak / PKWT · Indonesia', tasks: 14, owner: 'HR Ops', countries: 'ID' },
  { name: 'Karyawan · Singapura', tasks: 12, owner: 'Clara Wijaya', countries: 'SG' },
]

export default async function OnboardingPage() {
  const [onboardingEmployees, offboardingEmployees, onboardingTasks, offboardingTasks] =
    await Promise.all([
      getEmployees({ status: 'ONBOARDING', page: 1, limit: 20 }),
      getEmployees({ status: 'OFFBOARDING', page: 1, limit: 20 }),
      getOnboardingTasks(),
      getOffboardingTasks(),
    ])

  const onboardingPeople = onboardingEmployees.data.map((emp) => ({
    name: emp.name,
    role: emp.role,
    start: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : '',
    progress: 60,
  }))

  const offboardingPeople = offboardingEmployees.data.map((emp) => ({
    name: emp.name,
    role: emp.role,
    lastDay: emp.lastDay ? new Date(emp.lastDay).toISOString().split('T')[0] : '',
    progress: offboardingTasks.filter((t) => t.employeeId === emp.id && t.done).length / Math.max(1, offboardingTasks.filter((t) => t.employeeId === emp.id).length) * 100 || 45,
    clearance: '2/5',
    finalPay: 'Terpicu',
  }))
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Onboarding & offboarding · Lintas tim
          </>
        }
        title="Onboarding & offboarding"
        description="Checklist per peran, negara, dan entitas dengan tenggat, eskalasi, dan penonaktifan akses otomatis pada hari terakhir kerja."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Mulai onboarding
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
        <StatCard label="Onboarding aktif" value="12" delta="+3" hint="3 mulai minggu ini" icon={<UserPlus className="size-4" />} />
        <StatCard label="Offboarding" value="4" hint="Final pay terpicu otomatis" icon={<LogOut className="size-4" />} />
        <StatCard label="Tugas terlambat" value="3" hint="Eskalasi ke HR Ops" icon={<Clock className="size-4" />} />
        <StatCard label="Rata-rata selesai" value="9 hari" delta="-2 hari" hint="Target 10 hari kerja" icon={<ClipboardCheck className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead
            title="Onboarding berjalan"
            hint="Progres checklist per karyawan baru"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                {onboardingPeople.length} aktif
              </Pill>
            }
          />
          <ul className="mt-3 space-y-2">
            {onboardingPeople.map((person) => (
              <li
                key={person.name}
                className="flex flex-wrap items-center gap-3 rounded-[20px] border border-white/70 bg-white/50 p-3"
              >
                <Avatar name={person.name} tone="lime" size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-ink">{person.name}</p>
                  <p className="truncate text-[10.5px] text-muted">
                    {person.role} · mulai {formatDate(person.start)}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={person.progress} tone={person.progress > 50 ? 'lime' : 'ink'} className="w-32" />
                    <span className="text-[10px] text-muted">{person.progress}%</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-[10.5px] font-medium text-ink-soft"
                >
                  Checklist <ArrowUpRight className="size-3" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
            <Users className="size-3.5" />
            Portal pre-boarding (P1): dokumen, e-sign, data bank & pajak sebelum hari pertama.
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Checklist onboarding" hint="Tugas per karyawan baru" action={<Pill variant="lime" className="px-2 py-1 text-[10px]">{onboardingTasks.filter((t) => t.done).length}/{onboardingTasks.length}</Pill>} />
          <ul className="mt-3 space-y-1.5">
            {onboardingTasks.slice(0, 5).map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/50 px-2.5 py-2"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-ink/5 text-[10px] font-semibold text-ink-soft">
                  01
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-ink">{task.label}</p>
                  <p className="text-[10px] text-muted">{task.owner}</p>
                </div>
                <CheckCircle done={task.done} />
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-2xl border border-white/70 bg-white/50 p-3">
            <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Hari pertama</p>
            <p className="mt-1 text-[12px] font-semibold text-ink">18 November 2026</p>
            <p className="text-[10.5px] text-muted">Buddy: Sinta Maharani · Atasan: Yoga Hartono</p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead title="Tugas offboarding" hint="Clearance, aset, exit interview, final pay" />
          <div className="mt-3">
            <Table head={['Tugas', 'Pemilik', 'Tenggat', 'Status']} minWidth="min-w-[520px]">
              {offboardingTasks.slice(0, 5).map((task) => (
                <Row key={task.id}>
                  <Cell className="text-[12px] font-medium text-ink">{task.label}</Cell>
                  <Cell className="text-[11.5px] text-ink-soft">{task.owner}</Cell>
                  <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                    {task.dueDate ? formatDate(task.dueDate) : '—'}
                  </Cell>
                  <Cell>
                    <StatusPill status={task.done ? 'Selesai' : 'Menunggu'} />
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Offboarding" hint="Clearance, aset, exit interview, final pay" />
          <ul className="mt-3 space-y-2">
            {offboardingPeople.map((person) => (
              <li key={person.name} className="rounded-[20px] border border-white/70 bg-white/50 p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={person.name} tone="peach" size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-ink">{person.name}</p>
                    <p className="truncate text-[10px] text-muted">
                      {person.role} · hari terakhir {formatDate(person.lastDay)}
                    </p>
                  </div>
                  <StatusPill status="Offboarding" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={person.progress} tone="ink" className="flex-1" />
                  <span className="text-[10px] text-muted">{Math.round(person.progress)}%</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <Pill variant="outline" className="px-2 py-0.5 text-[9.5px]">
                    Clearance {person.clearance}
                  </Pill>
                  <Pill variant="outline" className="px-2 py-0.5 text-[9.5px]">
                    Final pay: {person.finalPay}
                  </Pill>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-2xl bg-ink px-3 py-2.5 text-[10.5px] leading-relaxed text-white/70">
            Akses SSO/SCIM dinonaktifkan otomatis maksimal 1 jam setelah tanggal akhir kerja.
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead title="Template checklist" hint="Dikonfigurasi per peran, negara, dan entitas tanpa ubah kode" />
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {templates.map((template) => (
            <SubPanel key={template.name}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[12px] font-semibold text-ink">{template.name}</p>
                  <p className="text-[10px] text-muted">
                    {template.tasks} tugas · {template.owner}
                  </p>
                </div>
                <Pill variant="lime" className="px-2 py-0.5 text-[9.5px]">
                  {template.countries}
                </Pill>
              </div>
              <button
                type="button"
                className="focus-ring mt-2 w-full rounded-full border border-white/80 bg-white/70 px-2.5 py-1.5 text-[10.5px] font-medium text-ink-soft"
              >
                Lihat template
              </button>
            </SubPanel>
          ))}
        </div>
      </Panel>
    </div>
  )
}
