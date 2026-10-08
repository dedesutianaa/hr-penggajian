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
